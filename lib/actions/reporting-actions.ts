'use server'

import { odooCall } from "../odoo-client";

export async function getReportingData() {
  try {
    // 1. VENTES MENSUELLES (Derniers 12 mois)
    // On groupe les commandes validées par "date_order" au format mois
    const salesByMonth = await odooCall('sale.order', 'read_group', [
      [['state', 'in', ['sale', 'done']]], // Filtre: Ventes validées
      ['amount_total', 'date_order'],      // Champs à calculer
      ['date_order:month']                 // Group By Mois
    ]) as any[];

    // 2. PERFORMANCE DES SOURCES DE LEADS
    // D'où viennent nos clients ? (Web, Email, Tel...)
    const leadsBySource = await odooCall('crm.lead', 'read_group', [
      [['type', '=', 'opportunity']], 
      ['source_id'], // On compte juste le nombre
      ['source_id']  // Group By Source
    ]) as any[];

    // 3. PRÉVISIONS (FORECAST)
    // Basé sur le "Revenu Espéré" des opportunités en cours, pondéré par la probabilité
    // Odoo calcule 'expected_revenue' * 'probability' si on le demande bien, 
    // mais ici on va faire simple : Somme des expected_revenue par étape.
    const forecastByStage = await odooCall('crm.lead', 'read_group', [
      [['type', '=', 'opportunity'], ['probability', '<', 100], ['probability', '>', 0]], // En cours
      ['expected_revenue', 'stage_id'],
      ['stage_id']
    ]) as any[];

    // 4. PRODUCTIVITÉ AGENTS (Top 5 par CA)
    // On reprend la logique du module Agents mais groupée pour le graph
    const salesByAgent = await odooCall('sale.order', 'read_group', [
      [['state', 'in', ['sale', 'done']]],
      ['amount_total', 'user_id'],
      ['user_id']
    ]) as any[];


    // --- FORMATAGE POUR RECHARTS ---

    // 1. Formatage Sales
    const salesData = salesByMonth.map((s: any) => ({
      name: s.date_order, // ex: "June 2024"
      value: s.amount_total
    }));

    // 2. Formatage Sources
    const sourceData = leadsBySource.map((s: any) => ({
      name: s.source_id ? s.source_id[1] : 'Indéfini',
      value: s.source_id_count
    }));

    // 3. Formatage Forecast (Pipeline Funnel)
    const funnelData = forecastByStage.map((f: any) => ({
      name: f.stage_id ? f.stage_id[1] : 'Nouveau',
      value: f.expected_revenue
    }));

    // 4. Formatage Agents
    const agentData = salesByAgent.map((a: any) => ({
      name: a.user_id ? a.user_id[1] : 'Agence',
      value: a.amount_total
    })).sort((a, b) => b.value - a.value).slice(0, 5); // Top 5

    return {
      salesData,
      sourceData,
      funnelData,
      agentData
    };

  } catch (error) {
    console.error("Reporting Error:", error);
    return { salesData: [], sourceData: [], funnelData: [], agentData: [] };
  }
}