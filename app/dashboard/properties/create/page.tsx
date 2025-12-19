import { getOwnersList } from "@/lib/actions/property-actions";
import CreatePropertyClient from "./client";


export default async function CreatePropertyPage() {
  // On précharge la liste des proprios côté serveur
  const owners = await getOwnersList();

  return <CreatePropertyClient owners={owners} />;
}