export interface Document {
  id: number;
  name: string;       // Nom du fichier (ex: contrat_location.pdf)
  type: string;       // Mime type (application/pdf, image/png)
  fileSize: number;   // Taille en octets
  createDate: string; // Date d'upload
  
  // Contexte (À quoi c'est lié ?)
  resModel: string;   // 'res.partner', 'product.template', 'sale.order'
  resId: number;
  resName?: string;   // Nom de l'objet lié (ex: "Villa Cocody")
}