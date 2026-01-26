import { Suspense } from 'react';
import Link from 'next/link';
import { Plus, LayoutDashboard, Target, } from 'lucide-react';
import { Button } from '@/components/ui/button';
import KanbanBoard from '@/components/crm/pipeline/KanbanBoard';
import PipelineSetupBtn from '@/components/crm/pipeline/PipelineSetupBtn';
import { getPipelineData } from '@/lib/actions/pipeline-actions';

export default async function PipelinePage() {
  // Chargement des données Odoo
  const { stages, leads } = await getPipelineData();

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col space-y-6">
      
      {/* HEADER PROFESSIONNEL */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-1">
        <div className="space-y-1">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                    <Target className="h-5 w-5 text-indigo-600" />
                </div>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Pipeline Commercial</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Suivi du flux des ventes AGTS - Temps réel.</p>
        </div>
        
        <div className="flex items-center gap-3">
            <PipelineSetupBtn />
            <Link href="/dashboard/leads/create">
                <Button className="rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold h-12 px-6 shadow-lg shadow-primary/20">
                    <Plus className="mr-2 h-5 w-5 stroke-[3px]" /> Nouvelle Opportunité
                </Button>
            </Link>
        </div>
      </div>

      {/* KANBAN BOARD AVEC SUSPENSE */}
      <div className="flex-1 overflow-hidden">
        <Suspense fallback={<KanbanSkeleton />}>
            {stages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full border-2 border-dashed rounded-[2.5rem] bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
                    <LayoutDashboard className="h-12 w-12 text-slate-300 mb-4" />
                    <p className="text-slate-900 dark:text-white font-bold">Aucune étape configurée</p>
                    <p className="text-sm text-slate-500 mb-6">Initialisez votre workflow Odoo pour commencer.</p>
                    <PipelineSetupBtn />
                </div>
            ) : (
                <KanbanBoard initialStages={stages} initialLeads={leads} />
            )}
        </Suspense>
      </div>
    </div>
  );
}
function KanbanSkeleton() {
  return (
    <div className="flex h-full gap-4 overflow-hidden animate-pulse">
      {[1, 2, 3, 4].map((col) => (
        <div key={col} className="w-80 shrink-0 flex flex-col gap-4">
          <div className="h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
          <div className="flex flex-col gap-3">
             {[1, 2, 3].map((card) => (
               <div key={card} className="h-32 bg-slate-50 dark:bg-slate-900 rounded-2xl" />
             ))}
          </div>
        </div>
      ))}
    </div>
  );
}