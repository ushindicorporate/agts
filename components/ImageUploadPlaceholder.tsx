"use client";

import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useState } from "react";

export function ImageUploadPlaceholder() {
  const [previews, setPreviews] = useState<string[]>([]);

  // Simulation d'upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Crée une URL locale temporaire pour l'aperçu
      const url = URL.createObjectURL(e.target.files[0]);
      setPreviews([...previews, url]);
    }
  };

  const removeImage = (index: number) => {
    setPreviews(previews.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">Photos du bien</label>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Zone de Drop / Bouton Ajouter */}
        <div className="relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition hover:bg-gray-100">
          <Upload className="h-8 w-8 text-gray-400" />
          <span className="mt-2 text-xs font-medium text-gray-500">Ajouter photo</span>
          <input 
            type="file" 
            className="absolute inset-0 opacity-0 cursor-pointer" 
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>

        {/* Aperçus */}
        {previews.map((src, i) => (
          <div key={i} className="relative aspect-square overflow-hidden rounded-lg border bg-white">
            <img src={src} alt="Preview" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 rounded-full bg-black/50 p-1 text-white hover:bg-red-500 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {/* Placeholders vides pour faire joli */}
        {previews.length === 0 && (
          <>
             <div className="aspect-square rounded-lg bg-gray-100/50 border flex items-center justify-center text-gray-300">
                <ImageIcon className="h-8 w-8" />
             </div>
             <div className="aspect-square rounded-lg bg-gray-100/50 border flex items-center justify-center text-gray-300">
                <ImageIcon className="h-8 w-8" />
             </div>
          </>
        )}
      </div>
      <p className="text-xs text-gray-500">
        Recommandé : JPG/PNG, max 5MB. La première photo sera l'image de couverture.
      </p>
    </div>
  );
}