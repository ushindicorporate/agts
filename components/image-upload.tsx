"use client";

import { ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, ImagePlus } from "lucide-react";

interface ImageUploadProps {
  value?: string; // La chaine Base64
  onChange: (base64: string | undefined) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | undefined>(value);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Conversion en Base64 pour Odoo
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPreview(base64String);
      // Odoo a besoin du Base64 PUR, sans le préfixe "data:image/png;base64,"
      // Mais pour l'instant on passe tout, on nettoiera côté serveur
      onChange(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(undefined);
    onChange(undefined);
  };

  return (
    <div className="flex flex-col gap-4">
      {preview ? (
        <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border border-slate-200">
          <img 
            src={preview} 
            alt="Aperçu" 
            className="h-full w-full object-cover" 
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex w-full max-w-sm items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 py-10 hover:bg-slate-100 transition-colors">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2">
            <ImagePlus className="h-10 w-10 text-slate-400" />
            <span className="text-sm font-medium text-slate-600">
              Cliquez pour ajouter une photo
            </span>
            <Input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange} 
            />
          </label>
        </div>
      )}
    </div>
  );
}