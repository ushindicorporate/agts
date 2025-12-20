'use client'

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarContent } from "@/components/Layout/SidebarContent"; // Import du contenu
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function MobileNav() {
  const [isMounted, setIsMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Évite les erreurs d'hydratation
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fermer le menu quand on change de page
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (!isMounted) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white">
        <SidebarContent />
      </SheetContent>
    </Sheet>
  );
}