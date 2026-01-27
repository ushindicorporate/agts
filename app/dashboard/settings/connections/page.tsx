import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Calendar, Mail, MessageCircle, CheckCircle2 } from "lucide-react";
import GoogleConnectBtn from "@/components/admin/GoogleConnectBtn";

export default async function ConnectionsPage() {
  // Plus tard, on vérifiera ici si l'utilisateur est déjà connecté via Supabase
  const isGoogleConnected = false; 

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="space-y-1">
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Intégrations</h2>
        <p className="text-sm text-slate-500 font-medium">Liez vos outils de travail pour synchroniser vos activités.</p>
      </div>

      <div className="grid gap-6">
        {/* GOOGLE INTEGRATION */}
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-start gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-2xl text-blue-600">
                  <Globe size={32} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-xl">Google Workspace</h3>
                    {isGoogleConnected && (
                      <Badge className="bg-emerald-500 text-white border-none text-[10px] font-black uppercase px-2">
                        Connecté
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 max-w-md">
                    Synchronisez votre **Calendrier** pour vos visites immo et utilisez votre adresse **Gmail** pour envoyer des documents aux clients.
                  </p>
                </div>
              </div>
              
              <GoogleConnectBtn isConnected={isGoogleConnected} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 text-slate-400">
                    <Calendar size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Sync Calendrier</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                    <Mail size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Envoi Gmail direct</span>
                </div>
            </div>
          </CardContent>
        </Card>

        {/* WHATSAPP API (A venir) */}
        <Card className="border-none shadow-sm bg-slate-50 dark:bg-slate-900/50 rounded-xl opacity-60">
          <CardContent className="p-8 flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="flex items-start gap-4">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl text-emerald-600">
                  <MessageCircle size={32} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-black text-xl text-slate-400">WhatsApp Business API</h3>
                  <p className="text-sm text-slate-400 max-w-md">
                    Automatisez les notifications de visites et envoyez des fiches immo via WhatsApp. (Bientôt disponible)
                  </p>
                </div>
             </div>
             <Button disabled variant="outline" className="rounded-xl font-bold">Prochainement</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}