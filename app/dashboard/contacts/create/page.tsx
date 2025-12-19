'use client'
import ContactForm from '@/components/crm/ContactForm';
import { useRouter } from 'next/navigation';

export default function CreateContactPage() {
  const router = useRouter();

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <button 
        onClick={() => router.back()} 
        className="mb-4 text-sm text-gray-500 hover:text-gray-900"
      >
        ← Retour à la liste
      </button>
      <ContactForm onSuccess={() => router.push('/contacts')} />
    </div>
  );
}