'use client'

import Link from 'next/link'
import { 
  MapPin, 
  Bed, 
  Ruler, 
  Users, 
  ArrowUpRight, 
  Edit3, 
  Bath, 
  User as UserIcon,
  ChevronRight
} from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatPrice } from '@/lib/utils'
import PropertyImage from '@/components/properties/property-image'
import { Property } from '@/lib/types/property'
import { cn } from '@/lib/utils'

interface PropertyCardProps {
  property: Property;
}

const getStatusConfig = (status: string) => {
  const configs: Record<string, { label: string, color: string, ring: string }> = {
    available: { label: 'Disponible', color: 'bg-emerald-500', ring: 'ring-emerald-500/20' },
    "À vendre": { label: 'À vendre', color: 'bg-emerald-600', ring: 'ring-emerald-600/20' },
    "À louer": { label: 'À louer', color: 'bg-indigo-600', ring: 'ring-indigo-600/20' },
    reserved: { label: 'Réservé', color: 'bg-amber-500', ring: 'ring-amber-500/20' },
    sold: { label: 'Vendu', color: 'bg-rose-600', ring: 'ring-rose-600/20' },
    rented: { label: 'Loué', color: 'bg-slate-600', ring: 'ring-slate-600/20' },
  }
  return configs[status] || { label: status, color: 'bg-slate-500', ring: 'ring-slate-500/20' }
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const status = getStatusConfig(property.status)
  const isRental = property.offerType === 'À louer' || property.offerType === 'Loué'

  return (
    <Card className="group overflow-hidden bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300">
      
      {/* --- SECTION IMAGE --- */}
      <div className="relative aspect-16/10 overflow-hidden">
        <Link href={`/dashboard/properties/${property.id}`}>
          <PropertyImage src={property.mainImage} alt={property.name} />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>
        
        {/* Badges Supérieurs */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className={cn("text-[10px] font-bold px-2 py-0.5 border-none text-white ring-4", status.color, status.ring)}>
            {status.label}
          </Badge>
        </div>

        {property.activeLeads! > 0 && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm text-slate-900 dark:text-white border-none gap-1 text-[10px] font-black px-2 py-1 shadow-sm">
              <Users className="h-3 w-3 text-primary" />
              {property.activeLeads} LEADS
            </Badge>
          </div>
        )}

        {/* Prix flottant sur l'image */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
            <span className="text-white font-black text-sm tracking-tight">
              {formatPrice(property.price, isRental ? '/mois' : '')}
            </span>
          </div>
        </div>
      </div>

      {/* --- CONTENU --- */}
      <CardContent className="p-4 space-y-4">
        
        {/* Titre et Type */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">
              {property.type}
            </span>
            <span className="text-[10px] font-bold text-slate-400">REF: #{property.id}</span>
          </div>
          <Link href={`/dashboard/properties/${property.id}`}>
            <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 hover:text-primary transition-colors leading-tight">
              {property.name}
            </h3>
          </Link>
          <div className="flex items-center text-xs text-slate-500 font-medium">
            <MapPin className="h-3 w-3 mr-1 text-slate-400" />
            {property.city}
          </div>
        </div>

        {/* Propriétaire (Nouveau) */}
        {property.ownerId && (
          <div className="pt-1">
            <Link 
              href={`/dashboard/contacts/${property.ownerId}`}
              className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-colors group/owner"
            >
              <Avatar className="h-6 w-6 border-none">
                <AvatarFallback className="text-[8px] bg-primary/10 text-primary font-bold">
                  {property.ownerName?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] text-slate-400 font-bold uppercase leading-none mb-0.5">Propriétaire</p>
                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">{property.ownerName}</p>
              </div>
              <ChevronRight className="h-3 w-3 text-slate-300 group-hover/owner:text-primary transition-colors" />
            </Link>
          </div>
        )}

        {/* Caractéristiques techniques */}
        <div className="flex items-center justify-between py-3 border-y border-slate-100 dark:border-slate-800">
          <div className="flex flex-col items-center flex-1 border-r border-slate-100 dark:border-slate-800">
            <span className="text-xs font-black text-slate-900 dark:text-slate-200">{property.surface || '-'}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">m² Surface</span>
          </div>
          <div className="flex flex-col items-center flex-1 border-r border-slate-100 dark:border-slate-800">
            <span className="text-xs font-black text-slate-900 dark:text-slate-200">{property.bedrooms || '-'}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Chambres</span>
          </div>
          <div className="flex flex-col items-center flex-1">
            <span className="text-xs font-black text-slate-900 dark:text-slate-200">{(property as any).bathrooms || '-'}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">SDB</span>
          </div>
        </div>
      </CardContent>

      {/* --- ACTIONS --- */}
      <CardFooter className="px-4 pb-4 pt-0 flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          asChild 
          className="flex-1 rounded-xl h-9 text-[11px] font-bold bg-white dark:bg-slate-900 dark:border-slate-800"
        >
          <Link href={`/dashboard/properties/${property.id}/edit`}>
            <Edit3 className="h-3.5 w-3.5 mr-2 text-slate-400" />
            Éditer
          </Link>
        </Button>
        <Button 
          variant="secondary" 
          size="sm" 
          asChild 
          className="flex-1 rounded-xl h-9 text-[11px] font-bold"
        >
          <Link href={`/dashboard/properties/${property.id}`}>
            <ArrowUpRight className="h-3.5 w-3.5 mr-1.5" />
            Fiche
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}