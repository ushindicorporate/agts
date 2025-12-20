import { getClientsAndProperties } from '@/lib/actions/offer-actions';
import CreateOfferClient from './client';

export default async function CreateOfferPage() {
  const data = await getClientsAndProperties();
  return <CreateOfferClient clients={data.clients} properties={data.properties} />;
}