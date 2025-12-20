export type OfferState = 'draft' | 'sent' | 'sale' | 'cancel';

export interface Offer {
  id: number;
  name: string; // ex: S00042
  partnerName: string;
  amount: number;
  date: string;
  state: OfferState;
  // Optionnel : Lier au bien immobilier si on veut afficher "Offre pour Villa X"
  propertyName?: string; 
}