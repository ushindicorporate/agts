'use server'

import { revalidatePath } from 'next/cache';
import { REContact } from '../types/real-estate';
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
      ['id', 'name', 'email', 'phone', 'comment', 'x_studio_role', 'x_studio_budget_min', 'x_studio_budget_max', 'x_studio_localisation_prfre', 'x_studio_source', 'category_id', 'create_date'] // Fields
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
      ['id', 'name', 'email', 'phone', 'x_studio_role', 'create_date', 'x_studio_source'], // Fields
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
      budgetMin: 0, budgetMax: 0, preferredLocation: '' // Champs non affichés dans la liste
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
export async function addLogNote(partnerId: number, content: string) {
  try {
    await odooCall('res.partner', 'message_post', [
      [partnerId],
      {
        body: content,
        message_type: 'comment',
        subtype_xmlid: 'mail.mt_note', // Important: mt_note = Note interne (pas d'email envoyé au client)
      }
    ]);
    revalidatePath(`/contacts/${partnerId}`);
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