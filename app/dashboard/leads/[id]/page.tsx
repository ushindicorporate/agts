import { notFound } from 'next/navigation';
import Link from 'next/link';
import ActivityTimeline from '@/components/crm/ActivityTimeline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, CheckCircle, XCircle, User, Mail, Phone, DollarSign } from 'lucide-react';
import { getLeadById } from '@/lib/actions/pipeline-actions';
import { getContactHistory } from '@/lib/actions/crm-actions';
import LeadActions from './LeadActions';

export default async function LeadDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const leadId = parseInt(id);

  const [lead, history] = await Promise.all([
    getLeadById(leadId),
    getContactHistory(leadId) // Odoo stocke l'historique lead dans mail.message aussi (res_id=leadId, model='crm.lead')
  ]);

  if (!lead) return notFound();

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
            <Link href="/dashboard/leads">
                <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
            </Link>
            <div>
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">{lead.name}</h1>
                    <Badge variant="outline" className="text-sm">{lead.stageName}</Badge>
                </div>
                <p className="text-muted-foreground text-sm">Créé le {new Date(lead.createDate).toLocaleDateString()}</p>
            </div>
        </div>
        
        {/* BOUTONS D'ACTION (Client Component) */}
        <LeadActions leadId={lead.id} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLONNE GAUCHE : INFOS */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* KPI BAR */}
            <Card>
                <CardContent className="p-6 flex justify-around items-center text-center divide-x">
                    <div className="px-4 w-full">
                        <p className="text-xs text-muted-foreground uppercase font-bold">Revenu Espéré</p>
                        <p className="text-2xl font-bold text-green-600 flex items-center justify-center gap-1">
                            <DollarSign className="h-5 w-5" />
                            {new Intl.NumberFormat('fr-FR').format(lead.expectedRevenue)}
                        </p>
                    </div>
                    <div className="px-4 w-full">
                        <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Probabilité</p>
                        <div className="flex items-center gap-2 justify-center">
                            <span className="font-bold">{lead.probability}%</span>
                        </div>
                        <Progress value={lead.probability} className="h-2 mt-2" />
                    </div>
                    <div className="px-4 w-full">
                        <p className="text-xs text-muted-foreground uppercase font-bold">Priorité</p>
                        <div className="flex justify-center mt-1">
                            {[1, 2, 3].map(i => (
                                <span key={i} className={`text-xl ${i <= parseInt(lead.priority || '0') ? 'text-yellow-500' : 'text-gray-200'}`}>★</span>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* CONTACT INFO */}
            <Card>
                <CardHeader><CardTitle>Client / Prospect</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-full text-blue-600"><User size={20} /></div>
                        <div>
                            <p className="font-medium text-lg">{lead.partnerName}</p>
                            {lead.partnerId && (
                                <Link href={`/dashboard/contacts/${lead.partnerId}`} className="text-sm text-primary hover:underline">
                                    Voir la fiche complète
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span>{lead.email || 'Aucun email'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{lead.phone || 'Aucun téléphone'}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* NOTES */}
            <Card>
                <CardHeader><CardTitle>Description de l'opportunité</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {lead.description || "Aucune description saisie."}
                    </p>
                </CardContent>
            </Card>
        </div>

        {/* COLONNE DROITE : TIMELINE */}
        <div className="lg:col-span-1">
             <div className="sticky top-6">
                <ActivityTimeline partnerId={leadId} history={history} />
                {/* Note: Il faut adapter ActivityTimeline pour accepter 'crm.lead' comme model si tu veux poster des notes sur le lead et pas le contact */}
             </div>
        </div>

      </div>
    </div>
  );
}