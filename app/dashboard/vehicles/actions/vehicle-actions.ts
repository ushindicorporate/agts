"use server";

import { odooCall } from "@/lib/odoo-client";
import { ActionResponse } from "@/lib/types";
import { z } from "zod";

export type CreateVehicleInput = z.infer<typeof vehicleSchema>;

export type Vehicle = {
    x_name: string,
    x_brand: string,
    x_model: string,
    x_year: string,
    x_mileage: number,
    x_fuel_type: string,
    x_transmission: string,
    x_status: string,
    x_image: string|boolean
}
// --- SCHÉMA ZOD ---
const vehicleSchema = z.object({
  brand: z.string().min(2),
  model: z.string().min(2),
  year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
  price: z.coerce.number().min(0),
  mileage: z.coerce.number().min(0),
  fuel_type: z.enum(["petrol", "diesel", "hybrid", "electric"]),
  transmission: z.enum(["manual", "automatic"]),
  status: z.enum(["available", "rented", "sold"]),
  image: z.string().optional(),
});

export async function createVehicleAction(formData: CreateVehicleInput): Promise<ActionResponse<null>> {
  try {
    const data = vehicleSchema.parse(formData);
    const odooModel = "x_agts_vehicle"; 

    let imageForOdoo: string | boolean = false;
    if (data.image && data.image.includes(',')) {
      imageForOdoo = data.image.split(',')[1];
    }

    const record = {
      x_name: `${data.brand} ${data.model} (${data.year})`,
      x_brand: data.brand,
      x_model: data.model,
      x_year: data.year,
      x_price: data.price,
      x_mileage: data.mileage,
      x_fuel_type: data.fuel_type,
      x_transmission: data.transmission,
      x_status: data.status,
      x_image: imageForOdoo,
    };

    console.log("🚗 Création Véhicule...", record.x_name);
    const newId = await odooCall(odooModel, "create", [[record]]);
    
    return { success: true, id: newId as number };

  } catch (error: any) {
    console.error("❌ Erreur Vehicle Create:", error);
    return { success: false, error: error.message };
  }
}

export async function getVehiclesAction(): Promise<ActionResponse<Vehicle[]>> {
  try {
    const odooModel = "x_agts_vehicle";
    const fields = [
      "id", 
      "x_name", 
      "x_brand", 
      "x_model", 
      "x_price", 
      "x_status", 
      "x_year", 
      "x_transmission", 
      "x_mileage"
    ];
    
    const result = await odooCall(odooModel, "search_read", [[], fields]);
    
    return { success: true, data: result as Vehicle[] };

  } catch (error: any) {
    console.error("❌ Erreur Vehicle List:", error);
    return { success: false, error: error.message, data: [] };
  }
}