'use server'

import { revalidatePath } from 'next/cache';
import { odooCall } from '../odoo-client';

// 1. Mettre à jour l'image principale
export async function updateMainImage(propertyId: number, base64: string) {
  try {
    await odooCall('product.template', 'write', [
      [propertyId],
      { image_1920: base64 }
    ]);
    revalidatePath(`/dashboard/properties/${propertyId}`); // Ou ton chemin
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// 2. Ajouter une image au carrousel (product.image)
export async function addGalleryImage(propertyId: number, base64: string, name: string) {
  try {
    await odooCall('product.image', 'create', [{
      product_tmpl_id: propertyId,
      name: name,
      image_1920: base64
    }]);
    revalidatePath(`/dashboard/properties/${propertyId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// 3. Supprimer une image du carrousel
export async function deleteGalleryImage(imageId: number, propertyId: number) {
  try {
    await odooCall('product.image', 'unlink', [[imageId]]);
    revalidatePath(`/dashboard/properties/${propertyId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// 4. Récupérer les images de la galerie
export async function getGalleryImages(propertyId: number) {
  try {
    // On ne demande que l'ID et le nom. 
    // Le poids de la réponse Odoo passe de ~500KB à ~1KB.
    const images = await odooCall('product.image', 'search_read', [
        [['product_tmpl_id', '=', propertyId]],
        ['id', 'name'] 
    ]) as any[];
    
    return images.map((img: any) => ({
        id: img.id,
        name: img.name,
        // On génère l'URL vers notre API interne
        src: `/api/image/product.image/${img.id}`
    }));
  } catch (error) {
    console.error("Erreur chargement galerie:", error);
    return [];
  }
}