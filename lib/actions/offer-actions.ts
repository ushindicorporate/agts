'use server'

import { revalidatePath } from 'next/cache';
import { odooCall } from '../odoo-client';
import { Offer } from '../types/offer';

// 1. Lister les Offres
export async function getOffers(page = 1, pageSize = 10) {
  const offset = (page - 1) * pageSize;
  try {
    const totalCount = await odooCall('sale.order', 'search_count', [[]]) as number;
    
    const records = await odooCall('sale.order', 'search_read', [
      [], // Pas de filtre pour l'instant
      ['id', 'name', 'partner_id', 'amount_total', 'date_order', 'state'],
      offset,
      pageSize,
      'date_order desc'
    ]) as any[];

    const offers: Offer[] = records.map((o: any) => ({
      id: o.id,
      name: o.name,
      partnerName: o.partner_id ? o.partner_id[1] : 'Inconnu',
      amount: o.amount_total,
      date: o.date_order,
      state: o.state
    }));

    return { offers, totalCount, totalPages: Math.ceil(totalCount / pageSize) };
  } catch (error) {
    console.error("Error fetching offers:", error);
    return { offers: [], totalCount: 0, totalPages: 0 };
  }
}

// 2. Créer une Offre (Devis)
export async function createOffer(partnerId: number, propertyTemplateId: number, price: number) {
  try {
    // A. Trouver le product.product ID correspondant au bien (product.template)
    // Odoo a besoin de l'ID de la variante pour la ligne de commande
    const products = await odooCall('product.product', 'search_read', [
      [['product_tmpl_id', '=', propertyTemplateId]],
      ['id']
    ]) as any[];

    if (!products.length) throw new Error("Variante produit introuvable pour ce bien.");
    const productId = products[0].id;

    // B. Créer le Sale Order avec sa ligne en une seule fois
    const orderId = await odooCall('sale.order', 'create', [{
      partner_id: partnerId,
      order_line: [
        [0, 0, {
          product_id: productId,
          product_uom_qty: 1,
          price_unit: price, // Prix de l'offre
        }]
      ]
    }]) as number;

    revalidatePath('/dashboard/offers');
    return { success: true, id: orderId };

  } catch (error: any) {
    console.error("Create Offer Error:", error);
    return { success: false, error: error.message };
  }
}

// 3. Générer/Télécharger le PDF
export async function getOfferPdf(orderId: number) {
  try {
    // Appel à la méthode de reporting Odoo
    // Le nom du report standard est souvent 'sale.report_saleorder'
    const result = await odooCall('sale.order', 'read', [[orderId], ['name']]); // Juste pour vérifier l'existence
    
    // On utilise une méthode spéciale 'render_qweb_pdf' sur le modèle 'ir.actions.report'
    // Note: C'est parfois complexe via XML-RPC simple.
    // Alternative plus simple : Appeler une route API Odoo ou utiliser une URL de téléchargement si session active.
    
    // Pour cet exemple, on suppose qu'on récupère le base64 via une méthode custom ou standard :
    // 'sale.report_saleorder' est l'ID XML externe du rapport
    // ATTENTION: La syntaxe peut varier selon ta version d'Odoo (ici v14-v17 standard)
    
    // Si tu n'y arrives pas via XML-RPC direct, on peut faire un lien direct vers le backend Odoo
    // Mais essayons l'appel report :
    /* 
       Cette partie est souvent spécifique. Si ça échoue, on fera un lien externe.
    */
    return { success: false, error: "Configuration PDF avancée requise" }; 
  } catch (error) {
    return { success: false, error: "Erreur PDF" };
  }
}

// Helpers pour les listes déroulantes du formulaire
export async function getClientsAndProperties() {
    const [clients, properties] = await Promise.all([
        odooCall('res.partner', 'search_read', [[], ['id', 'name']]),
        odooCall('product.template', 'search_read', [[['x_studio_produit_immobilier', '=', true]], ['id', 'name', 'list_price']])
    ]);
    return { 
        clients: (clients as any[]).map(c => ({ id: c.id, name: c.name })),
        properties: (properties as any[]).map(p => ({ id: p.id, name: p.name, price: p.list_price }))
    };
}