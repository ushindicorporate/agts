import Link from "next/link";
import { 
  TrendingUp,
  Building2, 
  FileText,
  ListTodo,
  ArrowUpRight,
  Car,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getDashboardStats } from "@/lib/actions/dashboard-actions";
import { cn } from "@/lib/utils";

// --- COMPOSANT KPI ---
interface StatCardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: any;
  colorClass: string;
  href: string;
  trend?: {
    value: string;
    positive: boolean;
  };
}

function StatCard({ title, value, subtext, icon: Icon, colorClass, href, trend }: StatCardProps) {
  return (
    <Link href={href} className="block group">
      <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-none shadow-sm bg-white dark:bg-slate-900">
        
        {/* Barre de couleur discrète sur le côté ou en haut */}
        <div className={cn("absolute left-0 top-0 bottom-0 w-1", colorClass.split(' ')[1].replace('text-', 'bg-'))} />

        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-[8px] lg:text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-primary transition-colors">
                {title}
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {value}
                </h3>
                
                {/* Indicateur de Tendance (Nouveau) */}
                {trend && (
                  <span className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center",
                    trend.positive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                  )}>
                    {trend.positive ? "↑" : "↓"} {trend.value}
                  </span>
                )}
              </div>
            </div>

            {/* Icône avec effet de glassmorphism au hover */}
            <div className={cn(
              "rounded-xl p-2.5 transition-all duration-300 group-hover:rotate-12",
              colorClass
            )}>
              <Icon className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-slate-400 font-medium truncate mr-2">
              {subtext}
            </p>
            <div className="h-6 w-6 rounded-full bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight className="h-3 w-3 text-slate-600" />
            </div>
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
    <div className="space-y-8 max-w-7xl mx-auto py-6 px-4">
      
      {/* Header avec Statut de Synchro "Live" */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Tableau de bord</h1>
          <p className="text-slate-500">Bienvenue, voici l'état actuel des activités d'AGTS.</p>
        </div>
      </div>

      {/* GRILLE KPI RÉVISÉE (5 Colonnes pour inclure Auto) */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <StatCard 
          title="Immobilier" 
          value={stats.counts.properties} 
          subtext="Unités en stock"
          icon={Building2} 
          colorClass="bg-violet-100 text-violet-600"
          href="/dashboard/properties"
        />
        <StatCard 
          title="Automobile" 
          value={stats.counts.vehicles} 
          subtext="Véhicules dispo"
          icon={Car} 
          colorClass="bg-blue-100 text-blue-600"
          href="/dashboard/vehicles"
        />
        <StatCard 
          title="Pipeline" 
          value={stats.counts.leads} 
          subtext="Opportunités"
          icon={TrendingUp} 
          colorClass="bg-emerald-100 text-emerald-600"
          href="/dashboard/leads"
        />
        <StatCard 
          title="Devis" 
          value={stats.counts.offers} 
          subtext="En attente"
          icon={FileText} 
          colorClass="bg-orange-100 text-orange-600"
          href="/dashboard/offers"
        />
        <StatCard 
          title="Tâches" 
          value={stats.counts.tasks} 
          subtext="À traiter"
          icon={ListTodo} 
          colorClass="bg-rose-100 text-rose-600"
          href="/dashboard/tasks"
        />
      </div>

      {/* SECTION ANALYTIQUE (3 Colonnes) */}
      <div className="grid gap-6 lg:grid-cols-3">
         {/* Ici tu gardes tes colonnes : Tâches Prioritaires, Dernières Offres, Top Agents */}
         {/* Mais on va ajouter une petite touche Odoo sur les cartes */}
      </div>

      {/* BANDEAU DE RÉASSURANCE SÉCURITÉ (Mode Entreprise) */}
      <div className="rounded-2xl bg-slate-900 p-6 text-white flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-xl">
            <ShieldCheck className="h-8 w-8 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Sécurité des données AGTS</h3>
            <p className="text-slate-400 text-sm">Toutes les transactions sont chiffrées et synchronisées avec le grand livre Odoo.</p>
          </div>
        </div>
        <button className="hidden md:block px-6 py-2 bg-white text-slate-900 rounded-lg font-bold text-sm hover:bg-slate-100 transition">
          Journal d'audit
        </button>
      </div>
    </div>
  );
}