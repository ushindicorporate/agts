'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Trash2, Pencil, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CRMStage } from '@/lib/types/crm';
import { deleteStage, renameStage } from '@/lib/actions/pipeline-settings';
import { formatCurrency } from '@/lib/utils';

// --- AJOUT DE weightedRevenue ---
interface StageColumnHeaderProps {
  stage: CRMStage;
  count: number;
  revenue: number;
  weightedRevenue: number;
}

export default function StageColumnHeader({ stage, count, revenue, weightedRevenue }: StageColumnHeaderProps) {
  const [loading, setLoading] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [newName, setNewName] = useState(stage.name);
  const router = useRouter();

  // ... (Garder handleDelete et handleRename inchangés) ...
  const handleDelete = async () => {
    if (count > 0) {
      toast.warning("Veuillez vider la colonne avant de la supprimer.");
      return;
    }
    const confirm = window.confirm(`Supprimer "${stage.name}" ?`);
    if (!confirm) return;

    setLoading(true);
    const res = await deleteStage(stage.id);
    setLoading(false);

    if (res.success) {
      toast.success("Étape supprimée");
      router.refresh();
    } else {
      toast.error("Erreur", { description: res.error });
    }
  };

  const handleRename = async () => {
    if (newName === stage.name) {
        setShowRenameDialog(false);
        return;
    }
    setLoading(true);
    const res = await renameStage(stage.id, newName);
    setLoading(false);
    if (res.success) {
        toast.success("Étape renommée");
        setShowRenameDialog(false);
        router.refresh();
    } else {
        toast.error("Erreur", { description: res.error });
    }
  };

  return (
    <div className="flex flex-col mb-3 px-1"> {/* Changement flex-col pour empiler les lignes */}
      
      {/* LIGNE 1 : TITRE + MENU */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="font-bold text-gray-700 truncate text-sm" title={stage.name}>
            {stage.name}
          </span>
          <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
            {count}
          </span>
        </div>

        {/* MENU */}
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 hover:bg-gray-200 shrink-0">
                <MoreHorizontal className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onSelect={(e) => {
                    e.preventDefault();
                    setShowRenameDialog(true);
                }}
                className="cursor-pointer"
              >
                   <Pencil className="mr-2 h-3 w-3" /> Renommer
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDelete} 
                className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
              >
                <Trash2 className="mr-2 h-3 w-3" /> Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* LIGNE 2 : KPI FINANCIERS */}
      {revenue > 0 && (
        <div className="flex items-center justify-between mt-1 pt-1 border-t border-gray-100">
            {/* Montant Brut */}
            <span className="text-xs font-bold text-emerald-700" title="Montant total espéré">
                {formatCurrency(revenue)}
            </span>

            <div className="flex items-center gap-1">
                {/* Montant Pondéré (si différent et significatif) */}
                {weightedRevenue > 0 && weightedRevenue < revenue && (
                    <span className="text-[10px] text-gray-400 font-medium" title="Montant pondéré par la probabilité">
                        ({formatCurrency(weightedRevenue)})
                    </span>
                )}
                
                {/* Badge Probabilité Moyenne */}
                {/* On suppose que stage.probability a été calculé comme moyenne dans KanbanBoard */}
                {stage.probability !== undefined && stage.probability > 0 && stage.probability < 100 && (
                    <span className="text-[9px] bg-blue-50 text-blue-600 px-1 rounded border border-blue-100 ml-1 font-bold">
                        {stage.probability}%
                    </span>
                )}
            </div>
        </div>
      )}

      {/* DIALOGUE RENOMMAGE (Inchangé) */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Renommer l'étape</DialogTitle>
            <DialogDescription>Modifiez le nom dans le CRM.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input id="name" value={newName} onChange={(e) => setNewName(e.target.value)} autoFocus />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenameDialog(false)}>Annuler</Button>
            <Button onClick={handleRename} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Sauvegarder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}