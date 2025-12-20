'use server'
import { odooCall } from '../odoo-client';
import { getAgentsAnalytics } from './agent-actions';

export async function getDashboardStats() {
  try {
    // Domaines
    const domainProperties = [['x_studio_produit_immobilier', '=', true]];
    const domainOffers = []; // Toutes les offres
    // Pour les tâches, Odoo filtre souvent par défaut sur l'user, sinon on récupère tout
    const domainTasks = []; 

    // Exécution PARALLÈLE (7 requêtes en même temps)
    const [
      countProperties,
      countContacts,
      countLeads,
      countOffers,
      countTasks,
      recentOffers,
      urgentTasks
    ] = await Promise.all([
      // 1. Compteurs
      odooCall('product.template', 'search_count', [domainProperties]),
      odooCall('res.partner', 'search_count', [[]]),
      odooCall('crm.lead', 'search_count', [[['type', '=', 'opportunity']]]),
      odooCall('sale.order', 'search_count', [[]]),
      odooCall('mail.activity', 'search_count', [[]]),

      // 2. Dernières Offres (Limit 5)
      odooCall('sale.order', 'search_read', [
        [],
        ['id', 'name', 'partner_id', 'amount_total', 'state', 'date_order'],
        0,
        5,
        'date_order desc'
      ]),

      // 3. Tâches Urgentes (Limit 5, triées par deadline)
      odooCall('mail.activity', 'search_read', [
        [],
        ['id', 'summary', 'date_deadline', 'res_name', 'activity_type_id'],
        0,
        5,
        'date_deadline asc'
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
        contacts: Number(countContacts),
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
      counts: { properties: 0, contacts: 0, leads: 0, offers: 0, tasks: 0 },
      financials: { recentVolume: 0 },
      recentOffers: [],
      urgentTasks: [],
      topAgents: []
    };
  }
}