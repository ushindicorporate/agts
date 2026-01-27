import { getMyProfile } from "@/lib/actions/user-actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Zap, User } from "lucide-react";
import { cn } from "@/lib/utils";
import ProfileForm from "./ProfileForm";

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Administrateur",
  admin: "Administrateur",
  agent: "Agent Commercial",
  finance: "Gestionnaire Finance",
};

export default async function SettingsPage() {
  const profile = await getMyProfile();

  if (!profile) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="space-y-1">
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Mon Profil</h2>
        <p className="text-sm text-slate-500 font-medium">Gérez vos informations personnelles et vos préférences.</p>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        
        {/* CARTE DE STATUT (GAUCHE) */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-4xl overflow-hidden">
            <CardContent className="pt-8 pb-6 flex flex-col items-center text-center">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-4 border-slate-50 dark:border-slate-800 shadow-xl transition-transform group-hover:scale-105">
                  <AvatarImage src={profile.avatar_url || ""} />
                  <AvatarFallback className="text-2xl font-black bg-indigo-50 text-indigo-600 dark:bg-slate-800">
                    {profile.full_name && profile.full_name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 p-1.5 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-900 shadow-sm" />
              </div>
              
              <h3 className="mt-4 font-black text-xl text-slate-900 dark:text-white">
                {profile.full_name}
              </h3>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">
                {ROLE_LABELS[profile.role]}
              </p>

              <div className="mt-6 w-full space-y-2">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                   <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                      <ShieldCheck size={14} className="text-primary" /> Permissions
                   </div>
                   <span className="text-[10px] font-black uppercase text-slate-900 dark:text-white">Activées</span>
                </div>
                
                {profile.odoo_user_id && (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                        <Zap size={14} fill="currentColor" /> Synchro Odoo
                    </div>
                    <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-400">ID #{profile.odoo_user_id}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FORMULAIRE (DROITE) */}
        <div className="lg:col-span-2">
          <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-4xl">
            <CardHeader>
              <CardTitle className="text-lg font-black">Informations Personnelles</CardTitle>
              <CardDescription>Mettez à jour vos coordonnées professionnelles.</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm profile={profile} />
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}