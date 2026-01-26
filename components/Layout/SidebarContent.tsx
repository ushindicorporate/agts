'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  FileText, 
  Settings, 
  TrendingUp,
  ListTodo,
  Banknote,
  FolderOpen,
  BarChart3,
  Car,
  Wrench,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/lib/actions/auth-actions";

const menuGroups = [
  {
    group: "Général",
    routes: [
      { label: "Vue d'ensemble", icon: LayoutDashboard, href: "/dashboard", color: "text-sky-500" },
      { label: "Leads & Pipeline", icon: TrendingUp, href: "/dashboard/leads", color: "text-emerald-500" },
      { label: "Mes Tâches", icon: ListTodo, href: "/dashboard/tasks", color: "text-amber-600" },
    ]
  },
  {
    group: "Pôle Immobilier",
    routes: [
      { label: "Parc Immobilier", icon: Building2, href: "/dashboard/properties", color: "text-violet-500" },
      { label: "Contrats & Baux", icon: FileText, href: "/dashboard/leases", color: "text-orange-700" },
    ]
  },
  {
    group: "Pôle Automobile",
    routes: [
      { label: "Stock Véhicules", icon: Car, href: "/dashboard/vehicles", color: "text-blue-600" },
      { label: "Suivi Technique", icon: Wrench, href: "/dashboard/fleet", color: "text-red-600" },
    ]
  },
  {
    group: "Administration",
    routes: [
      { label: "Contacts CRM", icon: Users, href: "/dashboard/contacts", color: "text-pink-700" },
      { label: "Finances & Com.", icon: Banknote, href: "/dashboard/finance", color: "text-green-600" },
      { label: "Documents", icon: FolderOpen, href: "/dashboard/documents", color: "text-slate-600" },
      { label: "Rapports", icon: BarChart3, href: "/dashboard/reporting", color: "text-gray-700" },
    ]
  }
];

export function SidebarContent() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="px-6 py-2 flex-1 overflow-y-auto scrollbar-none">
        
        {/* LOGO & BRANDING */}
        <Link href="/dashboard" className="flex items-center mb-10 group">
          <div className="h-9 w-9 bg-slate-900 dark:bg-primary rounded-xl flex items-center justify-center text-white font-black shadow-lg group-hover:scale-105 transition-transform duration-200">
            AG
          </div>
          <div className="ml-3 flex flex-col">
            <span className="text-xl font-black tracking-tighter leading-none dark:text-white">
                AGTS
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">
                Système Pro
            </span>
          </div>
        </Link>

        {/* NAVIGATION GROUPS */}
        {menuGroups.map((group) => (
          <div key={group.group} className="mb-8">
            <h3 className="px-2 mb-3 text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 dark:text-slate-500">
              {group.group}
            </h3>
            <div className="space-y-1">
              {group.routes.map((route) => {
                const isActive = pathname === route.href;
                return (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "text-sm group flex p-2.5 w-full justify-start font-bold rounded-xl transition-all duration-200 relative overflow-hidden",
                      isActive 
                        ? "text-primary bg-primary/5 dark:bg-primary/10 shadow-[inset_0_0_0_1px_rgba(var(--primary),0.1)]" 
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    )}
                  >
                    {/* Indicateur actif vertical */}
                    {isActive && (
                        <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-full" />
                    )}

                    <div className="flex items-center flex-1">
                      <route.icon className={cn(
                        "h-5 w-5 mr-3 transition-colors duration-200", 
                        isActive ? route.color : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                      )} />
                      {route.label}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER SIDEBAR (Paramètres & Déconnexion) */}
      <div className="px-4 py-4 mt-auto border-t border-slate-100 dark:border-slate-800 space-y-1">
         <Link
            href="/dashboard/settings"
            className={cn(
                "text-sm group flex p-2.5 w-full justify-start font-bold rounded-xl transition-all text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50",
                pathname === "/dashboard/settings" && "text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800"
            )}
         >
            <Settings className="h-5 w-5 mr-3 text-slate-400" />
            Paramètres
         </Link>
         
         <button
            onClick={() => signOutAction()}
            className="text-sm group flex p-2.5 w-full justify-start font-bold rounded-xl transition-all text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
         >
            <LogOut className="h-5 w-5 mr-3 text-rose-400" />
            Déconnexion
         </button>
      </div>
    </div>
  );
}