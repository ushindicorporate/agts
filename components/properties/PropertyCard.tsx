'use client'

import Link from 'next/link'
import { 
  MapPin, 
  Bed, 
  Ruler, 
  Users, 
  ArrowUpRight, 
  Info,
  Edit3
} from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import PropertyImage from '@/components/properties/property-image'
import { Property } from '@/lib/types/property'
import { cn } from '@/lib/utils'

interface PropertyCardProps {
  property: Property;
}

// --- HELPER DE STATUT ---
const getStatusConfig = (status: string) => {
  const configs: Record<string, { label: string, color: string }> = {
    available: { label: 'Disponible', color: 'bg-emerald-500' },
    "À vendre": { label: 'À vendre', color: 'bg-emerald-500' },
    "À louer": { label: 'À louer', color: 'bg-blue-500' },
    reserved: { label: 'Réservé', color: 'bg-amber-500' },
    Réservé: { label: 'Réservé', color: 'bg-amber-500' },
    sold: { label: 'Vendu', color: 'bg-rose-500' },
    Vendu: { label: 'Vendu', color: 'bg-rose-500' },
    rented: { label: 'Loué', color: 'bg-slate-500' },
    Loué: { label: 'Loué', color: 'bg-slate-500' },
  }
  return configs[status] || { label: status, color: 'bg-slate-400' }
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const status = getStatusConfig(property.status)
  
  // Vérifier si c'est une location pour l'affichage du prix
  const isRental = property.offerType === 'À louer'|| property.offerType === 'rent'

  return (
    <Card className="group overflow-hidden flex flex-col transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-[2.5rem]">
      
      {/* --- SECTION IMAGE --- */}
      <Link href={`/dashboard/properties/${property.id}`} className="relative aspect-4/3 overflow-hidden">
        <PropertyImage 
          src={property.mainImage} 
          alt={property.name} 
        />
        
        {/* Badge Statut Flottant */}
        <div className="absolute top-4 left-4 z-10">
          <Badge className={cn("text-[10px] uppercase font-black px-3 py-1 border-none text-white shadow-lg", status.color)}>
            {status.label}
          </Badge>
        </div>

        {/* Badge Leads (Activité CRM) */}
        {property.activeLeads! > 0 && (
          <div className="absolute top-4 right-4 z-10">
            <Badge className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white border-none gap-1.5 text-[10px] font-bold px-3 py-1 shadow-sm">
              <Users className="h-3 w-3 text-primary" />
              {property.activeLeads} Opportunités
            </Badge>
          </div>
        )}

        {/* Overlay Prix Bas de l'image */}
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 rounded-2xl flex justify-between items-center shadow-xl border border-white/20 dark:border-slate-800/50">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter leading-none mb-1">Prix Demandé</span>
              <span className="text-lg font-black text-slate-900 dark:text-white leading-none">
                {formatPrice(property.price, isRental ? '/mois' : '')}
              </span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
              <ArrowUpRight className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
            </div>
          </div>
        </div>
      </Link>

      {/* --- CONTENU --- */}
      <CardHeader className="p-5 pb-2">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="text-[9px] uppercase tracking-widest border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
            {property.type}
          </Badge>
          <span className="text-[10px] text-slate-300 dark:text-slate-600 font-bold">ID: #{property.id}</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors tracking-tight">
          {property.name}
        </h3>
        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 font-medium pt-1">
          <MapPin className="h-4 w-4 mr-1.5 text-primary shrink-0" />
          <span className="truncate">{property.city}, Kinshasa</span>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-5">
        <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <Ruler className="h-4 w-4 text-slate-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-slate-900 dark:text-slate-200 leading-none">{property.surface || '-'}</span>
              <span className="text-[9px] uppercase font-bold text-slate-400">Surface m²</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <Bed className="h-4 w-4 text-slate-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-slate-900 dark:text-slate-200 leading-none">{property.bedrooms || '-'}</span>
              <span className="text-[9px] uppercase font-bold text-slate-400">Chambres</span>
            </div>
          </div>
        </div>
      </CardContent>

      {/* --- ACTIONS --- */}
      <CardFooter className="p-4 bg-slate-50/50 dark:bg-slate-800/30 flex gap-2 border-t border-slate-100 dark:border-slate-800 mt-auto">
        <Button 
          variant="outline" 
          size="sm" 
          asChild 
          className="flex-1 rounded-xl h-10 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-bold text-xs"
        >
          <Link href={`/dashboard/properties/${property.id}/edit`}>
            <Edit3 className="h-3.5 w-3.5 mr-2" />
            Modifier
          </Link>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          asChild 
          className="rounded-xl h-10 px-4 font-bold text-xs hover:bg-white dark:hover:bg-slate-900"
        >
          <Link href={`/dashboard/properties/${property.id}`}>
            <Info className="h-3.5 w-3.5 mr-2" />
            Détails
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}