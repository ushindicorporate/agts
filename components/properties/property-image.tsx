'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AspectRatio } from '../ui/aspect-ratio';

export default function PropertyImage({ src, alt, className }: { src: string|undefined; alt: string; className?: string }) {
  const [error, setError] = useState(false);

  return (
    <AspectRatio ratio={4 / 3} className="bg-muted overflow-hidden">
      <Image
        src={error || !src ? '/placeholder-house.jpg' : src}
        alt={alt}
        fill
        className={className}
        onError={() => setError(true)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </AspectRatio>
  );
}