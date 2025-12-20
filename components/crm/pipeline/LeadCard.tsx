'use client'

import { useDraggable } from '@dnd-kit/core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns'; // ou JS natif
import { GripVertical } from 'lucide-react';
import { CRMLead } from '@/lib/types/crm';
import { formatCurrency } from '@/lib/utils';

export function LeadCard({ lead }: { lead: CRMLead }) {
  // Hook dnd-kit pour rendre l'élément draggable
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead.id.toString(),
    data: { ...lead } // On passe les données pour les récupérer au drop
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 999 : undefined,
    opacity: isDragging ? 0.8 : 1,
  } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="mb-3 cursor-grab active:cursor-grabbing">
      <Card className="shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-indigo-500">
        <CardContent className="p-3 space-y-2">
          
          <div className="flex justify-between items-start gap-2">
            <h4 className="font-semibold text-sm line-clamp-2 text-gray-800">{lead.name}</h4>
            {lead.priority === '3' && <Badge variant="destructive" className="text-[10px] px-1 h-5">Hot</Badge>}
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
             <Avatar className="h-5 w-5">
                <AvatarFallback className="text-[9px] bg-blue-100 text-blue-700">
                    {lead.partnerName?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
             </Avatar>
             <span className="truncate max-w-[120px]">{lead.partnerName}</span>
          </div>

          <div className="flex justify-between items-center pt-1 border-t mt-2">
             <span className="font-bold text-sm text-gray-900">{formatCurrency(lead.expectedRevenue)}</span>
             <span className="text-[10px] text-gray-400">
                {new Date(lead.createDate).toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit'})}
             </span>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}