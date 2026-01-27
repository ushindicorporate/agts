import { Suspense } from 'react';
import TaskCard from '@/components/tasks/TaskCard';
import { 
  AlertCircle, Clock, CalendarCheck, CheckCircle2, 
  Plus, ListTodo, Zap 
} from 'lucide-react';
import { getMyTasks } from '@/lib/actions/task-actions';
import { Button } from '@/components/ui/button';
import CreateTaskDialog from '@/components/tasks/CreateTaskDialog';

export default async function TasksPage() {
  const tasks = await getMyTasks();

  const overdue = tasks.filter(t => t.state === 'overdue');
  const today = tasks.filter(t => t.state === 'today');
  const upcoming = tasks.filter(t => t.state === 'planned');

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-8 min-h-screen">
      
      {/* HEADER PROFESSIONNEL */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                    <ListTodo className="h-5 w-5 text-amber-600" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
                    <Zap className="h-3 w-3 text-emerald-600 fill-emerald-600 animate-pulse" />
                    <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-400">Suivi en direct</span>
                </div>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Mes Tâches</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Gérez vos rappels, visites et échéances administratives.</p>
        </div>
        
        <CreateTaskDialog />
      </div>

      <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
        
        {/* COLONNE 1: EN RETARD */}
        <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <h3 className="font-black text-rose-600 dark:text-rose-400 flex items-center gap-2 text-sm uppercase tracking-widest">
                    <AlertCircle className="h-4 w-4" /> En Retard
                </h3>
                <span className="bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 text-[10px] font-black px-2 py-0.5 rounded-full">
                    {overdue.length}
                </span>
            </div>
            <div className="space-y-3 p-2 rounded-3xl bg-rose-50/30 dark:bg-rose-500/5 min-h-[200px]">
                {overdue.length === 0 ? (
                    <EmptyTaskState message="Aucun retard." />
                ) : (
                    overdue.map(t => <TaskCard key={t.id} task={t} />)
                )}
            </div>
        </div>

        {/* COLONNE 2: AUJOURD'HUI */}
        <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <h3 className="font-black text-orange-600 dark:text-orange-400 flex items-center gap-2 text-sm uppercase tracking-widest">
                    <Clock className="h-4 w-4" /> Aujourd'hui
                </h3>
                <span className="bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 text-[10px] font-black px-2 py-0.5 rounded-full">
                    {today.length}
                </span>
            </div>
            <div className="space-y-3 p-2 rounded-3xl bg-orange-50/30 dark:bg-orange-500/5 min-h-[200px]">
                {today.length === 0 ? (
                    <EmptyTaskState message="Rien pour aujourd'hui." />
                ) : (
                    today.map(t => <TaskCard key={t.id} task={t} />)
                )}
            </div>
        </div>

        {/* COLONNE 3: À VENIR */}
        <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <h3 className="font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-2 text-sm uppercase tracking-widest">
                    <CalendarCheck className="h-4 w-4" /> À Venir
                </h3>
                <span className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded-full">
                    {upcoming.length}
                </span>
            </div>
            <div className="space-y-3 p-2 rounded-3xl bg-emerald-50/30 dark:bg-emerald-500/5 min-h-[200px]">
                {upcoming.length === 0 ? (
                    <EmptyTaskState message="Calendrier libre." />
                ) : (
                    upcoming.map(t => <TaskCard key={t.id} task={t} />)
                )}
            </div>
        </div>
      </div>
    </div>
  );
}

function EmptyTaskState({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
            <CheckCircle2 className="h-8 w-8 text-slate-200 dark:text-slate-800" />
            <p className="text-xs font-bold text-slate-400 dark:text-slate-600 italic uppercase tracking-tighter">
                {message}
            </p>
        </div>
    )
}