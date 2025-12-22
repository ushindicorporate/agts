export interface CRMStage {
  id: number;
  name: string;
  sequence: number;
  probability?: number; // Probabilité de succès en pourcentage
}

export interface CRMLead {
  id: number;
  name: string; // Titre de l'opportunité (ex: Villa Cocody - M. Koffi)
  partnerName?: string;
  expectedRevenue: number;
  probability?: number;
  stageId: number;
  priority?: string; // '0', '1', '2', '3' stars in Odoo
  createDate: string;
  phone?: string;
  email?: string;
  userId?: number | null;
}
