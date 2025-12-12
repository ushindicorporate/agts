"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // Assurez-vous d'avoir cette fonction utilitaire de shadcn ou clsx
import { 
  LayoutDashboard, 
  Building2, 
  CarFront, 
  Users, 
  CalendarDays, 
  FileText, 
  Settings, 
  LogOut 
} from "lucide-react";

const menuItems = [
  { href: "/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/dashboard/leads", label: "CRM & Leads", icon: Users },
  { href: "/dashboard/properties", label: "Immobilier", icon: Building2 },
  { href: "/dashboard/vehicles", label: "Automobile", icon: CarFront },
  { href: "/dashboard/calendar", label: "Agenda", icon: CalendarDays },
  { href: "/dashboard/documents", label: "Contrats & Factures", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-slate-950 text-white">
      {/* Logo Agence */}
      <div className="flex h-16 items-center border-b border-slate-800 px-6">
        <span className="text-xl font-bold tracking-wider">AGTS <span className="text-blue-400">Admin</span></span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 py-6 px-3">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-blue-600 text-white" 
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer Sidebar (Paramètres / Logout) */}
      <div className="border-t border-slate-800 p-3">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-900 hover:text-white"
        >
          <Settings className="h-5 w-5" />
          Paramètres
        </Link>
        <button className="mt-1 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-400 hover:bg-slate-900">
          <LogOut className="h-5 w-5" />
          Déconnexion
        </button>
      </div>
    </div>
  );
}