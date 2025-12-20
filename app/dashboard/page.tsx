import Link from "next/link";
import { 
  TrendingUp, 
  Users, 
  Building2, 
  FileText,
  ListTodo,
  ArrowRight,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Trophy
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats } from "@/lib/actions/dashboard-actions";
import { formatCurrency, formatDate } from "@/lib/utils";

// --- COMPOSANT KPI ---
interface StatCardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: any;
  colorClass: string;
  href: string;
}

function StatCard({ title, value, subtext, icon: Icon, colorClass, href }: StatCardProps) {
  return (
    <Link href={href} className="block group">
      <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer border-l-4" style={{ borderLeftColor: 'currentColor' }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">{title}</p>
              <h3 className="mt-2 text-3xl font-bold text-foreground">{value}</h3>
            </div>
            <div className={`rounded-full p-3 ${colorClass} group-hover:scale-110 transition-transform`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>{subtext}</span>
            <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// --- PAGE PRINCIPALE ---

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-8 px-4">
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Vue d'ensemble</h1>
        <p className="text-muted-foreground">Suivi de l'activité commerciale et administrative.</p>
      </div>

      {/* 1. GRILLE KPI (4 Colonnes) */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        
        {/* OFFRES / VENTES */}
        <StatCard 
          title="Offres & Devis" 
          value={stats.counts.offers} 
          subtext={`Vol. récent: ${formatCurrency(stats.financials.recentVolume)}`}
          icon={FileText} 
          colorClass="bg-orange-100 text-orange-600"
          href="/dashboard/offers"
        />

        {/* TÂCHES */}
        <StatCard 
          title="Tâches à faire" 
          value={stats.counts.tasks} 
          subtext="Actions en attente"
          icon={ListTodo} 
          colorClass="bg-amber-100 text-amber-600"
          href="/dashboard/tasks"
        />

        {/* LEADS */}
        <StatCard 
          title="Pipeline Leads" 
          value={stats.counts.leads} 
          subtext="Opportunités actives" 
          icon={TrendingUp} 
          colorClass="bg-emerald-100 text-emerald-600"
          href="/dashboard/leads" 
        />

        {/* BIENS */}
        <StatCard 
          title="Biens en Stock" 
          value={stats.counts.properties} 
          subtext="Portefeuille immobilier" 
          icon={Building2} 
          colorClass="bg-blue-100 text-blue-600"
          href="/dashboard/properties"
        />
      </div>

      {/* 2. SECTION LISTES (2 Colonnes) */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* COLONNE GAUCHE : TÂCHES URGENTES (Priorité Action) */}
        <Card className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between bg-muted/20 border-b py-4">
                <CardTitle className="text-base flex items-center gap-2">
                    <ListTodo className="h-5 w-5 text-amber-600" />
                    Tâches Prioritaires
                </CardTitle>
                <Link href="/dashboard/tasks" className="text-sm text-primary hover:underline flex items-center">
                    Voir tout <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
            </CardHeader>
            <CardContent className="p-0 flex-1">
                {stats.urgentTasks.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground text-sm flex flex-col items-center">
                        <CheckCircle2 className="h-8 w-8 text-green-500 mb-2 opacity-50" />
                        Vous êtes à jour ! Aucune tâche urgente.
                    </div>
                ) : (
                    <div className="divide-y">
                        {stats.urgentTasks.map((task: any) => (
                            <Link 
                                key={task.id} 
                                href="/dashboard/tasks" // Idéalement lien vers l'objet lié
                                className="flex items-start gap-3 p-4 hover:bg-muted/50 transition group"
                            >
                                <div className="mt-1">
                                    {/* Indicateur visuel d'urgence simple */}
                                    <div className="h-2 w-2 rounded-full bg-amber-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-foreground group-hover:text-primary truncate">
                                        {task.summary}
                                    </p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                        <span>{task.type}</span> • <span>{task.target}</span>
                                    </p>
                                </div>
                                <div className="text-right whitespace-nowrap">
                                    <Badge variant="outline" className="text-xs font-normal flex items-center gap-1 text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        {formatDate(task.deadline)}
                                    </Badge>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>

        {/* COLONNE DROITE : DERNIÈRES OFFRES (Priorité Business) */}
        <Card className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between bg-muted/20 border-b py-4">
                <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-5 w-5 text-orange-600" />
                    Dernières Offres
                </CardTitle>
                <Link href="/dashboard/offers" className="text-sm text-primary hover:underline flex items-center">
                    Tout voir <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
            </CardHeader>
            <CardContent className="p-0 flex-1">
                {stats.recentOffers.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground text-sm">
                        Aucune offre récente. Créez votre premier devis.
                    </div>
                ) : (
                    <div className="divide-y">
                        {stats.recentOffers.map((offer: any) => (
                            <div key={offer.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-9 w-9 bg-orange-50 text-orange-700 border border-orange-100">
                                        <AvatarFallback className="text-xs font-bold">
                                            {offer.client ? offer.client.substring(0, 2).toUpperCase() : 'NA'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{offer.name}</p>
                                        <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                                            {offer.client}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-foreground">
                                        {formatCurrency(offer.amount)}
                                    </p>
                                    {/* Badge d'état simplifié */}
                                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                                        offer.state === 'sale' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {offer.state === 'sale' ? 'Signé' : 'Devis'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>

        {/* COLONNE 3 : TOP AGENTS (Nouveau) */}
        <Card className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between bg-muted/20 border-b py-4">
                <CardTitle className="text-base flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    Meilleurs Agents
                </CardTitle>
                <Link href="/dashboard/agents" className="text-sm text-primary hover:underline flex items-center">
                    Détails <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
            </CardHeader>
            <CardContent className="p-0 flex-1">
                {stats.topAgents.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground text-sm">
                        Aucune donnée de performance disponible.
                    </div>
                ) : (
                    <div className="divide-y">
                        {stats.topAgents.map((agent: any, index: number) => (
                            <div key={agent.id} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition">
                                <div className="relative">
                                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                        <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">
                                            {agent.name.substring(0, 2)}
                                        </AvatarFallback>
                                        <AvatarImage src={agent.image} />
                                    </Avatar>
                                    {/* Badge de rang */}
                                    <div className={`absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white ${
                                        index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-orange-400"
                                    }`}>
                                        {index + 1}
                                    </div>
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm text-foreground truncate">{agent.name}</p>
                                    <p className="text-xs text-muted-foreground">{agent.deals} ventes</p>
                                </div>

                                <div className="text-right">
                                    <span className="text-sm font-bold text-foreground">
                                        {formatCurrency(agent.revenue)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}