import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import KanbanBoard from '@/components/crm/pipeline/KanbanBoard';
import PipelineSetupBtn from '@/components/crm/pipeline/PipelineSetupBtn'; // Import du bouton
import { getPipelineData } from '@/lib/actions/pipeline-actions';

export default async function PipelinePage() {
  const { stages, leads } = await getPipelineData();

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 px-1">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Pipeline Commercial</h1>
            <p className="text-muted-foreground">Suivez vos opportunités de la visite à la signature.</p>
        </div>
        
        <div className="flex items-center gap-2">
            {/* Bouton pour générer les colonnes si vide */}
            <PipelineSetupBtn />

            <Link href="/dashboard/leads/create">
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Nouvelle Opportunité
                </Button>
            </Link>
        </div>
      </div>

      {/* KANBAN BOARD */}
      {stages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-xl bg-gray-50 text-gray-500">
              <p className="mb-4 font-medium">Aucune étape de vente configurée.</p>
              <p className="text-sm text-gray-400 mb-4">Cliquez sur "Config. Standard" ci-dessus pour générer le workflow.</p>
          </div>
      ) : (
          <div className="flex-1 overflow-x-auto overflow-y-hidden">
             <KanbanBoard initialStages={stages} initialLeads={leads} />
          </div>
      )}

    </div>
  );
}