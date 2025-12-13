export interface Vehicle {
  id: number;
  x_name: string | false; // Titre généré (Marque + Modèle)
  x_brand: string | false;
  x_model: string | false;
  x_year: number;
  x_price: number;
  x_mileage: number;
  
  x_fuel_type: "petrol" | "diesel" | "hybrid" | "electric" | false;
  x_transmission: "manual" | "automatic" | false;
  x_status: "available" | "rented" | "sold" | false;
  
  x_image?: string | false;
}