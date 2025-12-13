"use server";

import { odooCall } from "@/lib/odoo-client";
import { z } from "zod";

// ---------------------------------------------------------
// 1. TYPES
// ---------------------------------------------------------

export interface CalendarEvent {
  id: number;
  name: string; // Sujet du RDV
  start: string; // "YYYY-MM-DD HH:mm:ss" (UTC)
  stop: string;  // "YYYY-MM-DD HH:mm:ss" (UTC)
  description?: string | false;
  location?: string | false;
  
  // Odoo renvoie souvent false si vide
  duration?: number;
}

// Schéma Zod pour la création
const eventSchema = z.object({
  name: z.string().min(3, "Sujet requis"),
  start_date: z.date(), // Date JS
  start_time: z.string().regex(/^\d{2}:\d{2}$/, "Format HH:MM invalide"),
  duration: z.coerce.number().min(0.5).max(8), // En heures
  description: z.string().optional(),
  location: z.string().optional(),
});

export type CreateEventInput = z.infer<typeof eventSchema>;

type ActionResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// ---------------------------------------------------------
// 2. ACTIONS
// ---------------------------------------------------------

export async function getEventsAction(): Promise<ActionResponse<CalendarEvent[]>> {
  try {
    const odooModel = "calendar.event";
    const fields = ["id", "name", "start", "stop", "description", "location", "duration"];
    
    // Pour l'exemple, on récupère tout (idéalement filtrer par date)
    const events = await odooCall(odooModel, "search_read", [[], fields]);
    
    return { success: true, data: events as CalendarEvent[] };
  } catch (error: any) {
    console.error("❌ Erreur Calendar List:", error);
    return { success: false, error: error.message, data: [] };
  }
}

export async function createEventAction(formData: CreateEventInput): Promise<ActionResponse<null>> {
  try {
    const data = eventSchema.parse(formData);
    const odooModel = "calendar.event";

    // 1. Construction de la date de début (Combiner Date + Heure)
    // Attention : Il faut idéalement convertir en UTC pour Odoo
    // Ici on fait simple : on crée une date locale et on la formatera
    const [hours, minutes] = data.start_time.split(':').map(Number);
    
    const startDate = new Date(data.start_date);
    startDate.setHours(hours, minutes, 0);

    // Date de fin
    const endDate = new Date(startDate.getTime() + data.duration * 60 * 60 * 1000);

    // Fonction helper pour format Odoo "YYYY-MM-DD HH:mm:ss"
    // Odoo attend de l'UTC. .toISOString() renvoie du "2023-10-10T10:00:00.000Z"
    // On doit le nettoyer pour Odoo
    const toOdooString = (date: Date) => date.toISOString().replace('T', ' ').split('.')[0];

    const record = {
      name: data.name,
      start: toOdooString(startDate),
      stop: toOdooString(endDate),
      description: data.description,
      location: data.location || "Agence AGTS Kinshasa",
    };

    console.log("📅 Nouveau RDV...", record);
    
    await odooCall(odooModel, "create", [[record]]);
    
    return { success: true };

  } catch (error: any) {
    console.error("❌ Erreur Calendar Create:", error);
    return { success: false, error: error.message };
  }
}