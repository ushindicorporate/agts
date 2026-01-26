// app/dashboard/contacts/create/page.tsx
import { getContacts } from "@/lib/actions/crm-actions";
import CreateContactClient from "./client";

export default async function CreateContactPage() {
  // On récupère les deux types en parallèle pour alimenter les sélecteurs
  const [companiesData, individualsData] = await Promise.all([
    getContacts(1, 1000, "", "all", "all", true),  // Uniquement Sociétés
    getContacts(1, 1000, "", "all", "all", false) // Uniquement Individus
  ]);

  return (
    <CreateContactClient 
      companies={companiesData.contacts} 
      individuals={individualsData.contacts} 
    />
  );
}