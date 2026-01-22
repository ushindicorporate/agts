'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export function Breadcrumbs() {
  const pathname = usePathname();
  const paths = pathname.split('/').filter(p => p);

  return (
    <nav className="flex items-center space-x-2 text-sm text-slate-500">
      <Link href="/dashboard" className="hover:text-slate-900 transition">
        <Home className="h-4 w-4" />
      </Link>
      {paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join('/')}`;
        const isLast = index === paths.length - 1;
        const label = path.charAt(0).toUpperCase() + path.slice(1);

        return (
          <div key={path} className="flex items-center space-x-2">
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <Link 
              href={href} 
              className={cn(
                "hover:text-slate-900 transition capitalize",
                isLast ? "font-semibold text-slate-900 pointer-events-none" : ""
              )}
            >
              {label === "Dashboard" ? "Accueil" : label}
            </Link>
          </div>
        );
      })}
    </nav>
  );
}