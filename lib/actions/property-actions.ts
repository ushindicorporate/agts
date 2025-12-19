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
}

// --- LECTURE ---
export async function getProperties(page = 1, pageSize = 9, filters: PropertyFilters = {}) {
  const offset = (page - 1) * pageSize;
  const domain: any[] = [['x_studio_produit_immobilier', '=', true]];

  // 1. Recherche Texte
  if (filters.search) {
    domain.push(['name', 'ilike', filters.search]);
  }

  // 2. Type (Selection)
  if (filters.type && filters.type !== 'all') {
    domain.push(['x_studio_type', '=', filters.type]);
  }

  // 3. Prix (Float)
  if (filters.minPrice) {
    domain.push(['list_price', '>=', filters.minPrice]);
  }
  if (filters.maxPrice) {
    domain.push(['list_price', '<=', filters.maxPrice]);
  }

  // 4. Surface (Float - si le champ existe dans Odoo)
  // Assure-toi que 'x_studio_surface' est bien le nom technique dans Odoo
  if (filters.minSurface) {
    domain.push(['x_studio_surface', '>=', filters.minSurface]);
  }

  try {
    const totalCount = await odooCall('product.template', 'search_count', [domain]) as number;

    // 2. On ajoute 'image_128' aux champs demandés
    const records = await odooCall('product.template', 'search_read', [
        domain,
        [
            'id', 
            'name', 
            'list_price', 
            'image_512',
            'x_studio_type', 
            'x_studio_localisation_adresse_quartier', 
            'x_studio_city', 
            'x_studio_statut',
            'x_studio_surface_m',
            'x_studio_nb_chambres',
            // Ajoute ici les champs offer_type ou commission si tu décides de les utiliser plus tard
            // 'x_studio_offer_type', 
        ],
        offset,
        pageSize,
        'create_date desc'
    ]) as any[];

    // 3. Mapping : Champs Odoo (Studio) -> Champs App (TypeScript)
    const properties: Property[] = records.map((p: any) => ({
      id: p.id,
      name: p.name,
      price: p.list_price || 0,
      
      // Mapping des champs Studio vers nos noms internes
      type: p.x_studio_type || 'apartment', 
      address: p.x_studio_localisation_adresse_quartier || '', 
      city: p.x_studio_city || '', 
      surface: p.x_studio_surface_m || 0,
      bedrooms: p.x_studio_nb_chambres || 0,
      
      // Valeurs par défaut si le champ n'est pas encore dans Odoo
      offerType: p.x_studio_offer_type || 'sale', 
      commission: 0, 
      status: p.x_studio_statut || 'available',
      
      ownerId: undefined, // Tu as commenté le owner, donc on laisse undefined
      ownerName: undefined,

      // 4. Traitement de l'image
      // Odoo retourne 'false' (booléen) s'il n'y a pas d'image, sinon le string base64
      mainImage: p.image_512 
        ? `data:image/png;base64,${p.image_512}` 
        : undefined // Le composant UI gérera l'image par défaut
    }));

    return { properties, totalCount, totalPages: Math.ceil(totalCount / pageSize) };

  } catch (error) {
    console.error("Error fetching properties:", error);
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
            // 'x_studio_commission',
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
            offerType: p.x_studio_offer_type || 'sale',
            commission: p.x_studio_commission || 0,
            status: p.x_studio_statut || 'available',
            ownerId: p.x_re_owner_id ? p.x_re_owner_id[0] : undefined,
            ownerName: p.x_re_owner_id ? p.x_re_owner_id[1] : undefined,
            surface: p.x_studio_surface_m || 0,
            bedrooms: p.x_studio_nb_chambres || 0,
        };
    } catch (error) {
        return null;
    }
}

// --- ÉCRITURE (UPSERT) ---

export async function upsertProperty(data: Property) {
  try {
    const odooPayload = {
      name: data.name,
      list_price: data.price,
      // Custom Fields
      x_re_type: data.type,
      x_re_address: data.address,
      x_re_city: data.city,
      x_re_offer_type: data.offerType,
      x_re_commission: data.commission,
      x_re_status: data.status,
      x_re_owner_id: data.ownerId || false, // false pour null dans Odoo
      
      // Flags standards
      sale_ok: true, // On considère que c'est un produit vendable
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
export async function getOwnersList() {
    try {
        const owners = await odooCall('res.partner', 'search_read', [
            [], // Tu pourrais filtrer [['x_re_role', '=', 'landlord']]
            ['id', 'name']
        ]) as any[];
        return owners.map((o: any) => ({ id: o.id, name: o.name }));
    } catch (e) {
        return [];
    }
}