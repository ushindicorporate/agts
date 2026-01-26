// app/dashboard/contacts/page.tsx
import { Suspense } from 'react';
import { getContacts, getContactCounts } from '@/lib/actions/crm-actions';
import { Users, UserPlus, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ContactSkeleton } from '@/components/crm/ContactSkeleton';
import ContactsTable from '@/components/crm/ContactsTable';

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    page?: string; 
    search?: string; 
    type?: string; // internal_agent, internal_agency, external_agent, promoter, private
    role?: string; // buyer, seller, tenant, landlord
  }>;
}) {
  const params = await searchParams;
  
  // Extraction et nettoyage des paramètres
  const page = parseInt(params.page || '1');
  const search = params.search || '';
  const type = params.type || 'all'; 
  const role = params.role || 'all';

  // Chargement parallèle des données (Optimisation AGTS)
  // On passe 'type' et 'role' à getContacts
  const [contactsData, counts] = await Promise.all([
    getContacts(page, 10, search, role, type),
    getContactCounts()
  ]);

  console.log(counts);
  

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8 min-h-screen">
      
      {/* --- HEADER PROFESSIONNEL --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-8 transition-colors">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
                <Users className="h-5 w-5 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Annuaire & CRM
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Gestion centralisée des agents, partenaires et prospects AGTS.
          </p>
        </div>

        <Link href="/dashboard/contacts/create">
          <Button size="lg" className="rounded-2xl shadow-xl shadow-indigo-500/20 bg-slate-900 dark:bg-primary text-white px-8 h-14 font-black transition-all hover:scale-[1.02] active:scale-95">
            <UserPlus className="h-5 w-5 mr-2 stroke-[3px]" />
            Nouveau Contact
          </Button>
        </Link>
      </div>

      {/* --- ZONE DE CONTENU DYNAMIQUE --- */}
      <Suspense 
        key={JSON.stringify(params)} 
        fallback={<ContactSkeleton />}
      >
        <div className="space-y-6">
            {/* 
               On passe les counts au tableau ou au wrapper de tabs 
               pour afficher les chiffres par catégorie (Agents, Promoteurs, etc.)
            */}
            <ContactsTable 
              data={contactsData.contacts} 
              pageCount={contactsData.totalPages} 
              currentPage={page}
            />
        </div>
      </Suspense>

      {/* Petit spacer pour le mobile pour éviter que le contenu soit caché par d'éventuels boutons flottants */}
      <div className="h-10 lg:hidden" />
    </div>
  );
}