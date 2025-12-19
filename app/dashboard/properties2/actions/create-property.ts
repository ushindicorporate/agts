"use server";

import { odooCall } from "@/lib/odoo-client";
import { ActionResponse } from "@/lib/types";
import { z } from "zod";

// On reprend le même schéma que le frontend pour valider côté serveur
const propertySchema = z.object({
  name: z.string(),
  transaction_type: z.enum(["sale", "rent"]),
  property_type: z.string(),
  price: z.coerce.number(),
  surface: z.coerce.number(),
  bedrooms: z.coerce.number(),
  bathrooms: z.coerce.number(),
  address: z.string(),
  city: z.string().default("Kinshasa"), // Défaut Kinshasa
  description: z.string().optional(),
  image: z.string().optional(),
});

export type CreatePropertyInput = z.infer<typeof propertySchema>;

export async function createPropertyAction(formData: CreatePropertyInput): Promise<ActionResponse<null>> {
  try {
    const data = propertySchema.parse(formData);
    
    // CHANGEMENT 1 : Le modèle cible
    const odooModel = "product.template"; 
    
    let imageForOdoo: string | boolean = false;
    if (data.image && data.image.includes(',')) {
      imageForOdoo = data.image.split(',')[1];
    }

    const record = {
      // MAPPING VERS CHAMPS NATIFS
      name: data.name,
      list_price: data.price,
      description_sale: data.description,
      detailed_type: 'service', // ou 'product' selon votre gestion de stock. Service est mieux pour immo sans stock physique.
      image_1920: imageForOdoo, // Champ image HD natif
      
      // MAPPING VERS VOS CHAMPS CUSTOMS
      x_property_type: data.property_type,
      x_transaction_type: data.transaction_type,
      x_address: data.address,
      x_city: data.city,
      x_surface: data.surface,
      x_bedrooms: data.bedrooms,
      x_bathrooms: data.bathrooms,
    };

    console.log("🏠 Création Produit Immo (Product Template)...", record.name);
    const newId = await odooCall(odooModel, "create", [[record]]);
    
    return { success: true, id: newId as number };

  } catch (error: any) {
    console.error("❌ Erreur Property Create:", error);
    return { success: false, error: error.message };
  }
}