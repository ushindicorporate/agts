'use client'

import { useState } from 'react';
import { 
  MoreHorizontal, Phone, Mail, MessageCircle, 
  CalendarPlus, UserPlus, FileText 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import QuickTaskDialog from '@/components/tasks/QuickTaskDialog';
import { assignLead } from '@/lib/actions/pipeline-actions';
import { CRMLead } from '@/lib/types/crm';

// On suppose que tu passes une liste d'agents pour l'assignation
// Sinon on peut la charger via un useEffect
const MOCK_AGENTS = [
    { id: 1, name: "Jean Dupont" },
    { id: 2, name: "Marie Curie" }
]; // À remplacer par une vraie liste fetched

export default function LeadCardActions({ lead }: { lead: CRMLead }) {
  const [showTaskDialog, setShowTaskDialog] = useState(false);

  const handleWhatsApp = () => {
    if (!lead.phone) return toast.error("Pas de numéro de téléphone");
    // Nettoyage sommaire du numéro
    const number = lead.phone.replace(/\D/g, ''); 
    window.open(`https://wa.me/${number}`, '_blank');
  };

  const handleCall = () => {
    if (!lead.phone) return toast.error("Pas de numéro de téléphone");
    window.open(`tel:${lead.phone}`, '_self');
  };

  const handleEmail = () => {
    if (!lead.email) return toast.error("Pas d'email");
    window.open(`mailto:${lead.email}`, '_self');
  };

  const handleAssign = async (userId: number) => {
      const res = await assignLead(lead.id, userId);
      if (res.success) toast.success("Commercial assigné");
      else toast.error("Erreur assignation");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {/* IMPORTANT: onPointerDown stopPropagation empêche le drag de démarrer sur ce bouton */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 -mr-2 hover:bg-gray-200"
            onPointerDown={(e) => e.stopPropagation()} 
          >
            <MoreHorizontal className="h-4 w-4 text-gray-500" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Actions Rapides</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {/* COMMUNICATION */}
          <DropdownMenuItem onClick={handleCall} disabled={!lead.phone} className="cursor-pointer">
            <Phone className="mr-2 h-4 w-4 text-blue-600" /> Appeler
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleWhatsApp} disabled={!lead.phone} className="cursor-pointer">
            <MessageCircle className="mr-2 h-4 w-4 text-green-600" /> WhatsApp
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEmail} disabled={!lead.email} className="cursor-pointer">
            <Mail className="mr-2 h-4 w-4 text-gray-600" /> Email
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />

          {/* ORGANISATION */}
          <DropdownMenuItem 
            onClick={() => setShowTaskDialog(true)} 
            className="cursor-pointer"
          >
            <CalendarPlus className="mr-2 h-4 w-4 text-orange-600" /> 
            Rappel / Tâche
          </DropdownMenuItem>

          {/* ASSIGNATION (Sous-menu) */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <UserPlus className="mr-2 h-4 w-4" /> Assigner
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
                {MOCK_AGENTS.map(agent => (
                    <DropdownMenuItem key={agent.id} onClick={() => handleAssign(agent.id)}>
                        {agent.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

        </DropdownMenuContent>
      </DropdownMenu>

      {/* MODALE DE TÂCHE (Invisible sauf si activée) */}
      {/* Astuce : On conditionne le rendu pour que le Dialog s'ouvre proprement */}
      {showTaskDialog && (
        <div onPointerDown={(e) => e.stopPropagation()}>
            <QuickTaskDialog 
                resModel="crm.lead" 
                resId={lead.id} 
                // Il faudra peut-être adapter QuickTaskDialog pour accepter un prop 'open' contrôlé
                // ou simplement le laisser gérer son état interne mais déclenché ici
            /> 
            {/* Note: Pour que ça marche parfaitement, QuickTaskDialog devrait accepter une prop 'defaultOpen={true}' 
                ou on peut tricher en simulant un clic sur son trigger.
                La meilleure solution est de refactoriser QuickTaskDialog pour exposer le DialogContent sans le Trigger 
                si on veut le contrôler d'ici.
            */}
        </div>
      )}
    </>
  );
}