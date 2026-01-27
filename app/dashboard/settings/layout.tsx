'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Users, ShieldClose, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const settingsNav = [
  { label: "Mon Profil", href: "/dashboard/settings", icon: User },
  { label: "Gestion d'Équipe", href: "/dashboard/settings/users", icon: Users, adminOnly: true },
  { label: "Connexions", href: "/dashboard/settings/connections", icon: Globe },
  { label: "Sécurité", href: "/dashboard/settings/security", icon: ShieldClose },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Navigation Latérale des Paramètres */}
        <aside className="w-full md:w-64 space-y-1">
          <p className="px-4 mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Paramètres Système</p>
          {settingsNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all",
                pathname === item.href 
                  ? "bg-slate-900 text-white dark:bg-primary shadow-lg" 
                  : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </aside>

        {/* Contenu de la sous-page */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}