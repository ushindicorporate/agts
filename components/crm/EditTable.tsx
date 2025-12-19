'use client'

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import ContactForm from '@/components/crm/ContactForm';
import { REContact } from '@/lib/types/contact'; // Vérifie tes imports

interface EditContactClientProps {
  contact: REContact;
}

export default function EditContactClient({ contact }: EditContactClientProps) {
  const router = useRouter();

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <button 
        onClick={() => router.back()} 
        className="flex items-center mb-6 text-sm text-muted-foreground hover:text-foreground transition"
      >
        <ArrowLeft size={16} className="mr-1" /> Annuler et retour
      </button>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Modifier le contact</h1>
        <p className="text-muted-foreground">Mettez à jour les informations synchronisées avec Odoo.</p>
      </div>

      <ContactForm 
        initialData={contact}
        onSuccess={() => {
          // Rafraîchir les données serveur affichées
          router.refresh(); 
          // Redirection
          router.push(`/dashboard/contacts/${contact.id}`); // Adapte le lien selon tes routes
        }} 
      />
    </div>
  );
}