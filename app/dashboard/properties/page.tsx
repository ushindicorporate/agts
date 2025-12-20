import Link from 'next/link';
import { Plus, Search, Home, Bed, Ruler, MapPin } from 'lucide-react';

// Actions & Composants
import { getProperties } from '@/lib/actions/property-actions'; // Vérifie ton chemin d'import
import PropertyFilters from '@/components/properties/PropertyFilters';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { formatPrice } from '@/lib/utils';

// --- HELPERS VISUELS ---

const getStatusBadge = (status: string) => {
  const base = 'text-xs font-medium px-2 py-1 rounded-full shadow-sm border';

  switch (status) {
    case 'available':
      return <span className={`${base} bg-green-100 text-green-700 border-green-200`}>Disponible</span>;
    case 'reserved':
      return <span className={`${base} bg-orange-100 text-orange-700 border-orange-200`}>Réservé</span>;
    case 'sold':
      return <span className={`${base} bg-red-100 text-red-700 border-red-200`}>Vendu</span>;
    case 'rented':
      return <span className={`${base} bg-blue-100 text-blue-700 border-blue-200`}>Loué</span>;
    default:
      return <span className={`${base} bg-muted text-muted-foreground border-border`}>{status}</span>;
  }
};

// --- PAGE COMPONENT ---

export default async function PropertiesListPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    page?: string; 
    search?: string;
    type?: string;
    minPrice?: string;
    maxPrice?: string;
    minSurface?: string;
  }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');

  // Construction de l'objet filtres pour l'Action Server
  const filters = {
    search: params.search || '',
    type: params.type,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    minSurface: params.minSurface ? Number(params.minSurface) : undefined,
  };

  // Appel Odoo
  const { properties, totalPages } = await getProperties(page, 9, filters);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* HEADER: TITRE & BOUTON AJOUT */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Portefeuille
          </h1>
          <p className="text-muted-foreground">
            Gérez vos mandats de vente et location synchronisés avec Odoo.
          </p>
        </div>

        <Link href="/dashboard/properties/create">
          <Button size="lg" className="shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Mandat
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* --- SIDEBAR FILTRES (1/4) --- */}
        <div className="lg:col-span-1 space-y-6">
            <PropertyFilters />
        </div>

        {/* --- CONTENU PRINCIPAL (3/4) --- */}
        <div className="lg:col-span-3 space-y-6">

            {/* SEARCH BAR */}
            <form className="relative w-full">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    name="search"
                    defaultValue={filters.search}
                    placeholder="Rechercher par titre, ville, référence..."
                    className="pl-9 h-10 bg-white"
                />
            </form>

            {/* LISTE DES BIENS */}
            {properties.length === 0 ? (
                // EMPTY STATE
                <div className="flex flex-col items-center justify-center py-20 border border-dashed rounded-xl bg-muted/30">
                    <div className="bg-background p-4 rounded-full mb-4 shadow-sm">
                        <Home className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Aucun résultat</h3>
                    <p className="text-sm text-muted-foreground text-center max-w-xs mt-1">
                        Essayez de modifier vos filtres ou ajoutez une nouvelle propriété.
                    </p>
                    {(filters.search || filters.type) && (
                        <Link href="/dashboard/properties" className="mt-4 text-sm text-primary hover:underline">
                            Réinitialiser la recherche
                        </Link>
                    )}
                </div>
            ) : (
                // GRID
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {properties.map((property) => (
                        <Card
                            key={property.id}
                            className="overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group bg-card border-border/60"
                        >
                            {/* LIEN GLOBALE SUR LA CARTE (Partie Supérieure) */}
                            <Link 
                                href={`/dashboard/properties/${property.id}`} 
                                className="flex flex-col flex-1 cursor-pointer"
                            >
                                {/* IMAGE */}
                                <div className="relative bg-muted">
                                    <AspectRatio ratio={4 / 3}>
                                        <img
                                            src={property.mainImage || '/placeholder-house.jpg'}
                                            alt={property.name}
                                            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    </AspectRatio>

                                    <div className="absolute top-3 left-3">
                                        {getStatusBadge(property.status)}
                                    </div>

                                    <div className="absolute bottom-3 right-3">
                                        <Badge variant="secondary" className="text-sm font-bold px-3 py-1 shadow-sm backdrop-blur-md bg-white/90 text-black">
                                            {formatPrice(property.price, property.offerType)}
                                        </Badge>
                                    </div>
                                </div>

                                {/* CONTENT */}
                                <CardHeader className="pb-2 pt-4 px-4">
                                    <div className="flex justify-between items-start">
                                        <p className="text-[10px] uppercase text-primary font-bold tracking-wider mb-1">
                                            {property.type}
                                        </p>
                                    </div>
                                    <h3 className="text-base font-bold truncate text-foreground group-hover:text-primary transition-colors" title={property.name}>
                                        {property.name}
                                    </h3>
                                </CardHeader>

                                <CardContent className="space-y-4 flex-1 px-4 pb-4">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <MapPin className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                                        <span className="truncate">{property.city}</span>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-muted-foreground border-t pt-3 mt-1">
                                        <div className="flex items-center gap-1.5" title="Surface">
                                            <Ruler className="h-4 w-4" />
                                            <span className="font-medium text-foreground">{property.surface || '-'}</span> m²
                                        </div>
                                        <div className="w-px h-3 bg-border"></div>
                                        <div className="flex items-center gap-1.5" title="Chambres">
                                            <Bed className="h-4 w-4" />
                                            <span className="font-medium text-foreground">{property.bedrooms || '-'}</span> ch.
                                        </div>
                                    </div>
                                </CardContent>
                            </Link>

                            {/* FOOTER (ACTION SEPARÉE) */}
                            <CardFooter className="border-t bg-muted/30 p-3">
                                <Link
                                    href={`/dashboard/properties/${property.id}/edit`}
                                    className="w-full"
                                >
                                    <Button variant="outline" size="sm" className="w-full bg-background hover:bg-accent text-xs h-8">
                                        Modifier / Photos
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {/* PAGINATION */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-3 pt-6">
                    {/* Liens de pagination simples pour le SEO, ou boutons interactifs */}
                    <div className="flex items-center gap-2">
                         {/* Pour faire propre, idéalement utiliser <Link> avec les params conservés */}
                         <Link href={{ query: { ...filters, page: page > 1 ? page - 1 : 1 } }} passHref>
                            <Button variant="outline" size="sm" disabled={page <= 1}>Précédent</Button>
                         </Link>
                         <span className="text-sm text-muted-foreground px-2">Page {page} / {totalPages}</span>
                         <Link href={{ query: { ...filters, page: page < totalPages ? page + 1 : totalPages } }} passHref>
                            <Button variant="outline" size="sm" disabled={page >= totalPages}>Suivant</Button>
                         </Link>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
}