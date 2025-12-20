import TaskCard from '@/components/tasks/TaskCard';
import { CheckCircle2, AlertCircle, Clock, CalendarCheck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getMyTasks } from '@/lib/actions/task-actions';

export default async function TasksPage() {
  const tasks = await getMyTasks();

  const overdue = tasks.filter(t => t.state === 'overdue');
  const today = tasks.filter(t => t.state === 'today');
  const upcoming = tasks.filter(t => t.state === 'planned');

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
      
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Mes Tâches</h1>
            <p className="text-muted-foreground">Rappels, Visites et échéances administratives.</p>
        </div>
        {/* On pourrait ajouter un bouton de création global ici, mais c'est mieux contextuel */}
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        
        {/* COLONNE 1: EN RETARD */}
        <div className="space-y-4">
            <h3 className="font-bold text-red-600 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" /> En Retard ({overdue.length})
            </h3>
            {overdue.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">Aucun retard. Bravo !</p>
            ) : (
                overdue.map(t => <TaskCard key={t.id} task={t} />)
            )}
        </div>

        {/* COLONNE 2: AUJOURD'HUI */}
        <div className="space-y-4">
            <h3 className="font-bold text-orange-600 flex items-center gap-2">
                <Clock className="h-5 w-5" /> Aujourd'hui ({today.length})
            </h3>
            {today.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">Rien de prévu aujourd'hui.</p>
            ) : (
                today.map(t => <TaskCard key={t.id} task={t} />)
            )}
        </div>

        {/* COLONNE 3: À VENIR */}
        <div className="space-y-4">
            <h3 className="font-bold text-green-600 flex items-center gap-2">
                <CalendarCheck className="h-5 w-5" /> À Venir ({upcoming.length})
            </h3>
            {upcoming.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">Calendrier vide.</p>
            ) : (
                upcoming.map(t => <TaskCard key={t.id} task={t} />)
            )}
        </div>

      </div>
    </div>
  );
}