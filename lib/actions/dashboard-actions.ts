'use server'
import { odooCall } from '../odoo-client';
import { getAgentsAnalytics } from './agent-actions';

export async function getDashboardStats() {
  try {
    // Domaines
    const domainProperties = [['x_studio_produit_immobilier', '=', true]];
    const domainVehicles = [['x_studio_automobile', '=', true]];

    // Exécution PARALLÈLE (7 requêtes en même temps)
    const [
      countProperties,
      countVehicles, // NOUVEAU
      countLeads,
      countOffers,
      countTasks,
      recentOffers,
      urgentTasks
    ] = await Promise.all([
      odooCall('product.template', 'search_count', [domainProperties]),
      odooCall('product.template', 'search_count', [domainVehicles]), // On récupère le stock auto
      odooCall('crm.lead', 'search_count', [[['type', '=', 'opportunity']]]),
      odooCall('sale.order', 'search_count', [[]]),
      odooCall('mail.activity', 'search_count', [[]]),
      
      odooCall('sale.order', 'search_read', [
        [], ['id', 'name', 'partner_id', 'amount_total', 'state', 'date_order'], 0, 5, 'date_order desc'
      ]),
      
      odooCall('mail.activity', 'search_read', [
        [], ['id', 'summary', 'date_deadline', 'res_name', 'activity_type_id'], 0, 5, 'date_deadline asc'
      ])
    ]);
    const allAgents = await getAgentsAnalytics();
    // On ne garde que le top 3 pour le widget
    const topAgents = allAgents.slice(0, 3).map(a => ({
        id: a.id,
        name: a.name,
        image: a.image,
        revenue: a.totalRevenue,
        deals: a.dealsClosed
    }));

    // Calcul du montant total des 5 dernières offres (Juste pour l'exemple KPI rapide)
    const recentVolume = (recentOffers as any[]).reduce((acc, curr) => acc + (curr.amount_total || 0), 0);

    return {
      counts: {
        properties: Number(countProperties),
        vehicles: countVehicles ? Number(countVehicles) : 0, // Ajouté
        leads: Number(countLeads),
        offers: Number(countOffers),
        tasks: Number(countTasks)
      },
      financials: {
        recentVolume
      },
      recentOffers: (recentOffers as any[]).map((o: any) => ({
        id: o.id,
        name: o.name,
        client: o.partner_id ? o.partner_id[1] : 'Inconnu',
        amount: o.amount_total,
        state: o.state,
        date: o.date_order
      })),
      urgentTasks: (urgentTasks as any[]).map((t: any) => ({
        id: t.id,
        summary: t.summary || 'Sans titre',
        deadline: t.date_deadline,
        target: t.res_name,
        type: t.activity_type_id ? t.activity_type_id[1] : 'Tâche'
      })),
      topAgents
    };

  } catch (error) {
    console.error("Dashboard Error:", error);
    // Retour de secours pour ne pas planter l'UI
    return {
      counts: { properties: 0, contacts: 0, leads: 0, offers: 0, tasks: 0, vehicles: 0 },
      financials: { recentVolume: 0 },
      recentOffers: [],
      urgentTasks: [],
      topAgents: []
    };
  }
}