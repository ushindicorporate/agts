import Link from 'next/link';
import { Plus, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getOffers } from '@/lib/actions/offer-actions';
import { formatCurrency } from '@/lib/utils';
import DownloadQuoteBtn from '@/components/pdf/DownloadQuoteBtn';

const getStatusBadge = (state: string) => {
    switch (state) {
        case 'draft': return <Badge variant="outline">Brouillon / Devis</Badge>;
        case 'sent': return <Badge className="bg-blue-500">Envoyé</Badge>;
        case 'sale': return <Badge className="bg-green-600">Commande Confirmée</Badge>;
        case 'cancel': return <Badge variant="destructive">Annulé</Badge>;
        default: return <Badge variant="secondary">{state}</Badge>;
    }
};

export default async function OffersPage() {
  const { offers } = await getOffers();

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Offres & Devis</h1>
            <p className="text-muted-foreground">Gérez les propositions commerciales.</p>
        </div>
        <Link href="/dashboard/offers/create">
            <Button>
                <Plus className="mr-2 h-4 w-4" /> Nouvelle Offre
            </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="px-6 py-4 border-b">
            <CardTitle className="text-base">Historique récent</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="pl-6">Référence</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>État</TableHead>
                        <TableHead className="text-right pr-6">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {offers.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">Aucune offre trouvée.</TableCell>
                        </TableRow>
                    ) : (
                        offers.map((offer) => (
                            <TableRow key={offer.id}>
                                <TableCell className="pl-6 font-medium">{offer.name}</TableCell>
                                <TableCell>{offer.partnerName}</TableCell>
                                <TableCell>{new Date(offer.date).toLocaleDateString('fr-FR')}</TableCell>
                                <TableCell className="font-bold">{formatCurrency(offer.amount)}</TableCell>
                                <TableCell>{getStatusBadge(offer.state)}</TableCell>
                                <TableCell className="text-right pr-6">
                                    <DownloadQuoteBtn offer={offer} />
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}