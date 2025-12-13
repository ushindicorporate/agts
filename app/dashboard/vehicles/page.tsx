import Link from "next/link";
import { Plus, CarFront, Gauge, Cog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getVehiclesAction } from "./actions/vehicle-actions";

export default async function VehiclesPage() {
  const { data: vehicles, success } = await getVehiclesAction();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Parc Automobile</h1>
        <Button asChild className="bg-slate-900">
          <Link href="/dashboard/vehicles/create">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter Véhicule
          </Link>
        </Button>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Image</TableHead>
              <TableHead>Véhicule</TableHead>
              <TableHead>Infos</TableHead>
              <TableHead>Prix ($)</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!success || !vehicles || vehicles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  Aucun véhicule dans le parc.
                </TableCell>
              </TableRow>
            ) : (
              vehicles.map((v: any) => (
                <TableRow key={v.id}>
                  <TableCell>
                     {/* Image Odoo */}
                     <div className="h-10 w-16 overflow-hidden rounded bg-slate-100">
                        <img 
                           src={`${process.env.ODOO_URL}/web/image?model=x_agts_vehicle&id=${v.id}&field=x_image`}
                           className="h-full w-full object-cover"
                           alt="Auto"
                           onError={(e) => e.currentTarget.style.display='none'}
                        />
                     </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{v.x_brand} {v.x_model}</div>
                    <div className="text-xs text-muted-foreground">Année {v.x_year}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 text-xs text-slate-600">
                        <span className="flex items-center gap-1"><Gauge className="h-3 w-3"/> {v.x_mileage || 0} km</span>
                        <span className="flex items-center gap-1"><Cog className="h-3 w-3"/> {v.x_transmission}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v.x_price || 0)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={v.x_status === 'available' ? 'default' : 'secondary'}>
                      {v.x_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Éditer</Button>
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