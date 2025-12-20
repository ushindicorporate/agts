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

interface StageColumnHeaderProps {
  stage: CRMStage;
  count: number;
  revenue: number;
}

export default function StageColumnHeader({ stage, count, revenue }: StageColumnHeaderProps) {
  const [loading, setLoading] = useState(false);
  
  // États pour le renommage
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [newName, setNewName] = useState(stage.name);

  const router = useRouter();

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
    <>
      <div className="flex items-center justify-between mb-3 px-1">
        {/* Infos Colonne */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-700 truncate max-w-[150px]" title={stage.name}>
            {stage.name}
          </span>
          <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">
            {count}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {revenue > 0 && (
            <span className="text-xs font-medium text-emerald-600">
              {formatCurrency(revenue)}
            </span>
          )}

          {/* MENU DÉROULANT */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-gray-200">
                <MoreHorizontal className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onSelect={(e) => {
                    e.preventDefault(); // Empêche la fermeture immédiate pour laisser le Dialog s'ouvrir
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
                <Trash2 className="mr-2 h-3 w-3" /> 
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* DIALOGUE DE RENOMMAGE (Modal) */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Renommer l'étape</DialogTitle>
            <DialogDescription>
              Modifiez le nom de cette étape dans votre pipeline CRM.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              id="name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="col-span-3"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenameDialog(false)}>Annuler</Button>
            <Button onClick={handleRename} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sauvegarder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}