import { getOwnersForFilter } from "@/lib/actions/property-actions"; // On réutilise pour avoir les contacts
import { getProperties } from "@/lib/actions/property-actions";
import CreateLeadClient from "./client";

export default async function CreateLeadPage() {
  // Chargement des données pour les sélecteurs
  const [contacts, propertiesData] = await Promise.all([
    getOwnersForFilter(), // Tous les contacts avec un rôle
    getProperties(1, 100)  // Les 100 derniers biens pour liaison
  ]);

  return (
    <CreateLeadClient 
      contacts={contacts} 
      properties={propertiesData.properties} 
    />
  );
}