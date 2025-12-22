'use server'

import { revalidatePath } from 'next/cache';
import { REContact } from '../types/contact';
import { odooCall } from '../odoo-client';

/**
 * Crée ou met à jour un contact (Partner) dans Odoo
 */
export async function upsertContact(data: REContact) {
  try {
    // 1. Transformation des données : Frontend (CamelCase) -> Odoo (Snake_case)
    const odooPayload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      comment: data.notes || '', // Odoo n'aime parfois pas null
      // Custom fields (Assure-toi qu'ils existent dans Odoo)
      x_studio_role: data.role,
      x_studio_budget_min: data.budgetMin,
      x_studio_budget_max: data.budgetMax,
      x_studio_localisation_prfre: data.preferredLocation,
      x_studio_source: data.source,
      
      // On force le statut client pour être propre dans Odoo
      customer_rank: 1, 
    };

    let partnerId = data.id;

    if (partnerId) {
      // --- UPDATE (WRITE) ---
      // Signature Odoo: write([ids], {values})
      // Avec ton helper odooCall qui prend 'args', on passe: [[id], values]
      await odooCall('res.partner', 'write', [
        [partnerId], 
        odooPayload
      ]);
      
      console.log(`Contact Odoo ${partnerId} mis à jour.`);

    } else {
      // --- CREATE ---
      // Signature Odoo: create([{values}])
      // Avec ton helper: [[values]]
      const result = await odooCall('res.partner', 'create', [
        [odooPayload]
      ]) as number; // Odoo retourne l'ID créé (int)
      
      partnerId = result;
      console.log(`Nouveau contact Odoo créé avec ID: ${partnerId}`);
    }

    // On rafraîchit le cache Next.js si tu as une page qui liste les contacts
    revalidatePath('/admin/contacts'); 
    
    return { success: true, id: partnerId };

  } catch (error: any) {
    console.error("Erreur lors de l'appel Odoo (upsertContact):", error);
    
    // On retourne un message d'erreur propre au front
    return { 
      success: false, 
      error: error.message || "Une erreur est survenue lors de la communication avec Odoo." 
    };
  }
}

export async function getContactById(id: number): Promise<REContact | null> {
  try {
    const result = await odooCall('res.partner', 'search_read', [
      [['id', '=', id]], // Domain
      [
        'id',
        'name', 'email', 'phone', 'comment', 'x_studio_role', 'x_studio_budget_min',
        'x_studio_budget_max', 'x_studio_localisation_prfre', 'x_studio_source',
        'category_id', 'create_date', 'x_studio_type'
      ] // Fields
    ]) as any[];
    
    if (!result || result.length === 0) return null;

    const c = result[0];
    
    return {
      id: c.id,
      name: c.name,
      email: c.email || '',
      phone: c.phone || '',
      notes: c.comment || '',
      role: c.x_studio_role || 'buyer',
      budgetMin: c.x_studio_budget_min || 0,
      budgetMax: c.x_studio_budget_max || 0,
      preferredLocation: c.x_studio_localisation_prfre || '',
      source: c.x_studio_source || 'website',
      x_studio_type: c.x_studio_type || 'private',
      tags: c.category_id || [],
      createdAt: c.create_date || '',
    };
  } catch (error) {
    console.error("Error fetching contact:", error);
    return null;
  }
}

export async function getContacts(
  page: number = 1, 
  pageSize: number = 10, 
  search: string = '', 
  roleFilter: string = ''
) {
  const offset = (page - 1) * pageSize;
  
  // Construction du Domaine Odoo (Filtres)
  const domain: any[] = [['customer_rank', '>', 0]]; // On ne veut que les clients
  
  if (search) {
    domain.push('|', ['name', 'ilike', search], ['email', 'ilike', search]);
  }
  if (roleFilter && roleFilter !== 'all') {
    domain.push(['x_re_role', '=', roleFilter]);
  }

  try {
    // 1. Compter le total pour la pagination
    const totalCount = await odooCall('res.partner', 'search_count', [domain]) as number;

    // 2. Récupérer les données
    const records = await odooCall('res.partner', 'search_read', [
      domain,
      ['id', 'name', 'email', 'phone', 'x_studio_role', 'create_date', 'x_studio_source', 'x_studio_type'], // Fields
      offset, // Offset
      pageSize, // Limit
      'create_date desc' // Order
    ]) as any[];

    // Mapping Odoo -> Frontend
    const contacts: REContact[] = records.map((c: any) => ({
      id: c.id,
      name: c.name,
      email: c.email || '-',
      phone: c.phone || '-',
      role: c.x_studio_role || 'N/A',
      source: c.x_studio_source,
      budgetMin: 0, budgetMax: 0, preferredLocation: '', // Champs non affichés dans la liste
      x_studio_type: c.x_studio_type || 'private',
      createdAt: c.create_date || '',
    }));

    return { contacts, totalCount, totalPages: Math.ceil(totalCount / pageSize) };

  } catch (error) {
    console.error("Error fetching contacts list:", error);
    return { contacts: [], totalCount: 0, totalPages: 0 };
  }
}

export async function getContactHistory(partnerId: number) {
  try {
    // On cherche les messages liés à ce partner
    // model: 'mail.message'
    const messages = await odooCall('mail.message', 'search_read', [
      [
        ['model', '=', 'res.partner'],
        ['res_id', '=', partnerId],
        ['message_type', '!=', 'user_notification'] // On évite les notifs système inutiles
      ],
      ['id', 'date', 'body', 'author_id', 'message_type', 'subtype_id'],
      0, // offset
      20, // limit (les 20 derniers)
      'date desc' // tri
    ]) as any[];

    return messages.map((m: any) => ({
      id: m.id,
      date: m.date,
      body: m.body, // Attention: c'est du HTML brut venant d'Odoo
      author: m.author_id ? m.author_id[1] : 'Système',
      type: m.message_type
    }));
  } catch (error) {
    console.error("Error fetching history:", error);
    return [];
  }
}

// Ajouter une note interne
export async function addLogNote(resId: number, content: string, model: string = 'res.partner') {
  try {
    await odooCall(model, 'message_post', [ // Utilisation du modèle dynamique
      [resId],
      {
        body: content,
        message_type: 'comment',
        subtype_xmlid: 'mail.mt_note', 
      }
    ]);
    
    // Revalidation intelligente selon le modèle
    if (model === 'crm.lead') {
        revalidatePath('/dashboard/leads'); // Pour rafraîchir le drawer si besoin
    } else {
        revalidatePath(`/dashboard/contacts/${resId}`);
    }
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAllTags() {
  try {
    const tags = await odooCall('res.partner.category', 'search_read', [
      [], // Pas de filtre, on veut tout
      ['id', 'name', 'color'] // Champs
    ]) as any[];
    
    return tags.map((t: any) => ({
      id: t.id,
      name: t.name,
      color: t.color // Odoo renvoie un index de couleur (0-11), on gérera le mapping CSS côté front
    }));
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
}

// Mettre à jour les tags d'un contact
// tagsIds est un tableau d'IDs [1, 5, 8]
export async function updateContactTags(partnerId: number, tagIds: number[]) {
  try {
    // [[6, 0, [ids]]] est la commande spéciale Odoo pour REMPLACER une relation Many2many
    await odooCall('res.partner', 'write', [
      [partnerId],
      { category_id: [[6, 0, tagIds]] } 
    ]);
    
    revalidatePath(`/contacts/${partnerId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createPropertyLead(
  propertyId: number, 
  propertyName: string, 
  contactId: number,
  expectedRevenue: number = 0
) {
  try {
    // 1. Récupérer le nom du contact pour le titre du lead
    const contact = await odooCall('res.partner', 'read', [[contactId], ['name']]) as REContact[];
    const contactName = contact[0]?.name || 'Inconnu';

    const leadId = await odooCall('crm.lead', 'create', [{
      name: `${propertyName} - ${contactName}`, // Titre: "Villa Mer - Jean Dupont"
      partner_id: contactId,
      x_studio_bien: propertyId,
      description: `Lead créé depuis l'application pour le bien #${propertyId}: ${propertyName}`,
      type: 'opportunity',
      priority: '2', // High
    }]);

    return { success: true, leadId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getActivityHistory(resModel: string, resId: number) {
  try {
    const messages = await odooCall('mail.message', 'search_read', [
      [
        ['model', '=', resModel], // 'res.partner' ou 'crm.lead'
        ['res_id', '=', resId],
        ['message_type', '!=', 'user_notification'] // On garde les notifs système (tracking) mais pas les trucs purement techniques
      ],
      ['id', 'date', 'body', 'author_id', 'message_type', 'subtype_id', 'tracking_value_ids'], // tracking_value_ids contient les changements de champs
      0, 20, 'date desc'
    ]) as any[];

    // Pour les changements de stage, Odoo stocke ça dans tracking_value_ids
    // C'est complexe à parser via XML-RPC simple sans faire d'autres appels.
    // Mais souvent le 'body' contient déjà un résumé HTML généré par Odoo (ex: "Stage changed: New -> Won")
    
    return messages.map((m: any) => ({
      id: m.id,
      date: m.date,
      body: m.body, // HTML
      author: m.author_id ? m.author_id[1] : 'Système',
      type: m.message_type
    }));
  } catch (error) {
    return [];
  }
}

export async function getContactCounts() {
  try {
    // On utilise read_group pour compter par rôle
    const groups = await odooCall('res.partner', 'read_group', [
        [['customer_rank', '>', 0]], // Filtre global (Clients)
        ['x_studio_type'], // Champ à compter
        ['x_studio_type']  // Group By
    ]) as any[];

    // Initialisation avec des zéros
    const counts = {
        internal_agent: 0,
        internal_agency: 0,
        external_agent: 0,
        external_agency: 0,
        promoter: 0,
        private: 0, // Fallback ou rôle 'buyer'/'tenant'
        all: 0
    };

    let total = 0;
    groups.forEach((g: any) => {
        const role = g.x_studio_type; // ex: 'internal_agent'
        const count = g.x_studio_type;
        if (role && counts.hasOwnProperty(role)) {
            // @ts-ignore
            counts[role] = count;
        } else if (role === 'buyer' || role === 'tenant') {
             // On peut grouper acheteurs/locataires sous "Clients"
             counts.private += count;
        }
        total += count;
    });
    counts.all = total;

    return counts;
  } catch (error) {
    return { internal_agent: 0, internal_agency: 0, external_agent: 0, external_agency: 0, promoter: 0, private: 0, all: 0 };
  }
}