'use client'

import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { setLeadState } from '@/lib/actions/pipeline-actions';

export default function LeadActions({ leadId }: { leadId: number }) {
    const router = useRouter();

    const handleAction = async (action: 'mark_won' | 'mark_lost') => {
        const res = await setLeadState(leadId, action);
        if (res.success) {
            toast.success(action === 'mark_won' ? "Félicitations ! Lead gagné." : "Lead marqué comme perdu.");
            router.refresh();
        } else {
            toast.error("Erreur action");
        }
    };

    return (
        <div className="flex gap-2">
            <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleAction('mark_lost')}>
                <XCircle className="mr-2 h-4 w-4" /> Perdu
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleAction('mark_won')}>
                <CheckCircle className="mr-2 h-4 w-4" /> Gagné
            </Button>
        </div>
    );
}