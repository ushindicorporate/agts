'use client'

import { useRouter } from 'next/navigation';
import PropertyForm from '@/components/properties/PropertyForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Property } from '@/lib/types/property';

interface EditClientProps {
    property: Property;
    owners: any[];
}

export default function EditPropertyClient({ property, owners }: EditClientProps) {
  const router = useRouter();

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <Button 
            variant="ghost" 
            onClick={() => router.push('/dashboard/properties')} 
            className="pl-0 hover:bg-transparent hover:text-primary"
        >
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour liste
        </Button>
        <div className="text-sm text-muted-foreground">
            ID Odoo: <span className="font-mono">{property.id}</span>
        </div>
      </div>

      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold">Édition du Bien</h1>
        <p className="text-muted-foreground">
            Modifiez les informations et gérez la galerie photos.
        </p>
      </div>

      <PropertyForm 
        initialData={property} 
        owners={owners} 
        onSuccess={() => {
            router.refresh();
            // On reste sur la page pour continuer d'éditer ou gérer les photos
        }} 
      />
    </div>
  );
}