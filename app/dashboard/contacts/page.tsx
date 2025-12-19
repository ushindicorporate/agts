import ContactsTable from '@/components/crm/ContactsTable';
import { getContacts } from '@/lib/actions/crm-actions';
import { Suspense } from 'react';

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; role?: string }>;
}) {
  const page = parseInt((await searchParams).page || '1');
  const search = (await searchParams).search || '';
  const role = (await searchParams).role || '';
  // Appel serveur à Odoo
  const { contacts, totalPages } = await getContacts(page, 10, search, role);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Gestion CRM</h1>
        <p className="mt-2 text-sm text-gray-600">
          Gérez vos prospects, acheteurs et propriétaires.
        </p>
      </div>

      <Suspense fallback={<div className="text-center py-10">Chargement des données Odoo...</div>}>
        <ContactsTable 
          data={contacts} 
          pageCount={totalPages} 
          currentPage={page} 
        />
      </Suspense>
    </div>
  );
}