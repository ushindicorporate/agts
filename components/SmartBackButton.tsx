'use client'

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function BackButton({ label = "Retour", href = "/dashboard/properties" }) {
  const router = useRouter();

  const handleBack = () => {
    // Si l'historique existe, on fait back() pour garder les filtres
    if (window.history.length > 1) {
        router.back();
    } else {
        // Sinon (ex: accès direct par lien), on va vers le lien par défaut
        router.push(href);
    }
  };

  return (
    <Button 
        variant="ghost" 
        onClick={handleBack}
        className="pl-0 hover:bg-transparent hover:text-primary transition-colors"
    >
      <ArrowLeft className="mr-2 h-4 w-4" /> {label}
    </Button>
  );
}