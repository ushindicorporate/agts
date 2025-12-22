'use client'

import { useState, useEffect, useMemo } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, useSensor, useSensors, PointerSensor, TouchSensor } from '@dnd-kit/core';
import { CRMLead, CRMStage } from '@/lib/types/crm';
import { LeadCard } from './LeadCard';
import { updateLeadStage } from '@/lib/actions/pipeline-actions';
import { toast } from 'sonner';
import StageColumnHeader from './StageColumnHeader';
import { useDroppable } from '@dnd-kit/core';
import LeadDrawer from './LeadDrawer';

interface KanbanBoardProps {
  initialStages: CRMStage[];
  initialLeads: CRMLead[];
}

export default function KanbanBoard({ initialStages, initialLeads }: KanbanBoardProps) {
  const [leads, setLeads] = useState<CRMLead[]>(initialLeads);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);

  // Sync Serveur -> Client
  useEffect(() => {
    setLeads(initialLeads);
  }, [initialLeads]);

  // Calcul sécurisé du lead en cours de déplacement
  const activeLead = useMemo(() => 
    leads.find(l => l.id.toString() === activeId), 
  [activeId, leads]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const leadId = parseInt(active.id as string);
    const newStageId = parseInt(over.id as string);

    const currentLead = leads.find(l => l.id === leadId);
    if (!currentLead || currentLead.stageId === newStageId) return;

    const previousStageId = currentLead.stageId;

    // Optimistic Update
    setLeads((prev) => 
      prev.map(l => l.id === leadId ? { ...l, stageId: newStageId } : l)
    );

    try {
        const res = await updateLeadStage(leadId, newStageId);
        if (!res.success) throw new Error("Erreur Odoo");
    } catch (err) {
        toast.error("Échec du déplacement");
        // Rollback
        setLeads((prev) => 
            prev.map(l => l.id === leadId ? { ...l, stageId: previousStageId } : l)
        );
    }
  };

  return (
    <DndContext 
        sensors={sensors} 
        onDragStart={handleDragStart} // Utilisation de la fonction dédiée
        onDragEnd={handleDragEnd}
    >
      <div className="flex h-full gap-4 pb-4 items-start min-h-[calc(100vh-140px)]">
        {initialStages.map((stage) => {
          const stageLeads = leads.filter(l => l.stageId === stage.id);
          const totalRevenue = stageLeads.reduce((acc, curr) => acc + curr.expectedRevenue, 0);
          const totalWeighted = stageLeads.reduce((acc, curr) => {
            return acc + (curr.expectedRevenue * (curr.probability || 0) / 100);
          }, 0);
          const avgProb = stageLeads.length > 0 
            ? Math.round(stageLeads.reduce((acc, curr) => acc + (curr.probability || 0), 0) / stageLeads.length)
            : 0;

           return (
            <div 
                key={stage.id} 
                className="w-80 min-w-[320px] shrink-0 flex flex-col h-full bg-gray-50/50 rounded-xl border border-transparent hover:border-gray-200 transition-colors"
            >
                {/* Header */}
                <div className="p-2 pb-0">
                    <StageColumnHeader 
                        stage={{...stage, probability: avgProb}} 
                        count={stageLeads.length} 
                        revenue={totalRevenue}
                        weightedRevenue={totalWeighted}
                    />
                </div>

                {/* Zone Scrollable */}
                <DroppableColumn id={stage.id.toString()}>
                    <div className="flex flex-col gap-3 min-h-[150px]">
                        {stageLeads.map(lead => (
                            <LeadCard 
                                key={lead.id} 
                                lead={lead} 
                                onClick={() => setSelectedLeadId(lead.id)} 
                            />
                        ))}
                    </div>
                    {stageLeads.length === 0 && (
                        <div className="flex-1 flex items-center justify-center min-h-[100px] border-2 border-dashed border-gray-200 rounded-lg m-2">
                            <span className="text-gray-400 text-sm">Vide</span>
                        </div>
                    )}
                </DroppableColumn>
            </div>
           )
        })}
      </div>
      
      {/* Overlay Sécurisé */}
      <DragOverlay>
         {activeLead ? (
            <div className="opacity-80 rotate-2 scale-105 cursor-grabbing">
               <LeadCard lead={activeLead} onClick={() => {}} />
            </div>
         ) : null}
      </DragOverlay>

      {/* Drawer Détails */}
      <LeadDrawer 
           leadId={selectedLeadId} 
           open={!!selectedLeadId} 
           onClose={() => setSelectedLeadId(null)} 
       />
    </DndContext>
  );
}

function DroppableColumn({ id, children }: { id: string, children: React.ReactNode }) {
    const { setNodeRef, isOver } = useDroppable({ id });
    
    return (
        <div 
            ref={setNodeRef} 
            className={`flex-1 overflow-y-auto p-2 transition-colors rounded-b-xl scrollbar-thin scrollbar-thumb-gray-300 ${isOver ? 'bg-indigo-50/50 ring-2 ring-indigo-200 ring-inset' : ''}`}
        >
            {children}
        </div>
    );
}