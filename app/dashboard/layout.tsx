import { redirect } from "next/navigation";
import { UserNav } from "@/components/Layout/UserNav";
import { createClient } from "@/lib/supabase/server";
import { SidebarContent } from "@/components/Layout/SidebarContent";
import { MobileNav } from "@/components/Layout/MobileNav";
import { Breadcrumbs } from "@/components/Layout/Breadcrumbs";
import { SearchTrigger } from "@/components/Layout/SearchTrigger";
import { ModeToggle } from "@/components/Layout/ModeToggle";
import { cn } from "@/lib/utils";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // 1. Vérif session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/");
  }

  // 2. Récupération données profil
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, avatar_url, odoo_partner_id')
    .eq('id', user.id)
    .single();

  const displayName = profile?.full_name || user.email?.split('@')[0] || "Agent";
  const displayEmail = profile?.email || user.email || "";
  
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* SIDEBAR : Fixe sur Desktop, Cachée sur Mobile */}
      <aside className="hidden lg:block w-72 h-full border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-50">
        <SidebarContent />
      </aside>

      {/* ZONE PRINCIPALE */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* HEADER : Adaptatif Mobile/Desktop */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 md:px-8 shadow-sm z-40">
          
          {/* Gauche : Navigation & Recherche */}
          <div className="flex items-center gap-2 md:gap-6">
            <MobileNav /> {/* Hamburger menu sur mobile */}
            
            {/* On cache les breadcrumbs sur mobile très petit */}
            <div className="hidden sm:block">
              <Breadcrumbs />
            </div>

            {/* La barre de recherche se réduit sur mobile via SearchTrigger interne */}
            <SearchTrigger /> 
          </div>
          
          {/* Droite : Outils & Profil */}
          <div className="flex items-center gap-1 sm:gap-4">
            
            {/* Status de synchro (Point uniquement sur mobile) */}
            {profile?.odoo_partner_id && (
              <div className="flex items-center">
                 <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" title="Système synchronisé"></span>
                 </span>
              </div>
            )}

            <ModeToggle />

            {/* Séparateur vertical */}
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden xs:block" />

            <div className="flex items-center gap-3">
              {/* Infos texte : Uniquement sur Large Desktop pour éviter l'encombrement */}
              <div className="text-right hidden xl:block">
                <p className="text-sm font-black text-slate-900 dark:text-white leading-none mb-1 truncate max-w-[150px]">
                  {displayName}
                </p>
                <p className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">
                  Agent AGTS
                </p>
              </div>
              
              <UserNav 
                fullName={displayName} 
                email={displayEmail} 
                avatarUrl={profile?.avatar_url || ""}
                initials={initials}
              />
            </div>
          </div>
        </header>

        {/* CONTENU DE LA PAGE : Scrollable avec padding adaptatif */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 bg-slate-50/50 dark:bg-slate-950 transition-colors">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>

        {/* OPTIONNEL : Barre de navigation mobile basse (si tu veux un look App) */}
        {/* <div className="lg:hidden h-16 border-t bg-white dark:bg-slate-900 flex items-center justify-around"> ... </div> */}

      </main>
    </div>
  );
}