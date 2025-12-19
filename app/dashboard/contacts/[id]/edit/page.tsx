import { notFound } from 'next/navigation';
import { getContactById } from '@/lib/actions/crm-actions'; // Vérifie tes imports
import EditContactClient from '@/components/crm/EditTable';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditContactPage({ params }: PageProps) {
  // 1. On attend les params (Next.js 15 standard)
  const { id } = await params;
  
  // 2. On récupère la donnée CÔTÉ SERVEUR (rapide et sécurisé)
  const contact = await getContactById(parseInt(id));

  // 3. Si pas de contact, 404 immédiate
  if (!contact) {
    return notFound();
  }

  // 4. On passe les données prêtes au composant Client
  return <EditContactClient contact={contact} />;
}