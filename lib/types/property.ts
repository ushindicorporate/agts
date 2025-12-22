// types/property.ts

export type PropertyType = 'apartment' | 'villa' | 'land' | 'commercial';
export type OfferType = 'À vendre' | 'À louer';
export type PropertyStatus = 'available' | 'reserved' | 'rented' | 'sold';

export interface Property {
  id?: number;
  name: string;        // Titre de l'annonce
  type: PropertyType;
  
  // Localisation
  address: string;
  city: string;
  
  // Financier
  offerType: OfferType;
  price: number;       // Prix de vente ou Loyer mensuel
  commission: number;  // Montant de la com
  
  // Statut
  status: PropertyStatus;
  surface: number;  // Surface en m²
  bedrooms?: number;
  
  // Propriétaire (Lien vers res.partner)
  ownerId?: number;
  ownerName?: string; // Pour l'affichage
  
  // Tech (pour l'image plus tard)
  mainImage?: string; 

  // Autres caractéristiques
  salons?: number;    // Nombre de salons
  kitchens?: number;  // Nombre de cuisines
  bathrooms?: number; // Nombre de salles de bain
  parking?: boolean;  // Parking disponible
  description?: string; // Description détaillée
}