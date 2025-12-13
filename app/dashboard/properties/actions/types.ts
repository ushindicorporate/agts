export interface Property {
  id: number;
  name: string;          // Natif Odoo
  list_price: number;    // Natif Odoo
  description_sale: string | false; // Natif Odoo
  
  // Vos champs customs ajoutés via Studio sur Product
  x_city: string | false;
  x_address: string | false;
  x_transaction_type: "sale" | "rent" | false; 
  x_property_type: "house" | "apartment" | "land" | "commercial" | false;
  x_surface: number;
  x_bedrooms: number;
  x_bathrooms: number;
  
  // On ne récupère pas le binaire
  // L'URL sera: /web/image?model=product.template&id=...&field=image_1920
}
