'use server'

import { odooCall } from "../odoo-client";
import { AgentMetric } from "../types/agent";

export async function getAgentsAnalytics() {
  try {
    // 1. Stats des Biens VENDUS (Performance CA)
    // Group By 'x_studio_agent' (qui est un res.partner)
    const soldStats = await odooCall('product.template', 'read_group', [
      [
        ['x_studio_produit_immobilier', '=', true],
        ['x_studio_statut', '=', 'sold'],
        ['x_studio_agent', '!=', false] // On ignore les biens sans agent
      ], 
      ['x_studio_agent', 'list_price'], 
      ['x_studio_agent'] 
    ]) as any[];

    // 2. Stats du Stock ACTIF
    const stockStats = await odooCall('product.template', 'read_group', [
      [
        ['x_studio_produit_immobilier', '=', true],
        ['x_studio_statut', '=', 'available'],
        ['x_studio_agent', '!=', false]
      ], 
      ['x_studio_agent'], 
      ['x_studio_agent']
    ]) as any[];

    // 3. Récupérer la liste unique des IDs de partenaires (Agents)
    // On combine les IDs trouvés dans les ventes et dans le stock
    const agentIds = new Set<number>();
    
    soldStats.forEach((s: any) => { if(s.x_studio_agent) agentIds.add(s.x_studio_agent[0]); });
    stockStats.forEach((s: any) => { if(s.x_studio_agent) agentIds.add(s.x_studio_agent[0]); });

    if (agentIds.size === 0) return [];

    // 4. Récupérer les détails de ces Partenaires (Nom, Email, Image)
    const partners = await odooCall('res.partner', 'search_read', [
      [['id', 'in', Array.from(agentIds)]],
      ['id', 'name', 'email', 'image_128']
    ]) as any[];


    // --- CONSOLIDATION ---
    
    // Fonction helper pour retrouver les stats d'un ID partenaire donné
    const findStat = (statsArray: any[], id: number) => 
      statsArray.find((s: any) => s.x_studio_agent && s.x_studio_agent[0] === id);

    const agents: AgentMetric[] = partners.map((p: any) => {
      const soldData = findStat(soldStats, p.id);
      const stockData = findStat(stockStats, p.id);

      const totalRevenue = soldData ? soldData.list_price : 0;
      const dealsClosed = soldData ? soldData.x_studio_agent_count : 0;
      const activeStock = stockData ? stockData.x_studio_agent_count : 0;

      // Calcul Commission (ex: 5%)
      const estimatedCommission = totalRevenue * 0.05;

      // Calcul Taux de succès : Ventes / (Ventes + Stock Actuel)
      const totalAssignments = dealsClosed + activeStock;
      const conversionRate = totalAssignments > 0 ? Math.round((dealsClosed / totalAssignments) * 100) : 0;

      return {
        id: p.id,
        name: p.name,
        email: p.email || 'Pas d\'email',
        image: p.image_128 ? `data:image/png;base64,${p.image_128}` : undefined,
        totalRevenue,
        dealsClosed,
        estimatedCommission,
        activeLeads: activeStock, // Ici "Leads" correspond au Stock de mandats
        totalLeads: totalAssignments,
        wonLeads: dealsClosed,
        conversionRate
      };
    });

    // Tri par CA décroissant
    return agents.sort((a, b) => b.totalRevenue - a.totalRevenue);

  } catch (error) {
    console.error("Agent Analytics Error:", error);
    return [];
  }
}