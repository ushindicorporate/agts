'use server'

import { revalidatePath } from 'next/cache';
import { odooCall } from '../odoo-client';
import { CRMLead, CRMStage } from '../types/crm';

export async function getPipelineData() {
  try {
    // 1. Récupérer les étapes (Stages)
    const stages = await odooCall('crm.stage', 'search_read', [
      [], // On peut filtrer par équipe de vente si besoin
      ['id', 'name', 'sequence'],
      0,
      2000,
      'sequence asc' // Important: l'ordre des colonnes
    ]) as any[];

    // 2. Récupérer les opportunités actives
    const leads = await odooCall('crm.lead', 'search_read', [
      [['type', '=', 'opportunity'], ['active', '=', true]],
      ['id', 'name', 'partner_id', 'expected_revenue', 'stage_id', 'priority', 'create_date']
    ]) as any[];

    // Mapping
    const formattedStages: CRMStage[] = stages.map((s: any) => ({
      id: s.id,
      name: s.name,
      sequence: s.sequence
    }));

    const formattedLeads: CRMLead[] = leads.map((l: any) => ({
      id: l.id,
      name: l.name,
      partnerName: l.partner_id ? l.partner_id[1] : 'Inconnu',
      expectedRevenue: l.expected_revenue || 0,
      stageId: l.stage_id ? l.stage_id[0] : 0,
      priority: l.priority,
      createDate: l.create_date
    }));

    return { stages: formattedStages, leads: formattedLeads };

  } catch (error) {
    console.error("Pipeline Error:", error);
    return { stages: [], leads: [] };
  }
}

// Action de déplacement de carte
export async function updateLeadStage(leadId: number, newStageId: number) {
  try {
    await odooCall('crm.lead', 'write', [
      [leadId],
      { stage_id: newStageId }
    ]);
    // Pas de revalidatePath ici pour éviter un clignotement, 
    // on gérera l'état optimiste côté client.
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}