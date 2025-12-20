'use server'

import { revalidatePath } from 'next/cache';
import { odooCall } from '../odoo-client';

// 1. Récupérer les documents (Filtrés ou Tous)
export async function getDocuments(resModel?: string, resId?: number) {
  try {
    const domain = [];
    
    // Si on est sur une fiche spécifique, on filtre
    if (resModel && resId) {
      domain.push(['res_model', '=', resModel], ['res_id', '=', resId]);
    } else {
      // Sinon, on affiche les docs des modules principaux pour éviter le bruit système
      domain.push(['res_model', 'in', ['res.partner', 'product.template', 'sale.order', 'crm.lead']]);
    }

    const attachments = await odooCall('ir.attachment', 'search_read', [
      domain,
      ['id', 'name', 'mimetype', 'file_size', 'create_date', 'res_model', 'res_id', 'res_name'],
      0,
      50, // Pagination possible
      'create_date desc'
    ]) as any[];

    return attachments.map((a: any) => ({
      id: a.id,
      name: a.name,
      type: a.mimetype,
      fileSize: a.file_size,
      createDate: a.create_date,
      resModel: a.res_model,
      resId: a.res_id,
      resName: a.res_name
    }));

  } catch (error) {
    console.error("Documents Error:", error);
    return [];
  }
}

// 2. Upload de Document
export async function uploadDocument(data: { 
  name: string; 
  base64: string; 
  resModel: string; 
  resId: number; 
}) {
  try {
    await odooCall('ir.attachment', 'create', [{
      name: data.name,
      type: 'binary',
      datas: data.base64,
      res_model: data.resModel,
      res_id: data.resId,
    }]);
    
    revalidatePath('/dashboard/documents');
    // On revalide aussi la page spécifique si nécessaire
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// 3. Téléchargement (Récupérer le Base64)
export async function getDocumentContent(docId: number) {
  try {
    const result = await odooCall('ir.attachment', 'read', [
      [docId],
      ['datas', 'name', 'mimetype']
    ]) as any[];
    
    if (result.length > 0) {
      return { 
        success: true, 
        base64: result[0].datas, 
        name: result[0].name, 
        mime: result[0].mimetype 
      };
    }
    return { success: false, error: "Fichier introuvable" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// 4. Suppression
export async function deleteDocument(docId: number) {
  try {
    await odooCall('ir.attachment', 'unlink', [[docId]]);
    revalidatePath('/dashboard/documents');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}