'use client'

import { useState, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, Trash2 } from 'lucide-react';
import { fileToBase64 } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { getGalleryImages, updateMainImage, addGalleryImage, deleteGalleryImage } from '@/lib/actions/image-actions';
import { Input } from '../ui/input';

interface ImageManagerProps {
  propertyId: number;
  initialMainImage?: string; // URL ou null
}

export default function ImageManager({ propertyId, initialMainImage }: ImageManagerProps) {
  const [mainImage, setMainImage] = useState<string | null>(initialMainImage || null);
  const [gallery, setGallery] = useState<{ id: number; src: string }[]>([]);
  const [loadingMain, setLoadingMain] = useState(false);
  const [loadingGallery, setLoadingGallery] = useState(false);

  // Charger la galerie au montage
  useEffect(() => {
    const loadGallery = async () => {
        const imgs = await getGalleryImages(propertyId);
        setGallery(imgs);
    };
    if (propertyId) loadGallery();
  }, [propertyId]);

  // --- GESTION MAIN IMAGE ---
  const handleMainUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setLoadingMain(true);
    
    const file = e.target.files[0];
    try {
        const base64 = await fileToBase64(file);
        const res = await updateMainImage(propertyId, base64);
        
        if (res.success) {
            // Créer une URL locale pour l'affichage immédiat
            setMainImage(URL.createObjectURL(file));
            toast.success("Image principale mise à jour");
        } else {
            toast.error("Erreur upload");
        }
    } catch (err) {
        toast.error("Erreur de traitement");
    }
    setLoadingMain(false);
  };

  // --- GESTION GALERIE ---
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setLoadingGallery(true);
    
    const file = e.target.files[0];
    try {
        const base64 = await fileToBase64(file);
        const res = await addGalleryImage(propertyId, base64, file.name);
        
        if (res.success) {
            // Recharger la galerie pour avoir le bon ID Odoo
            const imgs = await getGalleryImages(propertyId);
            setGallery(imgs);
            toast.success("Image ajoutée au carrousel");
        } else {
            toast.error("Erreur upload galerie");
        }
    } catch (err) {
        toast.error("Erreur de traitement");
    }
    setLoadingGallery(false);
  };

  const handleDeleteGallery = async (imageId: number) => {
      const confirm = window.confirm("Supprimer cette image ?");
      if (!confirm) return;

      const res = await deleteGalleryImage(imageId, propertyId);
      if (res.success) {
          setGallery(prev => prev.filter(img => img.id !== imageId));
          toast.success("Image supprimée");
      } else {
          toast.error("Erreur suppression");
      }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. IMAGE PRINCIPALE */}
      <Card>
        <CardHeader><CardTitle className="text-base">Photo de couverture</CardTitle></CardHeader>
        <CardContent>
            <div className="flex flex-col items-center gap-4">
                <div className="relative w-full h-48 md:h-64 bg-muted rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                    {mainImage ? (
                        <img src={mainImage} alt="Main" className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-muted-foreground flex flex-col items-center">
                            <ImageIcon className="h-10 w-10 mb-2 opacity-50" />
                            <span>Aucune image principale</span>
                        </div>
                    )}
                    
                    {/* Overlay chargement */}
                    {loadingMain && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    )}
                </div>

                <div className="w-full">
                    <Label htmlFor="main-upload" className="cursor-pointer">
                        <div className="flex items-center justify-center w-full py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md transition text-sm font-medium">
                            <Upload className="mr-2 h-4 w-4" /> Changer la couverture
                        </div>
                        <Input 
                            id="main-upload" 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleMainUpload} 
                            disabled={loadingMain}
                        />
                    </Label>
                </div>
            </div>
        </CardContent>
      </Card>

      {/* 2. CARROUSEL / GALERIE */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Galerie Photos ({gallery.length})</CardTitle>
            <Label htmlFor="gallery-upload" className="cursor-pointer">
                <div className="flex items-center px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-xs font-medium hover:bg-primary/90 transition">
                    <Upload className="mr-1 h-3 w-3" /> Ajouter
                </div>
                <Input 
                    id="gallery-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleGalleryUpload} 
                    disabled={loadingGallery}
                />
            </Label>
        </CardHeader>
        <CardContent>
            {gallery.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
                    La galerie est vide.
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {gallery.map((img) => (
                        <div key={img.id} className="group relative aspect-square bg-muted rounded-md overflow-hidden border">
                            <img src={img.src} alt="Gallery" className="w-full h-full object-cover transition group-hover:scale-105" />
                            
                            <button 
                                onClick={() => handleDeleteGallery(img.id)}
                                className="absolute top-1 right-1 p-1 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition shadow-sm"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                    {loadingGallery && (
                        <div className="aspect-square bg-muted rounded-md flex items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    )}
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}