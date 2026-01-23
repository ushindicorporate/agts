'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Home } from 'lucide-react'

export function PropertyGallery({ images }: { images: { id: number, src: string }[] }) {
  const [activeImage, setActiveImage] = useState(images[0]?.src || '/placeholder-house.jpg')

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[500px]">
      {/* Image Principale */}
      <div className="md:col-span-3 relative rounded-2xl overflow-hidden bg-slate-100 group">
        <Image 
          src={activeImage} 
          alt="Vue principale" 
          fill 
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      
      {/* Vignettes */}
      <div className="hidden md:flex flex-col gap-4 overflow-y-auto pr-2">
        {images.map((img, i) => (
          <div 
            key={img.id}
            onClick={() => setActiveImage(img.src)}
            className={`relative h-24 rounded-xl overflow-hidden cursor-pointer border-2 transition ${
              activeImage === img.src ? 'border-primary shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
            <Image src={img.src} alt={`Vue ${i}`} fill className="object-cover" />
          </div>
        ))}
        {images.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 rounded-xl text-slate-400">
            <Home className="h-8 w-8 mb-2 opacity-20" />
            <span className="text-xs">Pas d'autres photos</span>
          </div>
        )}
      </div>
    </div>
  )
}