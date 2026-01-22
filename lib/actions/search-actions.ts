'use server'

import { odooCall } from "../odoo-client";

export async function globalSearch(query: string) {
  if (!query || query.length < 2) return { properties: [], vehicles: [], contacts: [] };

  try {
    // On lance les recherches Odoo en parallèle pour la performance
    const [properties, vehicles, contacts] = await Promise.all([
      // Recherche Immo
      odooCall('product.template', 'search_read', [
        [['x_studio_produit_immobilier', '=', true], ['name', 'ilike', query]],
        ['id', 'name', 'list_price', 'x_studio_statut'],
        0, 3 // On limite à 3 résultats par catégorie pour la rapidité
      ]),
      // Recherche Auto
      odooCall('product.template', 'search_read', [
        [['x_studio_automobile', '=', true], ['name', 'ilike', query]],
        ['id', 'name', 'list_price', 'x_studio_statut_auto'], 
        0, 3
      ]),
      // Recherche Contacts
      odooCall('res.partner', 'search_read', [
        [['name', 'ilike', query]],
        ['id', 'name', 'email', 'phone'],
        0, 3
      ])
    ]);

    return {
      properties: (properties as any[]),
      vehicles: (vehicles as any[]),
      contacts: (contacts as any[])
    };
  } catch (error) {
    console.error("Search error:", error);
    return { properties: [], vehicles: [], contacts: [] };
  }
}