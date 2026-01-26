import { notFound } from 'next/navigation';
import Link from 'next/link';
import ActivityTimeline from '@/components/crm/ActivityTimeline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, CheckCircle, XCircle, User, Mail, 
  Phone, DollarSign, Calendar, Star, Briefcase,
  ExternalLink, Info
} from 'lucide-react';
import { getLeadById } from '@/lib/actions/pipeline-actions';
import { getActivityHistory } from '@/lib/actions/crm-actions';
import LeadActions from './LeadActions';
import { formatCurrency, formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default async function LeadDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const leadId = parseInt(id);

  if (isNaN(leadId)) return notFound();

  // Chargement Parallèle des données système
  const [lead, history] = await Promise.all([
    getLeadById(leadId),
    getActivityHistory('crm.lead', leadId) 
  ]);

  if (!lead) return notFound();

  return (
    <div className="max-w-6xl mx-auto py-4 md:py-8 px-4 space-y-6 min-h-screen bg-slate-50/30 dark:bg-transparent">
      
      {/* --- NAVIGATION & ACTIONS (Responsive) --- */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/leads">
            <Button variant="outline" size="icon" className="rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    {lead.name}
                </h1>
                <Badge className="bg-primary/10 text-primary border-none font-bold uppercase text-[9px] tracking-widest px-2">
                    {lead.stageName}
                </Badge>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Créé le {formatDate(lead.createDate)}
            </p>
          </div>
        </div>
        
        {/* BOUTONS GAGNÉ/PERDU - Toujours visibles en haut */}
        <div className="flex items-center gap-2 w-full md:w-auto">
            <LeadActions leadId={lead.id} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* === COLONNE GAUCHE (Business & Client) === */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* KPI BAR (Mobile: Vertical / Tablet+: Horizontal) */}
            <Card className="border-none shadow-sm rounded-3xl md:rounded-4xl bg-white dark:bg-slate-950 overflow-hidden">
                <CardContent className="p-0 flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800">
                    <div className="p-6 flex-1 space-y-1">
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Budget Estimé</p>
                        <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                            {formatCurrency(lead.expectedRevenue)}
                        </p>
                    </div>
                    <div className="p-6 flex-1 space-y-2">
                        <div className="flex justify-between items-center">
                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Probabilité</p>
                            <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{lead.probability}%</span>
                        </div>
                        <Progress value={lead.probability} className="h-1.5 bg-slate-100 dark:bg-slate-800" />
                    </div>
                    <div className="p-6 flex-1 space-y-1 text-center sm:text-left">
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Priorité AGTS</p>
                        <div className="flex justify-center sm:justify-start gap-1 pt-1">
                            {[1, 2, 3].map(i => (
                                <Star 
                                    key={i} 
                                    size={18} 
                                    className={cn(
                                        i <= parseInt(lead.priority || '0') 
                                        ? "fill-orange-500 text-orange-500" 
                                        : "text-slate-200 dark:text-slate-800"
                                    )} 
                                />
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* FICHE CLIENT & PATRIMOINE (Restaurée) */}
            <Card className="border-none shadow-sm rounded-3xl bg-white dark:bg-slate-950 overflow-hidden">
                <CardHeader className="pb-4 flex flex-row items-center justify-between border-b border-slate-50 dark:border-slate-900">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
                            <User className="h-4 w-4 text-indigo-600" />
                        </div>
                        <CardTitle className="text-base font-bold">Client / Prospect</CardTitle>
                    </div>
                    {lead.partnerId && (
                        <Link href={`/dashboard/contacts/${lead.partnerId}`}>
                            <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black uppercase text-indigo-600 gap-1 hover:bg-indigo-50">
                                Voir Patrimoine <ExternalLink className="h-3 w-3" />
                            </Button>
                        </Link>
                    )}
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    {/* Profil rapide */}
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-600 flex items-center justify-center font-black text-xl border border-slate-200 dark:border-slate-800">
                            {lead.partnerName.substring(0, 1)}
                        </div>
                        <div>
                            <p className="font-black text-slate-900 dark:text-white text-lg leading-tight">{lead.partnerName}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-[9px] font-bold py-0 h-4 border-slate-200 dark:border-slate-800">Réf. O-{lead.id}</Badge>
                            </div>
                        </div>
                    </div>

                    {/* Actions de contact mobile-friendly */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <a 
                            href={`mailto:${lead.email}`} 
                            className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                        >
                            <Mail className="h-4 w-4 text-slate-400" />
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">
                                {lead.email || 'Aucun email enregistré'}
                            </span>
                        </a>
                        <a 
                            href={`tel:${lead.phone}`} 
                            className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                        >
                            <Phone className="h-4 w-4 text-emerald-500" />
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                {lead.phone || 'Aucun numéro'}
                            </span>
                        </a>
                    </div>
                </CardContent>
            </Card>

            {/* DESCRIPTION DU BESOIN */}
            <Card className="border-none shadow-sm rounded-3xl bg-white dark:bg-slate-950">
                <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-slate-400" />
                        <CardTitle className="text-base font-bold text-slate-500 uppercase tracking-widest text-[10px]">
                            Description du besoin
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap min-h-[120px] border border-slate-100 dark:border-slate-800">
                        {lead.description || "Aucune description détaillée n'a été saisie pour cette opportunité."}
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* === COLONNE DROITE : TIMELINE (Mobile: Devient liste sous les infos) === */}
        <div className="lg:col-span-1 space-y-6">
             <div className="lg:sticky lg:top-6">
                <ActivityTimeline 
                    partnerId={leadId} 
                    history={history} 
                    resModel="crm.lead" // Important pour poster sur le lead
                />
             </div>
        </div>

      </div>
      
      {/* Petit footer mobile pour s'assurer que rien n'est caché sous les boutons flottants si tu en ajoutes */}
      <div className="h-20 lg:hidden" />
    </div>
  );
}