export interface ActivityType {
  id: number;
  name: string; // ex: Email, Call, Meeting, To Do
  icon?: string; // mapping pour l'icone lucide
}

export interface Task {
  id: number;
  summary: string; // Titre (ex: Relancer pour loyer)
  note: string;    // Description HTML
  dateDeadline: string; // YYYY-MM-DD
  state: 'overdue' | 'today' | 'planned';
  type: string;    // Call, Meeting, etc.
  
  // Lien vers l'objet concerné (ex: Le nom du Client ou du Bien)
  resName: string; 
  resModel: string; // 'res.partner', 'crm.lead', etc.
  resId: number;
}