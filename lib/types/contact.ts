export type RealEstateRole = 'buyer' | 'seller' | 'tenant' | 'landlord' | 'investor';
export type LeadSource = 'whatsapp' | 'website' | 'instagram' | 'referral' | 'other';

export interface REContact {
  id?: number; // L'ID Odoo (optionnel à la création)
  name: string;
  isCompany?: boolean; // Indique si le contact est une entreprise
  parentId?: number; // ID de la société si c'est un représentant
  parentName?: string; // Nom de la société parente
  email: string;
  phone: string;
  role: RealEstateRole;
  budgetMin?: number;
  budgetMax?: number;
  preferredLocation?: string;
  source: LeadSource;
  type: 'internal_agent' | 'internal_agency' | 'external_agent' | 'external_agency' | 'promoter' | 'private';
  notes?: string; // Standard Odoo field 'comment'
  tags?: Array<[number, string]>; // Odoo Many2many field for categories/tags
  createdAt?: string; // Date de création du contact
}