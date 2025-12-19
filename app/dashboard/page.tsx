import Link from "next/link";
import { 
  TrendingUp, 
  Users, 
  Building2, 
  Wallet,
  ArrowRight,
  Home,
  ArrowUpRight
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getDashboardStats } from "@/lib/actions/dashboard-actions";
import { formatCurrency } from "@/lib/utils";

// --- COMPOSANT STAT CARD AMÉLIORÉ ---
interface StatCardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: any;
  colorClass: string;
  href?: string; // Nouveau prop optionnel pour le lien
}

function StatCard({ title, value, subtext, icon: Icon, colorClass, href }: StatCardProps) {
  // Contenu interne de la carte
  const CardContent = (
    <div className={`rounded-xl border bg-card p-6 shadow-sm h-full flex flex-col justify-between transition-all duration-300 ${href ? 'hover:shadow-md hover:-translate-y-1 hover:border-primary/50 cursor-pointer group' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">{title}</p>
          <h3 className="mt-2 text-3xl font-bold text-foreground">{value}</h3>
        </div>
        <div className={`rounded-full p-3 ${colorClass} transition-transform group-hover:scale-110`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{subtext}</span>
        {/* Petite flèche qui apparaît au survol si c'est un lien */}
        {href && <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />}
      </div>
    </div>
  );

  // Si un lien est fourni, on enveloppe dans Link, sinon on retourne la div simple
  if (href) {
    return <Link href={href} className="block h-full">{CardContent}</Link>;
  }

  return <div className="h-full">{CardContent}</div>;
}

// --- PAGE DASHBOARD ---

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Tableau de bord</h1>
        <p className="text-muted-foreground">Vue d'ensemble de votre agence synchronisée Odoo.</p>
      </div>

      {/* 1. GRID KPI AVEC LIENS */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Lien vers le portefeuille de biens */}
        <StatCard 
          title="Biens en portefeuille" 
          value={stats.counts.properties} 
          subtext={`${stats.counts.available} actuellement disponibles`}
          icon={Building2} 
          colorClass="bg-blue-100 text-blue-600"
          href="/dashboard/properties"
        />

        {/* Lien vers le CRM Contacts */}
        <StatCard 
          title="Contacts CRM" 
          value={stats.counts.contacts} 
          subtext="Base clients totale"
          icon={Users} 
          colorClass="bg-purple-100 text-purple-600"
          href="/dashboard/contacts"
        />

        {/* Lien vers les Leads (Pour l'instant vers les contacts, ou une future page /leads) */}
        <StatCard 
          title="Opportunités (Leads)" 
          value={stats.counts.leads} 
          subtext="Dossiers en cours" 
          icon={TrendingUp} 
          colorClass="bg-green-100 text-green-600"
          href="/dashboard/contacts" 
        />

        {/* Lien vers les biens (filtré mentalement pour l'utilisateur) */}
        <StatCard 
          title="Taux de disponibilité" 
          value={`${Math.round((stats.counts.available / (stats.counts.properties || 1)) * 100)}%`} 
          subtext="Biens actifs sur le marché" 
          icon={Wallet} 
          colorClass="bg-orange-100 text-orange-600"
          href="/dashboard/properties"
        />
      </div>

      {/* 2. SECTION LISTES (2 Colonnes) */}
      <div className="grid gap-8 lg:grid-cols-2">
        
        {/* COLONNE GAUCHE : DERNIERS LEADS */}
        <div className="rounded-xl border bg-card shadow-sm flex flex-col">
          <div className="border-b px-6 py-4 flex justify-between items-center bg-muted/20">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                Dernières Opportunités
            </h3>
            <Link href="/dashboard/contacts" className="text-xs text-primary hover:underline font-medium">
               Voir le CRM
            </Link>
          </div>
          <div className="p-0 flex-1">
            {stats.recentLeads.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground text-sm">Aucun lead récent.</div>
            ) : (
                stats.recentLeads.map((lead: any) => (
                // Lien vers la fiche contact associée au lead
                <Link 
                    key={lead.id} 
                    href={`/dashboard/contacts/${lead.partner_id ? lead.partner_id[0] : ''}`} // On suppose que partner_id est [id, name]
                    className="flex items-center justify-between border-b px-6 py-4 last:border-0 hover:bg-muted/50 transition group"
                >
                    <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 border group-hover:border-primary/50 transition-colors">
                            <AvatarFallback className="bg-green-50 text-green-700 font-bold">
                                {lead.contact ? lead.contact.substring(0, 2).toUpperCase() : '??'}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium text-foreground truncate max-w-[200px] group-hover:text-primary transition-colors">
                                {lead.name}
                            </p>
                            <p className="text-sm text-muted-foreground">{lead.contact}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold text-foreground">
                            {lead.revenue > 0 ? formatCurrency(lead.revenue) : '-'}
                        </p>
                        <span className="text-xs text-muted-foreground">
                            {new Date(lead.date).toLocaleDateString('fr-FR')}
                        </span>
                    </div>
                </Link>
                ))
            )}
          </div>
        </div>

        {/* COLONNE DROITE : DERNIERS BIENS */}
        <div className="rounded-xl border bg-card shadow-sm flex flex-col">
          <div className="border-b px-6 py-4 flex justify-between items-center bg-muted/20">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Home className="h-4 w-4 text-blue-600" />
                Derniers Biens Ajoutés
            </h3>
            <Link href="/dashboard/properties" className="text-sm text-primary hover:underline flex items-center font-medium">
                Tout voir <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
          <div className="p-0 flex-1">
             {stats.recentProperties.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground text-sm">Aucun bien.</div>
            ) : (
                stats.recentProperties.map((prop: any) => (
                <Link 
                    href={`/dashboard/properties/${prop.id}`} 
                    key={prop.id} 
                    className="flex items-center gap-4 border-b px-6 py-4 last:border-0 hover:bg-muted/50 transition group"
                >
                    {/* Vignette Image */}
                    <div className="h-12 w-16 bg-muted rounded overflow-hidden shrink-0 border group-hover:border-primary/50 transition-colors">
                        {prop.image ? (
                            <img src={`data:image/png;base64,${prop.image}`} alt={prop.name} className="h-full w-full object-cover" />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center bg-gray-100">
                                <Building2 className="h-4 w-4 text-gray-300" />
                            </div>
                        )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                            {prop.name}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground gap-2">
                             <Badge variant="outline" className="text-[10px] py-0 h-5 border-border font-normal text-muted-foreground">
                                {prop.type || 'N/A'}
                             </Badge>
                             <span className="truncate">{prop.city}</span>
                        </div>
                    </div>

                    <div className="font-bold text-sm text-foreground">
                        {formatCurrency(prop.price)}
                    </div>
                </Link>
                ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}