import { redirect } from "next/navigation";
import { UserNav } from "@/components/Layout/UserNav"; // Import du nouveau composant
import { createClient } from "@/lib/supabase/server";
import { SidebarContent } from "@/components/Layout/SidebarContent";
import { MobileNav } from "@/components/Layout/MobileNav";
import { Search } from "lucide-react";
import { Breadcrumbs } from "@/components/Layout/Breadcrumbs";

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
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-8 shadow-sm z-10">
          <div className="flex items-center gap-6">
            <MobileNav /> {/* Visible uniquement sur mobile via CSS du composant */}
            <div className="hidden lg:flex items-center px-3 py-1.5 bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition cursor-pointer w-64 group">
              <Search className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium">Rechercher (Immo, Auto...)</span>
              <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium text-slate-500 opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
            <Breadcrumbs />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{displayName}</p>
              <div className="flex items-center justify-end gap-1">
                 <p className="text-xs text-gray-500">Agent Immobilier</p>
                 {profile?.odoo_partner_id && (
                    <span className="flex h-2 w-2 rounded-full bg-green-500" title="Synchronisé Odoo" />
                 )}
              </div>
            </div>
            
            {/* Le composant Client qui contient le Menu et le Logout */}
            <UserNav 
              fullName={displayName} 
              email={displayEmail} 
              avatarUrl={profile?.avatar_url || ""}
              initials={initials}
            />
          </div>
        </header>

        {/* Contenu de la page */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}