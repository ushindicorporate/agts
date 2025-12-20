'use client'

import { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, useSensor, useSensors, PointerSensor, TouchSensor } from '@dnd-kit/core';
import { LeadCard } from './LeadCard';
import { toast } from 'sonner';

interface KanbanBoardProps {
  initialStages: CRMStage[];
  initialLeads: CRMLead[];
}

export default function KanbanBoard({ initialStages, initialLeads }: KanbanBoardProps) {
  const [leads, setLeads] = useState<CRMLead[]>(initialLeads);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Configuration des capteurs pour la souris et le tactile
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), // Evite le drag accidentel au click
    useSensor(TouchSensor)
  );

  // Fonction déclenchée quand on lâche une carte
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return; // Lâché nulle part

    const leadId = parseInt(active.id as string);
    const newStageId = parseInt(over.id as string);

    // Trouver le lead actuel
    const currentLead = leads.find(l => l.id === leadId);
    if (!currentLead || currentLead.stageId === newStageId) return;

    // 1. Optimistic UI : Mise à jour immédiate de l'affichage
    const previousStageId = currentLead.stageId;
    setLeads((prev) => 
      prev.map(l => l.id === leadId ? { ...l, stageId: newStageId } : l)
    );

    // 2. Appel Serveur en arrière-plan
    const res = await updateLeadStage(leadId, newStageId);

    // 3. Rollback si erreur
    if (!res.success) {
      toast.error("Erreur de synchronisation Odoo");
      setLeads((prev) => 
        prev.map(l => l.id === leadId ? { ...l, stageId: previousStageId } : l)
      );
    } else {
        toast.success("Pipeline mis à jour");
    }
  };

  return (
    <DndContext 
        sensors={sensors} 
        onDragStart={(e) => setActiveId(e.active.id as string)}
        onDragEnd={handleDragEnd}
    >
      <div className="flex h-full gap-4 overflow-x-auto pb-4 items-start">
        {initialStages.map((stage) => {
           // Filtrer les leads pour cette colonne
           const stageLeads = leads.filter(l => l.stageId === stage.id);
           const totalRevenue = stageLeads.reduce((acc, curr) => acc + curr.expectedRevenue, 0);

           return (
            <div 
                key={stage.id} 
                id={stage.id.toString()} 
                className="w-80 min-w-[320px] shrink-0 flex flex-col max-h-full"
            >
                {/* Header Colonne */}
                <StageColumnHeader 
                    stage={stage} 
                    count={stageLeads.length} 
                    revenue={totalRevenue} 
                />

                {/* Zone des cartes (Scrollable verticalement) */}
                <DroppableColumn id={stage.id.toString()}>
                    {stageLeads.map(lead => (
                        <LeadCard key={lead.id} lead={lead} />
                    ))}
                    {stageLeads.length === 0 && (
                        <div className="h-24 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                            Vide
                        </div>
                    )}
                </DroppableColumn>
            </div>
           )
        })}
      </div>
      
      {/* Overlay pendant le drag (Optionnel mais joli) */}
      <DragOverlay>
         {activeId ? (
            <div className="opacity-80 rotate-2">
               {/* On clone visuellement la carte */}
               <LeadCard lead={leads.find(l => l.id.toString() === activeId)!} />
            </div>
         ) : null}
      </DragOverlay>
    </DndContext>
  );
}

// Petit wrapper pour la zone de drop
import { useDroppable } from '@dnd-kit/core';
import { updateLeadStage } from '@/lib/actions/pipeline-actions';
import { CRMLead, CRMStage } from '@/lib/types/crm';
import StageColumnHeader from './StageColumnHeader';

function DroppableColumn({ id, children }: { id: string, children: React.ReactNode }) {
    const { setNodeRef, isOver } = useDroppable({ id });
    
    return (
        <div 
            ref={setNodeRef} 
            className={`flex-1 bg-gray-50/50 rounded-xl p-2 border transition-colors ${isOver ? 'bg-indigo-50 border-indigo-200' : 'border-transparent'}`}
        >
            {children}
        </div>
    );
}