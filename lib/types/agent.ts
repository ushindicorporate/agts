export interface AgentMetric {
  id: number;
  name: string;
  email: string;
  image?: string; // Avatar
  
  // Ventes
  totalRevenue: number; // Chiffre d'affaires généré
  dealsClosed: number;  // Nombre de ventes signées
  estimatedCommission: number; // Calculé (ex: 5% du CA)
  
  // Pipeline CRM
  totalLeads: number;   // Total des leads assignés
  wonLeads: number;     // Leads gagnés
  activeLeads: number;  // Leads en cours
  conversionRate: number; // (Won / Total) * 100
}