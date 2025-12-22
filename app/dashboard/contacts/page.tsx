import { getContacts, getContactCounts } from '@/lib/actions/crm-actions';
import ContactsTabsWrapper from '@/components/crm/ContactsTabsWrapper';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; role?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const search = params.search || '';
  const role = params.role || ''; // Si vide, c'est 'all'

  // Appel serveur parallèle (Optimisation)
  const [contactsData, counts] = await Promise.all([
    getContacts(page, 10, search, role),
    getContactCounts()
  ]);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Annuaire & CRM</h1>
        <p className="mt-2 text-sm text-gray-600">
          Gérez l'ensemble de vos partenaires et clients.
        </p>
      </div>

      <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>}>
        <ContactsTabsWrapper 
          contacts={contactsData.contacts} 
          pageCount={contactsData.totalPages} 
          currentPage={page}
          counts={counts}
        />
      </Suspense>
    </div>
  );
}