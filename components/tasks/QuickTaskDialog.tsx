'use client'

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BellPlus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createTask, getActivityTypes } from '@/lib/actions/task-actions';

interface QuickTaskProps {
  resModel: string; // 'res.partner', 'crm.lead'
  resId: number;
}

export default function QuickTaskDialog({ resModel, resId }: QuickTaskProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [types, setTypes] = useState<any[]>([]);
  
  // Form State
  const [summary, setSummary] = useState('');
  const [date, setDate] = useState('');
  const [typeId, setTypeId] = useState('');

  // Charger les types au montage
  useEffect(() => {
    if (open && types.length === 0) {
        getActivityTypes().then(setTypes);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!summary || !date || !typeId) return;
    setLoading(true);

    const res = await createTask({
        summary,
        date_deadline: date,
        activity_type_id: parseInt(typeId),
        res_model: resModel,
        res_id: resId
    });

    setLoading(false);

    if (res.success) {
        toast.success("Rappel programmé");
        setOpen(false);
        setSummary('');
        setDate('');
    } else {
        toast.error("Erreur création tâche");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button variant="outline" size="sm">
                <BellPlus className="mr-2 h-4 w-4" /> Rappel
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Programmer un suivi</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Titre</label>
                    <Input placeholder="Ex: Relancer pour le loyer..." value={summary} onChange={e => setSummary(e.target.value)} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Type</label>
                        <Select onValueChange={setTypeId}>
                            <SelectTrigger><SelectValue placeholder="Type..." /></SelectTrigger>
                            <SelectContent>
                                {types.map(t => (
                                    <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Échéance</label>
                        <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
                    </div>
                </div>

                <Button onClick={handleSubmit} disabled={loading || !summary} className="w-full">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Enregistrer
                </Button>
            </div>
        </DialogContent>
    </Dialog>
  );
}