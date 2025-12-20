'use client'

import { useState } from 'react';
import { fileToBase64 } from '@/lib/utils'; // Ton helper existant
import { Button } from '@/components/ui/button';
import { Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { uploadDocument } from '@/lib/actions/document-actions';

interface UploadProps {
  resModel?: string; // Optionnel : si on est sur une page liste globale, on peut ne pas lier
  resId?: number;
}

export default function UploadButton({ resModel, resId }: UploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    // Si pas de contexte (page globale), on peut soit interdire, soit lier à un dossier générique
    // Ici on suppose qu'on a toujours un contexte ou on bloque
    if (!resModel || !resId) {
        toast.error("Impossible d'uploader sans contexte (Client ou Bien)");
        return;
    }

    setUploading(true);
    const file = e.target.files[0];

    try {
        const base64 = await fileToBase64(file);
        const res = await uploadDocument({
            name: file.name,
            base64: base64,
            resModel: resModel,
            resId: resId
        });

        if (res.success) {
            toast.success("Document ajouté");
        } else {
            toast.error("Erreur upload");
        }
    } catch (err) {
        toast.error("Erreur fichier");
    }
    setUploading(false);
    
    // Reset input
    e.target.value = '';
  };

  return (
    <div className="relative">
      <input 
        type="file" 
        id="doc-upload" 
        className="hidden" 
        onChange={handleFileChange}
        disabled={uploading} 
      />
      <label htmlFor="doc-upload">
        <Button variant="outline" size="sm" className="cursor-pointer" asChild disabled={uploading}>
            <span>
                {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                Ajouter un fichier
            </span>
        </Button>
      </label>
    </div>
  );
}