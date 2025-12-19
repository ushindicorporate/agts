import Link from "next/link";
import { Plus, Search, Filter, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getPropertiesAction } from "./actions/get-properties";
import { Badge } from "@/components/ui/badge";

// Ceci est un Composant Serveur (Server Component) par défaut dans Next.js App Router
// Il peut faire des appels async directement.
export default async function PropertiesPage() {
  
  // 1. Récupération des données depuis Odoo
  const { data: properties, success } = await getPropertiesAction();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Gestion Immobilière</h1>
        <Button asChild className="bg-slate-900">
          <Link href="/dashboard/properties/create">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle Offre
          </Link>
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Rechercher (Kinshasa, Ref...)" 
            className="pl-10" 
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filtres
          </Button>
          <Button variant="ghost" size="icon" title="Rafraîchir Odoo">
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tableau Shadcn */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px]"></TableHead>
              <TableHead className="w-[400px]">Bien</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Prix ($)</TableHead>
              <TableHead>Localisation</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!success || !properties || properties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {success ? "Aucun bien trouvé sur Odoo." : "Erreur de connexion Odoo."}
                </TableCell>
              </TableRow>
            ) : (
              properties.map((property: any) => (
                <TableRow key={property.id}>
                  <TableCell>
                    <div className="h-12 w-12 overflow-hidden rounded-md border bg-slate-100">
                      <img 
                        src={`${process.env.ODOO_URL}/web/image?model=product.template&id=${property.id}&field=image_128`}
                        alt="Bien"
                        className="h-full w-full object-cover"
                        // Si l'image charge pas, on cache
                        // onError={(e) => e.currentTarget.style.display = 'none'}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-slate-900">
                      {property.name || "Sans titre"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {property.x_property_type || "N/A"}
                    </Badge>
                    {property.x_transaction_type === 'rent' && (
                       <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200">Loc</Badge>
                    )}
                  </TableCell>
                  
                  <TableCell className="font-semibold text-slate-700">
                    {/* Formatage Dollars */}
                    {new Intl.NumberFormat('en-US', { 
                      style: 'currency', 
                      currency: 'USD',
                      maximumFractionDigits: 0 
                    }).format(property.list_price || 0)}
                  </TableCell>
                  
                  <TableCell>
                    {property.x_studio_city || "Kinshasa"}
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-blue-600">
                      Éditer
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}