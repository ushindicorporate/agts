// app/dashboard/contacts/page.tsx
import { Suspense } from 'react';
import { getContacts, getContactCounts } from '@/lib/actions/crm-actions';
import ContactsTabsWrapper from '@/components/crm/ContactsTabsWrapper';
import { Users, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ContactSkeleton } from '@/components/crm/ContactSkeleton';
import ContactsTable from '@/components/crm/ContactsTable';

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; type?: string; role?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const search = params.search || '';
  const role = params.role || 'all';

  // Chargement parallèle
  const [contactsData, counts] = await Promise.all([
    getContacts(page, 10, search, role),
    getContactCounts()
  ]);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* HEADER ENTREPRISE */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
                <Users className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100">
               <span className="text-[10px] font-black uppercase text-emerald-700">CRM Connecté</span>
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Annuaire & CRM
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Gestion centralisée des agents, partenaires et prospects d'AGTS.
          </p>
        </div>

        <Link href="/dashboard/contacts/create">
          <Button size="lg" className="rounded-2xl shadow-xl bg-slate-900 dark:bg-primary text-white px-8 h-14 font-bold">
            <UserPlus className="h-5 w-5 mr-2 stroke-[3px]" />
            Nouveau Contact
          </Button>
        </Link>
      </div>

      {/* TABS & TABLEAU AVEC SUSPENSE */}
      <Suspense key={JSON.stringify(params)} fallback={<ContactSkeleton />}>
        <ContactsTable 
          data={contactsData.contacts} 
          pageCount={contactsData.totalPages} 
          currentPage={page}
          // Tu peux retirer le selecteur de rôle interne à ContactsTable s'il fait doublon
        />
        {/* <ContactsTabsWrapper 
          contacts={contactsData.contacts} 
          pageCount={contactsData.totalPages} 
          currentPage={page}
          counts={counts}
        /> */}
      </Suspense>
    </div>
  );
}