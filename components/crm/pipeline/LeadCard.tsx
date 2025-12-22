'use client'

import Link from 'next/link';
import { useDraggable } from '@dnd-kit/core';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CRMLead } from '@/lib/types/crm';
import { formatCurrency } from '@/lib/utils';
import LeadCardActions from './LeadCardActions'; // Import du nouveau composant

export function LeadCard({ lead, onClick }: { lead: CRMLead, onClick: () => void }) {
  // Hook dnd-kit pour rendre l'élément draggable
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead.id.toString(),
    data: { ...lead }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 999 : undefined,
    opacity: isDragging ? 0.8 : 1,
  } : undefined;

  return (
    <div 
        ref={setNodeRef} 
        style={style} 
        {...listeners} 
        {...attributes} 
        className="mb-3 cursor-grab active:cursor-grabbing group"
    >
      <Card className="shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-indigo-500 bg-white">
        <CardContent className="p-3 space-y-2">
          
          {/* HEADER: Titre + Actions */}
          <div className="flex justify-between items-start gap-2">
            {/* Titre cliquable (Link) - onPointerDown stopPropagation permet d'éviter de draguer quand on veut cliquer */}
            <Link 
                href={`/dashboard/leads/${lead.id}`} 
                className="flex-1 min-w-0"
                onPointerDown={(e) => e.stopPropagation()}
            >
                <h4 className="font-semibold text-sm line-clamp-2 text-gray-800 hover:text-indigo-600 transition-colors">
                    {lead.name}
                </h4>
            </Link>

            {/* Menu d'actions rapides */}
            <div className="flex items-start gap-1 shrink-0">
                {lead.priority === '3' && <Badge variant="destructive" className="text-[10px] px-1 h-5">Hot</Badge>}
                
                {/* Le menu est caché par défaut et s'affiche au survol de la carte (group-hover) sur Desktop */}
                <div className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <LeadCardActions lead={lead} />
                </div>
            </div>
          </div>

          {/* CONTACT INFO */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
             <Avatar className="h-5 w-5">
                <AvatarFallback className="text-[9px] bg-blue-100 text-blue-700 font-bold">
                    {lead.partnerName?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
             </Avatar>
             <span className="truncate max-w-[140px]" title={lead.partnerName}>
                {lead.partnerName}
             </span>
          </div>

          {/* FOOTER: Prix + Date */}
          <div className="flex justify-between items-center pt-2 border-t mt-1">
             <span className="font-bold text-sm text-gray-900">
                {formatCurrency(lead.expectedRevenue)}
             </span>
             <span className="text-[10px] text-gray-400 font-medium">
                {new Date(lead.createDate).toLocaleDateString('fr-FR', {day: '2-digit', month: 'short'})}
             </span>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}