'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { MoreHorizontal, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { updateCommissionStatus } from "@/lib/actions/finance-actions";

export default function CommissionAction({ orderId, currentStatus }: { orderId: number, currentStatus: string }) {
  const router = useRouter();

  const handleStatusChange = async (status: string) => {
    const res = await updateCommissionStatus(orderId, status);
    if (res.success) {
        toast.success("Statut mis à jour");
        router.refresh();
    } else {
        toast.error("Erreur mise à jour");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleStatusChange('paid')} disabled={currentStatus === 'paid'}>
            <CheckCircle className="mr-2 h-4 w-4 text-green-600" /> Marquer comme payée
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange('pending')}>
            Remettre en attente
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}