'use client'

import { useRouter } from 'next/navigation';
import { ArrowLeft, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LeadForm from '@/components/crm/pipeline/LeadForm';

export default function CreateLeadClient({ contacts, properties }: { contacts: any[], properties: any[] }) {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      <Button 
        variant="ghost" 
        onClick={() => router.back()} 
        className="rounded-xl hover:bg-white dark:hover:bg-slate-900"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour au Pipeline
      </Button>

      <div className="space-y-1">
        <div className="flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-black tracking-tight">Nouvelle Opportunité</h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Enregistrez un nouveau prospect ou une demande client dans Odoo.
        </p>
      </div>

      <LeadForm 
        contacts={contacts} 
        properties={properties}
        onSuccess={() => {
            router.refresh();
            router.push('/dashboard/leads');
        }}
      />
    </div>
  );
}