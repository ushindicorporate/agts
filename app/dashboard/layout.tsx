import { redirect } from "next/navigation";
import { UserNav } from "@/components/Layout/UserNav"; // Import du nouveau composant
import { createClient } from "@/lib/supabase/server";
import { SidebarContent } from "@/components/Layout/SidebarContent";
import { MobileNav } from "@/components/Layout/MobileNav";
import { Search } from "lucide-react";
import { Breadcrumbs } from "@/components/Layout/Breadcrumbs";
import { SearchTrigger } from "@/components/Layout/SearchTrigger";
import { CommandSearch } from "@/components/Layout/CommandSearch";
import { ModeToggle } from "@/components/Layout/ModeToggle";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // 1. Vérif session
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // 2. Récupération données profil
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, avatar_url, odoo_partner_id')
    .eq('id', user.id)
    .single();

  // 3. Préparation des données pour l'affichage
  const displayName = profile?.full_name || user.email?.split('@')[0] || "Agent";
  const displayEmail = profile?.email || user.email || "";
  
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar Fixe */}
      <aside className="hidden md:block w-72 h-full border-r bg-white inset-y-0 z-80">
        <SidebarContent />
      </aside>

      {/* Zone Principale */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header Interne */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white dark:bg-slate-900 px-8 shadow-sm z-10">
          <div className="flex items-center gap-6">
            <MobileNav />
            <SearchTrigger /> 
            <Breadcrumbs />
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {/* INDICATEUR ODOO (Optionnel ici) */}
            {profile?.odoo_partner_id && (
              <div className="hidden sm:flex h-2 w-2 rounded-full bg-green-500 animate-pulse" title="Synchronisé Odoo" />
            )}

            {/* LE SWITCHER DE THÈME */}
            <ModeToggle />

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

            <div className="flex items-center gap-4">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-none mb-1">
                  {displayName}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-tighter">
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
        {/* <CommandSearch /> */}

        {/* Contenu de la page */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}