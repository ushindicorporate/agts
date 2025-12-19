import { getOwnersList, getPropertyById } from '@/lib/actions/property-actions';
import { notFound } from 'next/navigation';
import EditPropertyClient from './client';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPropertyPage({ params }: PageProps) {
  const { id } = await params;
  const propertyId = parseInt(id);

  if (isNaN(propertyId)) return notFound();

  // Chargement Parallèle
  const [property, owners] = await Promise.all([
    getPropertyById(propertyId),
    getOwnersList()
  ]);

  if (!property) return notFound();

  return <EditPropertyClient property={property} owners={owners} />;
}