'use server'

import { revalidatePath } from "next/cache";
import { odooCall } from "../odoo-client";
import { FinanceItem } from "../types/finance";

export async function getFinancialData() {
  try {
    // 1. Récupérer les Ventes Confirmées (Sale Orders)
    const orders = await odooCall('sale.order', 'search_read', [
      [['state', 'in', ['sale', 'done']]], // Uniquement les ventes validées
      [
        'id', 'name', 'date_order', 'partner_id', 'user_id', 'amount_total',
        'invoice_status', // À facturer / Facturé
        'invoice_ids',    // Liens vers les factures pour vérifier le paiement
        // Champs Custom Odoo Studio (à créer dans Odoo si pas existants)
        'x_studio_commission_percent', 
        'x_studio_commission_status' 
      ],
      0, 50, 'date_order desc'
    ]) as any[];

    // 2. Pour connaître le statut de paiement ("Paid"), il faut vérifier les factures liées
    // On récupère tous les IDs de factures concernées
    const allInvoiceIds = orders.flatMap((o: any) => o.invoice_ids);
    
    let invoicesMap: Record<number, string> = {};
    
    if (allInvoiceIds.length > 0) {
        const invoices = await odooCall('account.move', 'search_read', [
            [['id', 'in', allInvoiceIds], ['move_type', '=', 'out_invoice']], // Factures clients
            ['id', 'payment_state'] // not_paid, paid...
        ]) as any[];
        
        // Créer une map ID -> Status pour accès rapide
        invoices.forEach((inv: any) => { invoicesMap[inv.id] = inv.payment_state });
    }

    // 3. Mapping des données
    const financials: FinanceItem[] = orders.map((o: any) => {
      // Déterminer le statut global du paiement
      // Si une des factures est payée, on considère payé (simplification)
      let globalPaymentState = 'not_paid';
      if (o.invoice_ids && o.invoice_ids.length > 0) {
          const status = invoicesMap[o.invoice_ids[0]]; // On regarde la première facture
          if (status) globalPaymentState = status;
      }

      // Calcul Commission Agent (ex: Si 50% de la com agence revient à l'agent)
      // Ou utilisation du champ custom si présent
      const percent = o.x_studio_commission_percent || 50; // Défaut 50% de rétrocession
      const commAmount = (o.amount_total * percent) / 100;

      return {
        id: o.id,
        ref: o.name,
        date: o.date_order,
        clientName: o.partner_id ? o.partner_id[1] : 'Inconnu',
        agentName: o.user_id ? o.user_id[1] : 'Agence',
        
        dealAmount: o.amount_total, // C'est le CA de l'agence
        
        invoiceStatus: o.invoice_status,
        paymentState: globalPaymentState as any,
        
        commissionPercent: percent,
        commissionAmount: commAmount,
        commissionStatus: o.x_studio_commission_status || 'pending'
      };
    });

    return financials;

  } catch (error) {
    console.error("Finance Error:", error);
    return [];
  }
}

export async function updateCommissionStatus(orderId: number, status: string) {
  try {
    await odooCall('sale.order', 'write', [
      [orderId],
      { x_studio_commission_status: status }
    ]);
    
    // On peut aussi mettre à jour le % si besoin
    // { x_studio_commission_percent: 10 } 

    revalidatePath('/dashboard/finance');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}