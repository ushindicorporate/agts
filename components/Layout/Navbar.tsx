// components/layout/Navbar.tsx
import Link from "next/link";
import { User } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-black"></div>
          <span className="text-xl font-bold tracking-tight text-gray-900">
            AGTS Immo & Auto
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          <Link href="/properties" className="hover:text-black transition-colors">
            Immobilier
          </Link>
          <Link href="/vehicles" className="hover:text-black transition-colors">
            Véhicules
          </Link>
          <Link href="/services" className="hover:text-black transition-colors">
            Services
          </Link>
          <Link href="/contact" className="hover:text-black transition-colors">
            Contact
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link 
            href="/auth/login" 
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black"
          >
            <User className="h-4 w-4" />
            Connexion
          </Link>
          <Link
            href="/contact"
            className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-105"
          >
            Déposer une annonce
          </Link>
        </div>
      </div>
    </header>
  );
}