import { Suspense } from "react";
import Link from "next/link";
import { 
  Plus, 
  Home, 
  LayoutGrid, 
  Building2, 
  Zap,
  LayoutList
} from "lucide-react";

// Actions & Utils
import { getProperties, getOwnersForFilter } from "@/lib/actions/property-actions";

// UI Components (Shadcn)
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Composants du module Immobilier
import PropertyFilters from "@/components/properties/PropertyFilters";
import PropertySearch from "@/components/properties/PropertySearch";
import { PropertySkeleton } from "@/components/properties/PropertySkeleton";
import PropertyCard from "@/components/properties/PropertyCard";

// --- INTERFACE DES PARAMS ---
interface SearchParams {
  page?: string;
  search?: string;
  type?: string;
  minPrice?: string;
  maxPrice?: string;
  city?: string;
  statuses?: string;
  ownerIds?: string;
}

export default async function PropertiesListPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // 1. Extraction des paramètres (Next.js 15+ nécessite await sur searchParams)
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1");
  const searchQuery = params.search || "";

  // 2. Préchargement des propriétaires pour les filtres (Server Side)
  const owners = await getOwnersForFilter();

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-8 min-h-screen">
      
      {/* --- SECTION HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 bg-primary/10 rounded-lg">
                <Building2 className="h-5 w-5 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Portefeuille Immo
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Gestion des mandats de vente et location AGTS Sarlu.
          </p>
        </div>

        <Link href="/dashboard/properties/create">
          <Button size="lg" className="rounded-2xl shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 text-white px-8 h-14 font-bold transition-all active:scale-95">
            <Plus className="h-5 w-5 mr-2 stroke-[3px]" />
            Nouveau Mandat
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* --- COLONNE FILTRES (SIDEBAR) --- */}
        <aside className="lg:col-span-1 lg:sticky lg:top-8 space-y-4">
            <PropertyFilters owners={owners} />
            
            {/* Petit widget d'aide pro */}
            <Card className="p-4 bg-slate-50 dark:bg-slate-900/50 border-none rounded-2xl hidden lg:block">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-widest">Aide</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Utilisez le multi-sélection pour croiser les statuts (ex: À louer + Réservé).
                </p>
            </Card>
        </aside>

        {/* --- ZONE PRINCIPALE --- */}
        <div className="lg:col-span-3 space-y-6">

            {/* BARRE DE RECHERCHE & VUE */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="w-full">
                    <PropertySearch defaultValue={searchQuery} />
                </div>
                <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-white dark:bg-slate-700 shadow-sm">
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400">
                        <LayoutList className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* GRILLE DE RÉSULTATS AVEC CHARGEMENT PROGRESSIF (SUSPENSE) */}
            {/* La clé force le Suspense à se réactiver quand l'URL change (recherche/page) */}
            <Suspense 
              key={JSON.stringify(params)} 
              fallback={<PropertySkeleton />}
            >
                <PropertiesGridData searchParams={params} />
            </Suspense>

        </div>
      </div>
    </div>
  );
}

// --- COMPOSANT ASYNCHRONE DE DONNÉES ---
async function PropertiesGridData({ searchParams }: { searchParams: SearchParams }) {
  const page = parseInt(searchParams.page || "1");
  
  // Mapping des filtres pour l'action Odoo
  const filters = {
    search: searchParams.search || '',
    type: searchParams.type,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    city: searchParams.city,
    statuses: searchParams.statuses ? searchParams.statuses.split(',') : undefined,
    ownerIds: searchParams.ownerIds ? searchParams.ownerIds.split(',').map(Number) : undefined,
  };

  const { properties, totalPages, totalCount } = await getProperties(page, 9, filters);

  if (properties.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed rounded-[40px] bg-slate-50/50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm mb-4">
                <Home className="h-12 w-12 text-slate-200 dark:text-slate-700" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Aucun mandat trouvé</h3>
            <p className="text-sm text-slate-500 text-center max-w-xs mt-2 px-6">
                Aucun bien ne correspond à vos critères actuels. Essayez d'élargir votre recherche ou vos filtres.
            </p>
            <Link href="/dashboard/properties">
                <Button variant="link" className="mt-4 text-primary font-black uppercase text-xs tracking-widest">
                    Réinitialiser les filtres
                </Button>
            </Link>
        </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* GRILLE */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6 pb-20">
          <Link href={{ query: { ...searchParams, page: Math.max(1, page - 1) } }}>
            <Button variant="outline" size="sm" disabled={page <= 1} className="rounded-xl h-10 px-4 font-bold border-slate-200 dark:border-slate-800">
              Précédent
            </Button>
          </Link>
          
          <div className="flex items-center px-5 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-black shadow-sm">
            <span className="text-primary">{page}</span>
            <span className="mx-2 text-slate-300">/</span>
            <span className="text-slate-600 dark:text-slate-400">{totalPages}</span>
          </div>

          <Link href={{ query: { ...searchParams, page: Math.min(totalPages, page + 1) } }}>
            <Button variant="outline" size="sm" disabled={page >= totalPages} className="rounded-xl h-10 px-4 font-bold border-slate-200 dark:border-slate-800">
              Suivant
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}