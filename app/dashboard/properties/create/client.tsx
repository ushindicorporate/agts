'use client'

import { useRouter } from 'next/navigation';
import PropertyForm from '@/components/properties/PropertyForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function CreatePropertyClient({ owners }: { owners: any[] }) {
  const router = useRouter();

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <Button 
        variant="ghost" 
        onClick={() => router.back()} 
        className="mb-6 pl-0 hover:bg-transparent hover:text-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour liste
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Nouveau Mandat</h1>
        <p className="text-muted-foreground">Ajoutez un bien à votre portefeuille Odoo.</p>
      </div>

      <PropertyForm 
        owners={owners} 
        onSuccess={(newId) => {
            // Après création, on redirige vers la page d'édition de ce bien
            // pour que l'utilisateur puisse ajouter les photos immédiatement
            router.refresh();
            router.push(`/dashboard/properties/${newId}/edit`);
        }} 
      />
    </div>
  );
}