'use server'

import { revalidatePath } from 'next/cache';
import { odooCall } from '../odoo-client';

const REAL_ESTATE_STAGES = [
  { name: 'Nouveau Lead', sequence: 10 },
  { name: 'Qualifié', sequence: 20 },
  { name: 'Visite Planifiée', sequence: 30 },
  { name: 'Négociation', sequence: 40 },
  { name: 'Offre Acceptée', sequence: 50 },
  { name: 'Contrat Signé', sequence: 60 },
  { name: 'Clôturé / Vendu', sequence: 70, is_won: true, fold: true }
];

export async function initializePipeline() {
  try {
    let createdCount = 0;

    for (const stage of REAL_ESTATE_STAGES) {
      // 1. Vérifier si l'étape existe déjà (par nom)
      const existing = await odooCall('crm.stage', 'search_count', [
        [['name', '=', stage.name]]
      ]) as number;

      if (existing === 0) {
        // 2. Création
        await odooCall('crm.stage', 'create', [{
          name: stage.name,
          sequence: stage.sequence,
          is_won: stage.is_won || false, // Marque l'étape comme "Gagné" (barre verte dans Odoo)
          fold: stage.fold || false // Replié par défaut ?
        }]);
        createdCount++;
      }
    }

    revalidatePath('/dashboard/leads');
    return { success: true, message: `${createdCount} étapes créées.` };

  } catch (error: any) {
    console.error("Init Pipeline Error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteStage(stageId: number) {
  try {
    // On essaie de supprimer
    await odooCall('crm.stage', 'unlink', [[stageId]]);
    
    revalidatePath('/dashboard/leads');
    return { success: true };
  } catch (error: any) {
    console.error("Delete Stage Error:", error);
    // Souvent l'erreur est "Constraint Error" si des leads sont liés
    return { 
      success: false, 
      error: "Impossible de supprimer cette étape (elle contient peut-être des opportunités ou est verrouillée par Odoo)." 
    };
  }
}

export async function renameStage(stageId: number, newName: string) {
  try {
    if (!newName.trim()) throw new Error("Le nom ne peut pas être vide");

    await odooCall('crm.stage', 'write', [
      [stageId],
      { name: newName }
    ]);
    
    revalidatePath('/dashboard/leads');
    return { success: true };
  } catch (error: any) {
    console.error("Rename Stage Error:", error);
    return { success: false, error: error.message };
  }
}