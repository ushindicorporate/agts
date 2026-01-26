'use client'

import { useDraggable } from '@dnd-kit/core';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CRMLead } from '@/lib/types/crm';
import { formatCurrency } from '@/lib/utils';
import { Flame, Phone, MessageSquare, MoreVertical, TrendingUp } from 'lucide-react';
import LeadCardActions from './LeadCardActions';
import { cn } from '@/lib/utils';

export function LeadCard({ lead, onClick }: { lead: CRMLead, onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead.id.toString(),
    data: { ...lead }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 999 : undefined,
  } : undefined;

  // Priorité visuelle
  const isHot = lead.priority === '3' || lead.probability! > 80;

  return (
    <div 
        ref={setNodeRef} 
        style={style} 
        {...listeners} 
        {...attributes} 
        onClick={onClick}
        className={cn(
            "mb-3 cursor-grab active:cursor-grabbing transition-all",
            isDragging ? "opacity-50 scale-95" : "opacity-100"
        )}
    >
      <Card className={cn(
        "relative overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-slate-900 rounded-2xl",
        isHot ? "ring-1 ring-orange-500/30" : "border border-slate-100 dark:border-slate-800"
      )}>
        {/* Barre latérale de probabilité */}
        <div 
            className="absolute left-0 top-0 bottom-0 w-1.5 bg-slate-200 dark:bg-slate-800" 
            title={`Probabilité: ${lead.probability}%`}
        >
            <div 
                className={cn("absolute bottom-0 left-0 w-full transition-all", 
                    lead.probability! > 70 ? "bg-emerald-500" : 
                    lead.probability! > 30 ? "bg-indigo-500" : "bg-slate-400"
                )}
                style={{ height: `${lead.probability}%` }}
            />
        </div>

        <CardContent className="p-4 pl-5 space-y-3">
          
          {/* HEADER */}
          <div className="flex justify-between items-start gap-2">
            <h4 className="font-bold text-sm leading-tight text-slate-900 dark:text-slate-100 line-clamp-2">
                {lead.name}
            </h4>
            <LeadCardActions lead={lead} />
          </div>

          {/* CLIENT & CONTACT INFO */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6 border border-slate-100 dark:border-slate-800">
                    <AvatarFallback className="text-[8px] bg-indigo-50 text-indigo-700 font-black uppercase">
                        {lead.partnerName?.substring(0, 2)}
                    </AvatarFallback>
                </Avatar>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                    {lead.partnerName}
                </span>
            </div>
            
            {/* Badges contextuels */}
            <div className="flex gap-1">
                {isHot && (
                    <div className="p-1 bg-orange-100 dark:bg-orange-500/20 rounded-md">
                        <Flame className="h-3 w-3 text-orange-600 animate-pulse" />
                    </div>
                )}
                {lead.phone && (
                    <div className="p-1 bg-emerald-100 dark:bg-emerald-500/20 rounded-md">
                        <MessageSquare className="h-3 w-3 text-emerald-600" />
                    </div>
                )}
            </div>
          </div>

          {/* FOOTER: MONTANT & STATS */}
          <div className="flex justify-between items-center pt-3 border-t border-slate-50 dark:border-slate-800/50 mt-1">
             <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">Budget Est.</span>
                <span className="font-black text-sm text-slate-900 dark:text-white leading-none">
                    {formatCurrency(lead.expectedRevenue)}
                </span>
             </div>
             
             <div className="text-right">
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <TrendingUp className="h-3 w-3" />
                    <span className="text-xs font-black">{lead.probability}%</span>
                </div>
                <span className="text-[9px] font-bold text-slate-400">Probabilité</span>
             </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}