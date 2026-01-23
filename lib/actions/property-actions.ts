'use server'

import { revalidatePath } from 'next/cache';
import { odooCall } from '../odoo-client';
import { Property } from '../types/property';

interface PropertyFilters {
    search?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    minSurface?: number;
    city?: string;
    statuses?: string[];  // Nouveau : Tableau de statuts (ex: ['À louer', 'Réservé'])
    ownerIds?: number[];  // Nouveau : Tableau d'IDs de propriétaires
}

// --- LECTURE ---
export async function getProperties(page = 1, pageSize = 9, filters: PropertyFilters = {}) {
  const offset = (page - 1) * pageSize;
  const domain: any[] = [['x_studio_produit_immobilier', '=', true]];

  // 1. Recherche Texte
  if (filters.search) {
    domain.push(['name', 'ilike', filters.search]);
  }

  // 2. Type de bien
  if (filters.type && filters.type !== 'all') {
    domain.push(['x_studio_type', '=', filters.type]);
  }

  // 3. Commune (City)
  if (filters.city && filters.city !== 'all') {
    domain.push(['x_studio_city', '=', filters.city]);
  }

  // 4. FILTRE MULTI-STATUTS (x_studio_statut)
  // Odoo utilise l'opérateur 'in' pour comparer avec un tableau de valeurs
  if (filters.statuses && filters.statuses.length > 0) {
    domain.push(['x_studio_statut', 'in', filters.statuses]);
  }

  // 5. FILTRE MULTI-PROPRIÉTAIRES
  if (filters.ownerIds && filters.ownerIds.length > 0) {
    domain.push(['x_studio_owner', 'in', filters.ownerIds]);
  }

  // 6. Prix & Surface
  if (filters.minPrice) domain.push(['list_price', '>=', filters.minPrice]);
  if (filters.maxPrice) domain.push(['list_price', '<=', filters.maxPrice]);
  if (filters.minSurface) domain.push(['x_studio_surface_m', '>=', filters.minSurface]);

  try {
    const totalCount = await odooCall('product.template', 'search_count', [domain]) as number;

    const records = await odooCall('product.template', 'search_read', [
        domain,
        [
            'id', 'name', 'list_price', 
            'x_studio_type', 'x_studio_localisation_adresse_quartier', 
            'x_studio_city', 'x_studio_statut', 'x_studio_surface_m',
            'x_studio_nb_chambres', 'x_studio_commission'
        ],
        offset,
        pageSize,
        'create_date desc'
    ]) as any[];

    const properties: Property[] = records.map((p: any) => {
      // LOGIQUE DE MAPPING DU STATUT (Entreprise)
      // On convertit le x_studio_statut d'Odoo vers les types techniques de ton App
      const odooStatus = p.x_studio_statut || 'À louer';
      
      let techStatus: Property['status'] = 'available';
      if (odooStatus === 'Vendu') techStatus = 'sold';
      if (odooStatus === 'Loué') techStatus = 'rented';
      if (odooStatus === 'Réservé') techStatus = 'reserved';

      return {
        id: p.id,
        name: p.name,
        price: p.list_price || 0,
        type: p.x_studio_type || 'apartment', 
        address: p.x_studio_localisation_adresse_quartier || '', 
        city: p.x_studio_city || '', 
        surface: p.x_studio_surface_m || 0,
        bedrooms: p.x_studio_nb_chambres || 0,
        
        // Mapping intelligent
        status: techStatus, 
        offerType: odooStatus as any, // 'À vendre' ou 'À louer'
        
        commission: p.x_studio_commission || 0,
        activeLeads: 0, 
        mainImage: `/api/image/product.template/${p.id}`,
      };
    });

    return { properties, totalCount, totalPages: Math.ceil(totalCount / pageSize) };

  } catch (error) {
    console.error("Odoo Fetch Error:", error);
    return { properties: [], totalCount: 0, totalPages: 0 };
  }
}

// Récupérer un bien unique pour l'édition
export async function getPropertyById(id: number): Promise<Property | null> {
    try {
        const records = await odooCall('product.template', 'search_read', [
        [['id', '=', id]],
        [
            'id',
            'name',
            'list_price',
            'x_studio_type',
            'x_studio_localisation_adresse_quartier',
            'x_studio_city',
            'x_studio_surface_m',
            'x_studio_commission',
            'x_studio_statut',
            'x_studio_owner',
            'x_studio_nb_chambres',
        ]
        ]) as any[];
        
        if (!records.length) return null;
        const p = records[0];

        return {
            id: p.id,
            name: p.name,
            price: p.list_price || 0,
            type: p.x_studio_type || 'apartment',
            address: p.x_studio_localisation_adresse_quartier || '',
            city: p.x_studio_city || '',
            commission: p.x_studio_commission || 0,
            status: p.x_studio_statut || 'available',
            offerType: p.x_studio_statut || 'À vendre',
            ownerId: p.x_re_owner_id ? p.x_re_owner_id[0] : undefined,
            ownerName: p.x_re_owner_id ? p.x_re_owner_id[1] : undefined,
            surface: p.x_studio_surface_m || 0,
            bedrooms: p.x_studio_nb_chambres || 0,
            salons: p.x_studio_nb_salons || 0,
            kitchens: p.x_studio_nb_cuisines || 0,
            bathrooms: p.x_studio_nb_salle_de_bain || 0,
            parking: p.x_studio_parking || false,
        };
    } catch (error) {
        return null;
    }
}

// --- ÉCRITURE (UPSERT) ---

export async function upsertProperty(data: any) {
  try {
    const odooPayload = {
      name: data.name,
      list_price: data.price,
      x_studio_type: data.type,
      x_studio_localisation_adresse_quartier: data.address,
      x_studio_city: data.city,
      x_studio_commission: data.commission,
      
      // SOURCE DE VÉRITÉ UNIQUE POUR AGTS
      x_studio_statut: data.x_studio_statut, 
      
      x_studio_owner: data.ownerId || false,
      x_studio_surface_m: data.surface,
      x_studio_nb_chambres: data.bedrooms || 0,
      x_studio_nb_salons: data.salons || 0,
      x_studio_nb_cuisines: data.kitchens || 0,
      x_studio_nb_salle_de_bain: data.bathrooms || 0,
      x_studio_description: data.description,
      x_studio_produit_immobilier: true,
      sale_ok: true,
    };

    let propertyId = data.id;

    if (propertyId) {
      await odooCall('product.template', 'write', [[propertyId], odooPayload]);
    } else {
      propertyId = await odooCall('product.template', 'create', [[odooPayload]]) as number;
    }

    revalidatePath('/dashboard/properties');
    return { success: true, id: propertyId };

  } catch (error: any) {
    console.error("Odoo Property Error:", error);
    return { success: false, error: error.message };
  }
}

// Helper pour récupérer la liste des propriétaires (Contacts) pour le select
// On réutilise res.partner mais on filtre peut-être sur ceux qui sont "Propriétaires"
export async function getOwnersForFilter() {
  try {
    const owners = await odooCall('res.partner', 'search_read', [
      [['x_studio_role', 'in', ['landlord', 'seller']]], // Filtre : a un rôle défini
      ['id', 'name', 'x_studio_role']
    ]) as any[];
    
    return owners.map(o => ({
      id: o.id,
      name: o.name,
      role: o.x_studio_role
    }));
  } catch (e) {
    return [];
  }
}

export async function getPropertyLeads(propertyId: number) {
  try {
    // On cherche les leads où le champ x_studio_property_id correspond à notre bien
    // Si tu utilises le standard Odoo, c'est parfois lié via des tags ou des descriptions,
    // mais le champ Many2one x_studio_property_id est le plus propre.
    const leads = await odooCall('crm.lead', 'search_read', [
      [['x_studio_bien', '=', propertyId]], // Assure-toi que ce champ existe dans Odoo
      ['id', 'name', 'partner_id', 'stage_id', 'expected_revenue', 'create_date']
    ]) as any[];

    return leads.map((l: any) => ({
      id: l.id,
      name: l.name,
      partner: l.partner_id ? l.partner_id[1] : 'Inconnu',
      stage: l.stage_id ? l.stage_id[1] : 'Nouveau',
      revenue: l.expected_revenue,
      date: l.create_date
    }));
  } catch (error) {
    return [];
  }
}

export async function getPropertiesByOwner(ownerId: number) {
  try {
    const domain = [
      ['x_studio_produit_immobilier', '=', true],
      ['x_studio_owner', '=', ownerId]
    ];

    const records = await odooCall('product.template', 'search_read', [
      domain,
      ['id', 'name', 'list_price', 'x_studio_statut', 'x_studio_type', 'image_128']
    ]) as any[];

    return records.map(p => ({
      id: p.id,
      name: p.name,
      price: p.list_price,
      status: p.x_studio_statut,
      type: p.x_studio_type,
      image: `/api/image/product.template/${p.id}`
    }));
  } catch (error) {
    return [];
  }
}