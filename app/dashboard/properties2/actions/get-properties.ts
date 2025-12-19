"use server";

import { odooCall } from "@/lib/odoo-client";
import { Property } from "./types";
import { ActionResponse } from "@/lib/types";

export async function getPropertiesAction(): Promise<ActionResponse<Property[]>> {
  try {
    const odooModel = "product.template";
    
    const domain = [
        ["x_studio_produit_immobilier", "!=", false] 
    ];

    const fields = [
      "id", 
      "name",            // Natif
      "list_price",      // Natif
      "x_studio_city", 
      // "x_property_type",
      // "x_transaction_type",
      // "x_address"
    ];

    const result = await odooCall(odooModel, "search_read", [domain, fields]);
    
    return { success: true, data: result as Property[] };

  } catch (error: any) {
    console.error("❌ Erreur Property List:", error);
    return { success: false, error: error.message, data: [] };
  }
}