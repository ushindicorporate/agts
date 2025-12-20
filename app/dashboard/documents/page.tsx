import DocumentsList from '@/components/documents/DocumentsList';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getDocuments } from '@/lib/actions/document-actions';

export default async function DocumentsPage() {
  const documents = await getDocuments();

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestion Documentaire</h1>
        <p className="text-muted-foreground">Centre de stockage des contrats, titres et pièces d'identité.</p>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Fichiers récents</CardTitle>
            <CardDescription>Tous les documents liés aux clients, biens et ventes.</CardDescription>
        </CardHeader>
        <CardContent>
            <DocumentsList documents={documents} />
        </CardContent>
      </Card>
    </div>
  );
}