'use client'

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  CheckCircle2, Calendar, Phone, Users, 
  FileText, Home, Target, ArrowRight, Loader2 
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { markTaskDone } from '@/lib/actions/task-actions';
import { Task } from '@/lib/types/task';

const getIcon = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes('call') || t.includes('appel')) return <Phone className="h-3 w-3 text-blue-500" />;
  if (t.includes('meet') || t.includes('rdv') || t.includes('visit') || t.includes('visite')) 
    return <Users className="h-3 w-3 text-purple-500" />;
  if (t.includes('email') || t.includes('courriel')) return <FileText className="h-3 w-3 text-slate-500" />;
  return <Calendar className="h-3 w-3 text-primary" />;
};

const getModelBadge = (model: string) => {
    switch(model) {
        case 'res.partner': return { label: 'Contact', icon: Users, color: 'text-indigo-600 bg-indigo-50' };
        case 'crm.lead': return { label: 'Opportunité', icon: Target, color: 'text-emerald-600 bg-emerald-50' };
        case 'product.template': return { label: 'Bien Immo', icon: Home, color: 'text-violet-600 bg-violet-50' };
        default: return { label: 'Dossier', icon: FileText, color: 'text-slate-600 bg-slate-50' };
    }
}

export default function TaskCard({ task }: { task: Task }) {
  const [loading, setLoading] = useState(false);
  const badge = getModelBadge(task.resModel);

  const handleDone = async () => {
    setLoading(true);
    const res = await markTaskDone(task.id);
    if (res.success) {
      toast.success("Tâche clôturée");
    } else {
      toast.error("Erreur système");
      setLoading(false);
    }
  };

  const isOverdue = task.state === 'overdue';

  return (
    <Card className={cn(
        "group relative overflow-hidden transition-all duration-300 border-none shadow-sm hover:shadow-md rounded-2xl bg-white dark:bg-slate-900",
        isOverdue ? "ring-1 ring-rose-500/20" : "border border-slate-100 dark:border-slate-800"
    )}>
      <CardContent className="p-4 flex items-start gap-4">
        
        {/* Check Action (Checkbox style pro) */}
        <button 
            onClick={handleDone}
            disabled={loading}
            className={cn(
                "mt-1 shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all",
                loading ? "border-slate-200 animate-spin" : 
                isOverdue ? "border-rose-200 hover:border-rose-500 text-transparent hover:text-rose-500" : 
                "border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-transparent hover:text-emerald-500"
            )}
        >
            {loading ? <Loader2 className="h-3 w-3" /> : <CheckCircle2 className="h-4 w-4" />}
        </button>

        <div className="flex-1 min-w-0 space-y-2">
            <div className="flex justify-between items-start gap-2">
                <h4 className={cn(
                    "font-bold text-sm leading-tight line-clamp-2",
                    isOverdue ? "text-rose-900 dark:text-rose-200" : "text-slate-900 dark:text-slate-100"
                )}>
                    {task.summary}
                </h4>
            </div>
            
            {/* Context & Metadata */}
            <div className="flex flex-wrap items-center gap-2">
                <div className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter", badge.color)}>
                    <badge.icon className="h-2.5 w-2.5" />
                    {badge.label}
                </div>
                
                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                    {getIcon(task.type)}
                    {task.type}
                </span>
            </div>

            {/* Target Object Link */}
            <Link 
                href={task.resModel === 'res.partner' ? `/dashboard/contacts/${task.resId}` : 
                      task.resModel === 'crm.lead' ? `/dashboard/leads/${task.resId}` : 
                      task.resModel === 'product.template' ? `/dashboard/properties/${task.resId}` : '#'}
                className="flex items-center justify-between group/link p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
            >
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 truncate max-w-[150px]">
                    {task.resName}
                </span>
                <ArrowRight className="h-3 w-3 text-slate-300 group-hover/link:text-primary group-hover/link:translate-x-1 transition-all" />
            </Link>
        </div>
      </CardContent>

      {/* Date floating badge */}
      <div className={cn(
        "absolute top-0 right-0 px-2 py-1 text-[9px] font-black uppercase rounded-bl-xl",
        isOverdue ? "bg-rose-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
      )}>
        {new Date(task.dateDeadline).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
      </div>
    </Card>
  );
}