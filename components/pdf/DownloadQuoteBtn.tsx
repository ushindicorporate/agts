'use client'

import { PDFDownloadLink } from '@react-pdf/renderer';
import { QuoteTemplate } from './QuoteTemplate';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DownloadQuoteBtn({ offer }: { offer: any }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <Button variant="ghost" size="sm" disabled><Loader2 className="h-4 w-4 animate-spin" /></Button>;

  // Préparation des données pour le template
  // On adapte les données reçues de ta page Offers
  const pdfData = {
    id: offer.id,
    ref: offer.name,
    date: offer.date,
    clientName: offer.partnerName,
    propertyName: "Bien Immobilier", // Idéalement, il faudrait passer le nom du bien dans l'objet offer
    price: offer.amount,
    agentName: "Jean Dupont" // À récupérer du profil user
  };

  return (
    <PDFDownloadLink
      document={<QuoteTemplate data={pdfData} />}
      fileName={`Devis_${offer.name}.pdf`}
    >
      {/* 
         @ts-ignore: React-pdf types mismatch sometimes with React 18 children 
      */}
      {({ loading }) => (
        <Button variant="ghost" size="sm" disabled={loading}>
          {loading ? (
             <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
             <>
                <Download className="h-4 w-4 mr-2" /> PDF
             </>
          )}
        </Button>
      )}
    </PDFDownloadLink>
  );
}