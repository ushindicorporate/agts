import { SalesChart, SourcePieChart, FunnelChart } from '@/components/reporting/Charts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getReportingData } from '@/lib/actions/reporting-actions';

export default async function ReportingPage() {
  const { salesData, sourceData, funnelData, agentData } = await getReportingData();

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8">
      
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Rapports & Statistiques</h1>
            <p className="text-muted-foreground">Analysez la performance de votre agence.</p>
        </div>
        <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Exporter Données
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 1. Évolution des Ventes */}
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
                <CardTitle>Chiffre d'Affaires Mensuel</CardTitle>
                <CardDescription>Ventes et Locations validées sur les 12 derniers mois.</CardDescription>
            </CardHeader>
            <CardContent className="pl-0">
                <SalesChart data={salesData} />
            </CardContent>
        </Card>

        {/* 2. Sources des Leads */}
        <Card>
            <CardHeader>
                <CardTitle>Origine des Prospects</CardTitle>
                <CardDescription>Canaux d'acquisition performants.</CardDescription>
            </CardHeader>
            <CardContent>
                <SourcePieChart data={sourceData} />
            </CardContent>
        </Card>

        {/* 3. Prévisions (Forecast) */}
        <Card>
            <CardHeader>
                <CardTitle>Prévisions Financières</CardTitle>
                <CardDescription>Montant pondéré par étape du pipeline.</CardDescription>
            </CardHeader>
            <CardContent>
                <FunnelChart data={funnelData} />
            </CardContent>
        </Card>

        {/* 4. Productivité Agents (Top 5) */}
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
                <CardTitle>Top Agents (CA Généré)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {agentData.map((agent: any, i: number) => (
                        <div key={i} className="flex items-center">
                            <div className="w-32 font-medium text-sm truncate">{agent.name}</div>
                            <div className="flex-1 mx-4">
                                <div className="h-2 bg-indigo-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-indigo-600 rounded-full" 
                                        style={{ width: `${(agent.value / (agentData[0].value || 1)) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <div className="w-24 text-right font-bold text-sm">
                                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(agent.value)}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>

      </div>
    </div>
  );
}