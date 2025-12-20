import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, DollarSign } from 'lucide-react';
import { getAgentsAnalytics } from '@/lib/actions/agent-actions';
import { formatCurrency } from '@/lib/utils';

export default async function AgentsPage() {
  const agents = await getAgentsAnalytics();

  // Calculs globaux pour l'en-tête
  const totalAgencyRevenue = agents.reduce((acc, curr) => acc + curr.totalRevenue, 0);
  const totalDeals = agents.reduce((acc, curr) => acc + curr.dealsClosed, 0);
  const topAgent = agents[0];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8">
      
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-bold tracking-tight">Performance Équipe</h1>
           <p className="text-muted-foreground">Suivi des résultats commerciaux par agent.</p>
        </div>
      </div>

      {/* --- KPI GLOBAUX AGENCE --- */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-indigo-600 text-white border-none">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-indigo-100 font-medium text-sm">
                    <DollarSign className="h-4 w-4" /> CA Total Agence
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold">{formatCurrency(totalAgencyRevenue)}</div>
                <p className="text-indigo-200 text-sm mt-1">{totalDeals} ventes signées</p>
            </CardContent>
        </Card>

        <Card>
             <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-muted-foreground font-medium text-sm">
                    <Trophy className="h-4 w-4 text-amber-500" /> Meilleur Vendeur
                </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-amber-100">
                    <AvatarImage src={topAgent?.image} />
                    <AvatarFallback>{topAgent?.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                    <div className="text-xl font-bold">{topAgent?.name || 'N/A'}</div>
                    <p className="text-sm text-green-600 font-medium">
                        {formatCurrency(topAgent?.totalRevenue || 0)}
                    </p>
                </div>
            </CardContent>
        </Card>

        <Card>
             <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-muted-foreground font-medium text-sm">
                    <Target className="h-4 w-4 text-blue-500" /> Conversion Moyenne
                </CardTitle>
            </CardHeader>
            <CardContent>
                {/* Calcul de la moyenne */}
                <div className="text-4xl font-bold">
                    {agents.length > 0 
                        ? Math.round(agents.reduce((acc, curr) => acc + curr.conversionRate, 0) / agents.length)
                        : 0
                    }%
                </div>
                <p className="text-muted-foreground text-sm mt-1">Sur l'ensemble des leads</p>
            </CardContent>
        </Card>
      </div>

      {/* --- TABLEAU LEADERBOARD --- */}
      <Card>
        <CardHeader>
            <CardTitle>Classement des Agents</CardTitle>
            <CardDescription>Basé sur le chiffre d'affaires validé (Commandes signées).</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                        <tr>
                            <th className="px-6 py-3">Agent</th>
                            <th className="px-6 py-3 text-right">CA Généré</th>
                            <th className="px-6 py-3 text-right">Com. (Est.)</th>
                            <th className="px-6 py-3 text-center">Ventes</th>
                            <th className="px-6 py-3 text-center">Leads Actifs</th>
                            <th className="px-6 py-3 w-1/4">Taux de Conversion</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {agents.map((agent, index) => (
                            <tr key={agent.id} className="bg-white hover:bg-muted/30 transition">
                                <td className="px-6 py-4 font-medium flex items-center gap-3">
                                    <div className="relative">
                                        <Avatar>
                                            <AvatarImage src={agent.image} />
                                            <AvatarFallback>{agent.name.substring(0,2)}</AvatarFallback>
                                        </Avatar>
                                        {index === 0 && (
                                            <div className="absolute -top-1 -right-1 bg-amber-400 text-white rounded-full p-0.5 border border-white">
                                                <Trophy className="h-3 w-3" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="text-foreground font-semibold">{agent.name}</div>
                                        <div className="text-muted-foreground text-xs">{agent.email}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-foreground">
                                    {formatCurrency(agent.totalRevenue)}
                                </td>
                                <td className="px-6 py-4 text-right text-green-600 font-medium">
                                    {formatCurrency(agent.estimatedCommission)}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <Badge variant="secondary">{agent.dealsClosed}</Badge>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {agent.activeLeads}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <span className="font-medium w-8 text-right">{agent.conversionRate}%</span>
                                        <Progress value={agent.conversionRate} className="h-2 flex-1" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}