export type PaymentStatus = 'not_paid' | 'in_payment' | 'paid' | 'reversed';
export type CommissionStatus = 'pending' | 'ready' | 'paid';

export interface FinanceItem {
  id: number;
  ref: string; // S00012
  date: string;
  clientName: string;
  agentName: string;
  
  // Montants Deal
  dealAmount: number; // Montant de la vente/location
  
  // Facturation Client (Honoraires Agence)
  invoiceStatus: string; // 'to invoice', 'invoiced', 'no'
  paymentState: PaymentStatus; // État du paiement de la facture
  
  // Commission Agent (Rétrocession)
  commissionPercent: number;
  commissionAmount: number;
  commissionStatus: CommissionStatus;
}