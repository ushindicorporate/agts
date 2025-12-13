"use server";

import { odooCall } from "@/lib/odoo-client";
import { z } from "zod";

// Type pour un Lead qui vient de l'API Odoo (Lecture)
export interface CrmLead {
  id: number;
  name: string; // Le titre de l'opportunité
  
  // Note importante : Odoo renvoie 'false' (boolean) si le champ texte est vide
  contact_name: string | false; 
  email_from: string | false;
  phone: string | false;
  
  expected_revenue: number;
  
  // Les champs Many2one (Relation) reviennent sous forme [ID, "Label"]
  // ou 'false' si vide
  stage_id: [number, string] | false; 
  
  priority: "0" | "1" | "2" | "3";
  create_date: string; // Format "YYYY-MM-DD HH:mm:ss"
  description?: string | false;
}

export type CreateLeadInput = z.infer<typeof leadSchema>;

// Type de retour standard pour nos actions
type ActionResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  id?: number; // Pour la création
};

// --- SCHÉMA ZOD ---
const leadSchema = z.object({
  contact_name: z.string().min(2, "Nom du client requis"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(8, "Téléphone requis"),
  name: z.string().min(3, "Sujet requis (ex: Intérêt Villa)"), // Le titre du lead
  expected_revenue: z.coerce.number().min(0),
  description: z.string().optional(),
  priority: z.enum(["0", "1", "2", "3"]), // Étoiles (0=Low, 3=High)
});

// --- ACTION : CRÉER UN LEAD ---
export async function createLeadAction(formData: any) {
  try {
    const data = leadSchema.parse(formData);
    const odooModel = "crm.lead";

    const record = {
      name: data.name, // Titre de l'opportunité
      contact_name: data.contact_name,
      email_from: data.email,
      phone: data.phone,
      expected_revenue: data.expected_revenue, // Budget estimé ($)
      description: data.description, // Notes internes
      priority: data.priority,
      type: "opportunity", // On crée directement une opportunité
      // user_id: L'ID de l'agent (Optionnel, Odoo mettra celui qui a fait l'appel API ou Admin par défaut)
    };

    console.log("💼 Création Lead CRM...", record.name);
    
    const newId = await odooCall(odooModel, "create", [[record]]);
    
    return { success: true, id: newId as number };

  } catch (error: any) {
    console.error("❌ Erreur CRM Create:", error);
    return { success: false, error: error.message };
  }
}

// --- ACTION : LISTER LES LEADS ---
export async function getLeadsAction() {
  try {
    const odooModel = "crm.lead";
    
    // On récupère les infos vitales + l'étape (stage_id)
    const fields = [
      "id", 
      "name", 
      "contact_name", 
      "phone", 
      "expected_revenue", 
      "stage_id", // Odoo renvoie [id, "Nom étape"] (ex: [1, "Nouveau"])
      "priority",
      "create_date"
    ];
    
    // On trie par date de création descendante
    // Note: search_read ne supporte pas toujours 'order' direct en paramètre simple XMLRPC, 
    // mais Odoo le fait par défaut souvent. Sinon il faut passer 'order': 'create_date desc' dans le contexte.
    // Appel Odoo
    const result = await odooCall(odooModel, "search_read", [[], fields]);
    
    // Cast explicite vers notre Type CrmLead[]
    const leads = result as CrmLead[];
    
    return { success: true, data: leads };
  } catch (error: any) {
    console.error("❌ Erreur CRM List:", error);
    return { success: false, error: error.message, data: [] };
  }
}