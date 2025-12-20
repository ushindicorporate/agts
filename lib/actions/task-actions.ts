'use server'

import { revalidatePath } from 'next/cache';
import { odooCall } from '../odoo-client';
import { Task } from '../types/task';

// 1. Récupérer les tâches (Groupées ou liste plate)
export async function getMyTasks() {
  try {
    // Odoo filtre automatiquement sur l'utilisateur connecté via l'API si les règles sont standards.
    // Sinon on ajoute ['user_id', '=', uid] (mais on a besoin de l'UID ici).
    // Pour simplifier, mail.activity est souvent visible par assigné.
    
    const activities = await odooCall('mail.activity', 'search_read', [
      [], // On récupère tout ce qui est assigné à l'utilisateur API (ou tout si admin)
          // Idéalement filtrer par ['user_id', '=', ton_user_id_odoo]
      ['id', 'summary', 'note', 'date_deadline', 'activity_type_id', 'res_name', 'res_model', 'res_id', 'state'],
      0,
      50, // Les 50 plus urgentes
      'date_deadline asc'
    ]) as any[];

    const tasks: Task[] = activities.map((a: any) => ({
      id: a.id,
      summary: a.summary || 'Sans titre',
      note: a.note || '',
      dateDeadline: a.date_deadline,
      state: a.state, // 'overdue', 'today', 'planned' (Odoo calcule ça tout seul !)
      type: a.activity_type_id ? a.activity_type_id[1] : 'Autre',
      resName: a.res_name || 'Document',
      resModel: a.res_model,
      resId: a.res_id
    }));

    return tasks;
  } catch (error) {
    console.error("Tasks Error:", error);
    return [];
  }
}

// 2. Marquer comme FAIT (Done)
export async function markTaskDone(taskId: number, feedback: string = "Fait depuis l'App") {
  try {
    // La méthode officielle Odoo pour clore une activité est 'action_feedback'
    await odooCall('mail.activity', 'action_feedback', [
      [taskId],
      feedback // Commentaire de clôture optionnel
    ]);
    revalidatePath('/dashboard/tasks');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// 3. Récupérer les types d'activités (pour le select)
export async function getActivityTypes() {
  const types = await odooCall('mail.activity.type', 'search_read', [[], ['id', 'name']]);
  return types as any[];
}

// 4. Créer une tâche
export async function createTask(data: {
  summary: string;
  date_deadline: string;
  activity_type_id: number;
  res_model: string; // 'res.partner' ou 'crm.lead'
  res_id: number;
}) {
  try {
    await odooCall('mail.activity', 'create', [{
      ...data,
      user_id: 2 // Remplace par l'ID de ton user Odoo (ou dynamique)
    }]);
    revalidatePath('/dashboard/tasks');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}