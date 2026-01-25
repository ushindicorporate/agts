'use client'

import Link from 'next/link'
import { MoreHorizontal, Eye, Edit3, MapPin } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import PropertyImage from "./property-image"
import { Property } from "@/lib/types/property"

export function PropertyTable({ properties }: { properties: Property[] }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
          <TableRow className="hover:bg-transparent border-slate-200 dark:border-slate-800">
            <TableHead className="w-20 px-6">Image</TableHead>
            <TableHead className="px-4">Bien & Localisation</TableHead>
            <TableHead className="hidden md:table-cell">Statut</TableHead>
            <TableHead className="hidden sm:table-cell">Surface</TableHead>
            <TableHead className="text-right">Prix</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.map((p) => (
            <TableRow key={p.id} className="group border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <TableCell className="px-6 py-3">
                <div className="h-12 w-12 rounded-xl overflow-hidden relative border border-slate-100 dark:border-slate-800 shadow-sm">
                  <PropertyImage src={p.mainImage} alt={p.name} />
                </div>
              </TableCell>
              <TableCell className="px-4">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900 dark:text-white line-clamp-1 text-sm">{p.name}</span>
                  <div className="flex items-center text-[10px] text-slate-400 font-medium">
                    <MapPin className="h-3 w-3 mr-1" /> {p.city}
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge variant="outline" className="text-[10px] uppercase font-bold border-slate-200 dark:border-slate-700">
                  {p.status}
                </Badge>
              </TableCell>
              <TableCell className="hidden sm:table-cell text-xs font-bold text-slate-500">
                {p.surface} m²
              </TableCell>
              <TableCell className="text-right font-black text-slate-900 dark:text-white text-sm">
                {formatPrice(p.price, '')}
              </TableCell>
              <TableCell className="px-4 text-right">
                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-lg">
                    <Link href={`/dashboard/properties/${p.id}/edit`}><Edit3 className="h-4 w-4 text-slate-400" /></Link>
                  </Button>
                  <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-lg">
                    <Link href={`/dashboard/properties/${p.id}`}><Eye className="h-4 w-4 text-primary" /></Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}