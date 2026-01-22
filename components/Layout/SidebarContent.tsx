'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  FileText, // Pour les offres plus tard
  Settings, 
  TrendingUp,
  ListTodo,
  Trophy,
  Banknote,
  FolderOpen,
  BarChart3,
  Car,
  Wrench
} from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div className="space-y-4 py-4 flex flex-col h-full bg-white text-gray-900 overflow-y-auto">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-10">
          <div className="h-8 w-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold mr-3 shadow-lg">
            AG
          </div>
          <span className="text-xl font-bold tracking-tight">AGTS <span className="text-[10px] font-light bg-slate-100 px-1 rounded">PRO</span></span>
        </Link>

        {menuGroups.map((group) => (
          <div key={group.group} className="mb-6">
            <h3 className="px-4 mb-2 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              {group.group}
            </h3>
            <div className="space-y-1">
              {group.routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "text-sm group flex p-2.5 w-full justify-start font-medium rounded-xl transition-all duration-200",
                    pathname === route.href 
                      ? "text-slate-900 bg-slate-100 shadow-sm" 
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <route.icon className={cn("h-5 w-5 mr-3 transition-colors", route.color)} />
                  {route.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}