import { getFinancialData } from '@/lib/actions/finance-actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

// Badges pour la facture client
const getPaymentBadge = (status: string, invoiceStatus: string) => {
    if (invoiceStatus === 'to invoice') return <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">À facturer</Badge>;
    if (status === 'paid') return <Badge className="bg-green-600 hover:bg-green-700"><CheckCircle2 className="w-3 h-3 mr-1" /> Payé</Badge>;
    if (status === 'in_payment') return <Badge className="bg-blue-500">En cours</Badge>;
    return <Badge variant="secondary">En attente</Badge>;
};

// Badges pour la commission agent
const getCommBadge = (status: string) => {
    if (status === 'paid') return <span className="text-green-600 font-bold text-xs">Versée</span>;
    if (status === 'ready') return <span className="text-blue-600 font-bold text-xs">À verser</span>;
    return <span className="text-gray-400 text-xs">En attente encaissement</span>;
};

export default async function FinancePage() {
  const data = await getFinancialData();

  // --- CALCULS KPI ---
  const totalRevenue = data.reduce((acc, curr) => acc + curr.dealAmount, 0);
  
  // Ce qui est réellement entré dans la caisse (Paid)
  const collectedRevenue = data
    .filter(d => d.paymentState === 'paid')
    .reduce((acc, curr) => acc + curr.dealAmount, 0);

  // Commissions agents en attente de paiement
  const pendingCommissions = data
    .filter(d => d.commissionStatus === 'pending' || d.commissionStatus === 'ready')
    .reduce((acc, curr) => acc + curr.commissionAmount, 0);

  // Taux de recouvrement
  const recoveryRate = totalRevenue > 0 ? Math.round((collectedRevenue / totalRevenue) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8">
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Suivi Financier</h1>
        <p className="text-muted-foreground">Commissions, Facturation et Recouvrement.</p>
      </div>

      {/* KPI GRID */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-l-4 border-l-blue-600">
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground font-medium">CA Validé (Signé)</CardTitle></CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-600">
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground font-medium">CA Encaissé</CardTitle></CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-green-700">{formatCurrency(collectedRevenue)}</div>
                <Progress value={recoveryRate} className="h-2 mt-2" />
                <p className="text-xs text-muted-foreground mt-1">{recoveryRate}% recouvré</p>
            </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground font-medium">Commissions Agent (À sortir)</CardTitle></CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-orange-600">{formatCurrency(pendingCommissions)}</div>
            </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground font-medium">Marge Nette (Estimée)</CardTitle></CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-purple-700">{formatCurrency(collectedRevenue - pendingCommissions)}</div>
                <p className="text-xs text-muted-foreground mt-1">Après rétrocession</p>
            </CardContent>
        </Card>
      </div>

      {/* TABLEAU DETAILLE */}
      <Card>
        <CardHeader>
            <CardTitle>Détail des Transactions</CardTitle>
            <CardDescription>Liste des dossiers, factures clients et rétrocessions agents.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Référence</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Agent</TableHead>
                        <TableHead className="text-right">Montant Dossier</TableHead>
                        <TableHead className="text-center">Statut Facture</TableHead>
                        <TableHead className="text-right">Commission Agent</TableHead>
                        <TableHead className="text-center">État Com.</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow><TableCell colSpan={7} className="text-center py-8">Aucune donnée financière.</TableCell></TableRow>
                    ) : (
                        data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">
                                    {item.ref}
                                    <div className="text-xs text-muted-foreground">{item.clientName}</div>
                                </TableCell>
                                <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">{item.agentName}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-bold text-slate-700">
                                    {formatCurrency(item.dealAmount)}
                                </TableCell>
                                <TableCell className="text-center">
                                    {getPaymentBadge(item.paymentState, item.invoiceStatus)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="font-medium text-orange-700">{formatCurrency(item.commissionAmount)}</div>
                                    <div className="text-xs text-muted-foreground">{item.commissionPercent}%</div>
                                </TableCell>
                                <TableCell className="text-center">
                                    {getCommBadge(item.commissionStatus)}
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