'use client'

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Calendar, Phone, Users, FileText, Home } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { markTaskDone } from '@/lib/actions/task-actions';
import { Task } from '@/lib/types/task';

// Helper pour l'icone
const getIcon = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes('call') || t.includes('appel')) return <Phone className="h-4 w-4" />;
  if (t.includes('meet') || t.includes('rdv') || t.includes('visit')) return <Users className="h-4 w-4" />;
  if (t.includes('email')) return <FileText className="h-4 w-4" />;
  return <Calendar className="h-4 w-4" />;
};

// Helper pour le lien
const getLink = (task: Task) => {
    if (task.resModel === 'res.partner') return `/dashboard/contacts/${task.resId}`;
    if (task.resModel === 'crm.lead') return `/dashboard/leads`; // Idéalement ouvrir le lead
    if (task.resModel === 'product.template') return `/dashboard/properties/${task.resId}`;
    return '#';
}

export default function TaskCard({ task }: { task: Task }) {
  const [loading, setLoading] = useState(false);

  const handleDone = async () => {
    setLoading(true);
    const res = await markTaskDone(task.id);
    if (res.success) {
      toast.success("Tâche terminée !");
    } else {
      toast.error("Erreur");
      setLoading(false);
    }
  };

  const isOverdue = task.state === 'overdue';
  const isToday = task.state === 'today';

  return (
    <Card className={cn(
        "mb-3 transition-all hover:shadow-md border-l-4",
        isOverdue ? "border-l-red-500 bg-red-50/10" : 
        isToday ? "border-l-orange-400 bg-orange-50/10" : "border-l-green-500"
    )}>
      <CardContent className="p-4 flex items-start gap-3">
        {/* Checkbox Action */}
        <Button 
            variant="ghost" 
            size="icon" 
            className={cn("mt-1 shrink-0", isOverdue ? "text-red-500 hover:text-red-700" : "text-gray-400 hover:text-green-600")}
            onClick={handleDone}
            disabled={loading}
        >
            <CheckCircle2 className={cn("h-6 w-6", loading && "animate-pulse")} />
        </Button>

        <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
                <h4 className={cn("font-semibold text-sm truncate", isOverdue && "text-red-700")}>
                    {task.summary}
                </h4>
                <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full font-medium shrink-0",
                    isOverdue ? "bg-red-100 text-red-700" :
                    isToday ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"
                )}>
                    {new Date(task.dateDeadline).toLocaleDateString('fr-FR')}
                </span>
            </div>
            
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                {getIcon(task.type)}
                {task.type} • 
                <Link href={getLink(task)} className="hover:underline hover:text-primary flex items-center gap-1 ml-1">
                    {task.resModel === 'product.template' && <Home className="h-3 w-3" />}
                    {task.resName}
                </Link>
            </p>
        </div>
      </CardContent>
    </Card>
  );
}