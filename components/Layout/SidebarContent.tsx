'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  FileText, // Pour les offres plus tard
  Settings, 
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

const routes = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", color: "text-sky-500" },
  { 
    label: "Pipeline / Leads", // NOUVEAU MENU
    icon: TrendingUp, 
    href: "/dashboard/leads", 
    color: "text-emerald-500" 
  },
  { label: "Biens / Stock", icon: Building2, href: "/dashboard/properties", color: "text-violet-500" },
  { label: "Contacts CRM", icon: Users, href: "/dashboard/contacts", color: "text-pink-700" },
  { label: "Offres / Devis", icon: FileText, href: "/dashboard/offers", color: "text-orange-700" }, // Futur module
];

export function SidebarContent() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-white text-gray-900">
      <div className="px-3 py-2">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div className="relative h-8 w-8 mr-4">
             {/* Logo ou Icône */}
             <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                AG
             </div>
          </div>
          <h1 className="text-xl font-bold">AGTS</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition",
                pathname === route.href ? "text-indigo-600 bg-indigo-50" : "text-gray-500"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Bas de page Sidebar */}
      <div className="mt-auto px-3 py-2">
         <Link
            href="/dashboard/settings"
            className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-gray-900 hover:bg-gray-100 rounded-lg transition text-gray-500"
         >
            <Settings className="h-5 w-5 mr-3" />
            Paramètres
         </Link>
      </div>
    </div>
  );
}