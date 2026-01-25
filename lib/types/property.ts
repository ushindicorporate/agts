// types/property.ts

export type PropertyType = 'apartment' | 'villa' | 'land' | 'commercial';
// J'ajoute les types exacts que tu as dans ton mapping pour éviter les erreurs de cast
export type OfferType = 'À vendre' | 'À louer' | 'sale' | 'Loué'; 
export type PropertyStatus = 'available' | 'reserved' | 'rented' | 'sold';

export interface Property {
  id?: number;
  name: string;
  type: PropertyType;
  
  // Localisation
  address: string;
  city: string;
  
  // Financier
  offerType: OfferType;
  price: number;
  commission: number; // Requis par ton interface
  
  // Statut
  status: PropertyStatus;
  surface: number;
  bedrooms?: number;
  
  // Propriétaire
  ownerId?: number;
  ownerName?: string;
  
  // Image & Business
  mainImage?: string; 
  activeLeads?: number; // ON AJOUTE CECI ICI

  // Caractéristiques
  salons?: number;
  kitchens?: number;
  bathrooms?: number;
  parking?: boolean;
  description?: string;
}