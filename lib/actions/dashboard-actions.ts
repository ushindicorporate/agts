'use server'
import { odooCall } from '../odoo-client';

export async function getDashboardStats() {
  try {
    // 1. Définition des Domaines (Filtres)
    const domainProperties = [['x_studio_produit_immobilier', '=', true]];
    const domainAvailable = [['x_studio_produit_immobilier', '=', true], ['x_studio_statut', '=', 'available']];
    const domainLeads = [['type', '=', 'opportunity']]; // Si tu utilises le module CRM standard

    // 2. Exécution PARALLÈLE (Performance +++)
    const [
      totalProperties,
      availableProperties,
      totalContacts,
      recentLeads,
      recentProperties
    ] = await Promise.all([
      // A. Compte total des biens
      odooCall('product.template', 'search_count', [domainProperties]),
      
      // B. Compte des biens disponibles (pour calculer le ratio)
      odooCall('product.template', 'search_count', [domainAvailable]),
      
      // C. Compte des contacts
      odooCall('res.partner', 'search_count', [[]]),

      // D. Les 5 derniers Leads / Opportunités
      odooCall('crm.lead', 'search_read', [
        [], // Tous les leads
        ['id', 'name', 'partner_id', 'create_date', 'expected_revenue'], 
        0, 
        5, 
        'create_date desc'
      ]),

      // E. Les 5 derniers Biens ajoutés
      odooCall('product.template', 'search_read', [
        domainProperties,
        ['id', 'name', 'list_price', 'x_studio_type', 'x_studio_city', 'image_128'],
        0,
        5,
        'create_date desc'
      ])
    ]);

    // 3. Calcul de la valeur totale du portefeuille (Approximation via les 5 derniers ou une autre méthode si besoin)
    // Note: Faire une somme sur tout la base via XML-RPC est lourd, on va simuler ou rester sur des compteurs pour l'instant.

    return {
      counts: {
        properties: Number(totalProperties),
        available: Number(availableProperties),
        contacts: Number(totalContacts),
        leads: (recentLeads as any[]).length // Ou search_count si tu veux le vrai total
      },
      recentLeads: (recentLeads as any[]).map((l: any) => ({
        id: l.id,
        name: l.name,
        contact: l.partner_id ? l.partner_id[1] : 'Inconnu',
        date: l.create_date,
        revenue: l.expected_revenue || 0
      })),
      recentProperties: (recentProperties as any[]).map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.list_price,
        city: p.x_studio_city || '',
        type: p.x_studio_type || '',
        image: p.image_128
      }))
    };

  } catch (error) {
    console.error("Dashboard Error:", error);
    return {
      counts: { properties: 0, available: 0, contacts: 0, leads: 0 },
      recentLeads: [],
      recentProperties: []
    };
  }
}