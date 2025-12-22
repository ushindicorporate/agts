'use server'

import { revalidatePath } from 'next/cache';
import { odooCall } from '../odoo-client';
import { CRMLead, CRMStage } from '../types/crm';

export async function getPipelineData() {
  try {
    // 1. Récupérer les étapes (Stages)
    const stages = await odooCall('crm.stage', 'search_read', [
      [],
      ['id', 'name', 'sequence',],
      0,
      2000,
      'sequence asc' // Important: l'ordre des colonnes
    ]) as any[];

    // 2. Récupérer les opportunités actives
    const leads = await odooCall('crm.lead', 'search_read', [
      [['type', '=', 'opportunity'], ['active', '=', true]],
      [
        'id', 'name', 'partner_id', 'expected_revenue', 'stage_id', 'priority', 'create_date',
        'phone', 'email_from', 'user_id', 'probability'
      ]
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
      probability: l.probability || 0,
      stageId: l.stage_id ? l.stage_id[0] : 0,
      priority: l.priority,
      createDate: l.create_date,
      phone: l.phone,
      email: l.email_from,
      userId: l.user_id ? l.user_id[0] : null,
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

export async function assignLead(leadId: number, userId: number) {
    try {
        await odooCall('crm.lead', 'write', [[leadId], { user_id: userId }]);
        revalidatePath('/dashboard/leads');
        return { success: true };
    } catch (e) { return { success: false }; }
}

export async function getLeadById(id: number) {
  try {
    const leads = await odooCall('crm.lead', 'search_read', [
      [['id', '=', id]],
      [
        'id', 'name', 'partner_id', 'expected_revenue', 'probability', 
        'stage_id', 'description', 'priority', 'create_date',
        'contact_name', 'email_from', 'phone'
      ]
    ]) as any[];
    
    if (!leads.length) return null;
    const l = leads[0];

    return {
      id: l.id,
      name: l.name,
      partnerId: l.partner_id ? l.partner_id[0] : null,
      partnerName: l.partner_id ? l.partner_id[1] : l.contact_name || 'Prospect',
      email: l.email_from,
      phone: l.phone,
      expectedRevenue: l.expected_revenue || 0,
      probability: l.probability || 0,
      stageName: l.stage_id ? l.stage_id[1] : '',
      description: l.description || '',
      priority: l.priority, // '0', '1', '2', '3'
      createDate: l.create_date
    };
  } catch (e) { return null; }
}

// Action pour marquer comme GAGNÉ / PERDU
export async function setLeadState(id: number, action: 'mark_won' | 'mark_lost') {
    try {
        // Odoo a des méthodes spécifiques pour ça, mais 'write' sur stage_id ou probability marche souvent
        if (action === 'mark_won') {
            // Méthode standard CRM Odoo
            await odooCall('crm.lead', 'action_set_won', [[id]]);
        } else {
            // Pour perdu, c'est plus complexe (il faut une raison), on va juste mettre proba 0 pour l'instant
            await odooCall('crm.lead', 'action_set_lost', [[id]]);
        }
        revalidatePath(`/dashboard/leads/${id}`);
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}