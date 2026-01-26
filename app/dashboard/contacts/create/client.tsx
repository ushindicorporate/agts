// app/dashboard/contacts/create/client.tsx
'use client'

import ContactForm from '@/components/crm/ContactForm';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CreateContactClient({ 
  companies, 
  individuals 
}: { 
  companies: any[], 
  individuals: any[] 
}) {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto py-6 md:py-10 px-4 space-y-8">
      <Button 
        variant="ghost" 
        onClick={() => router.back()} 
        className="rounded-xl hover:bg-white dark:hover:bg-slate-900 text-slate-500"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour à l'annuaire
      </Button>

      <div className="space-y-1">
        <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-2xl">
                <UserPlus className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Nouveau Partenaire
            </h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 font-medium ml-1">
            Enregistrez une entité ou un contact dans le système AGTS.
        </p>
      </div>

      <ContactForm 
        companies={companies} 
        individuals={individuals}
        onSuccess={() => {
            router.refresh();
            router.push('/dashboard/contacts');
        }} 
      />
    </div>
  );
}