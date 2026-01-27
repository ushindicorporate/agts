'use client'

import { useState, useEffect } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogTrigger, DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Loader2, Calendar, Search, CheckCircle2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { createTask, getActivityTypes } from '@/lib/actions/task-actions';
import { searchResources } from '@/lib/actions/search-actions';
import MultipleSelector, { Option } from '@/components/ui/multiselect';

export default function CreateTaskDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activityTypes, setActivityTypes] = useState<any[]>([]);
  
  // Form State
  const [summary, setSummary] = useState('');
  const [date, setDate] = useState('');
  const [typeId, setTypeId] = useState('');
  const [resModel, setResModel] = useState('res.partner'); // Par défaut on lie à un contact
  const [selectedResource, setSelectedResource] = useState<Option[]>([]);

  // Charger les types d'activités Odoo
  useEffect(() => {
    if (open) {
        getActivityTypes().then(setActivityTypes);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!summary || !date || !typeId || selectedResource.length === 0) {
        toast.error("Veuillez remplir tous les champs obligatoires");
        return;
    }
    
    setLoading(true);
    const res = await createTask({
        summary,
        date_deadline: date,
        activity_type_id: parseInt(typeId),
        res_model: resModel,
        res_id: parseInt(selectedResource[0].value)
    });
    setLoading(false);

    if (res.success) {
        toast.success("Tâche planifiée avec succès");
        setOpen(false);
        resetForm();
    } else {
        toast.error("Erreur système lors de la création");
    }
  };

  const resetForm = () => {
    setSummary('');
    setDate('');
    setTypeId('');
    setSelectedResource([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button size="lg" className="rounded-2xl bg-slate-900 dark:bg-primary text-white font-black h-12 px-6 shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                <Plus className="mr-2 h-5 w-5 stroke-[3px]" /> Nouvelle Tâche
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] rounded-4xl border-none dark:bg-slate-950 shadow-2xl">
            <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <DialogTitle className="text-xl font-black">Planifier une action</DialogTitle>
                </div>
                <DialogDescription className="font-medium">
                    Rattachez cette tâche à un dossier pour le suivi AGTS.
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
                {/* 1. SELECTION DU TYPE DE DOSSIER */}
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">1. Type de dossier</Label>
                    <Select value={resModel} onValueChange={(val) => { setResModel(val); setSelectedResource([]); }}>
                        <SelectTrigger className="h-12 rounded-xl dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-slate-900 border-slate-800">
                            <SelectItem value="res.partner">👤 Contact / Client</SelectItem>
                            <SelectItem value="crm.lead">🎯 Opportunité Commerciale</SelectItem>
                            <SelectItem value="product.template">🏠 Bien Immobilier</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* 2. RECHERCHE DU DOSSIER SPECIFIQUE */}
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">2. Rechercher le dossier</Label>
                    <MultipleSelector
                        value={selectedResource}
                        onChange={setSelectedResource}
                        onSearch={async (q) => searchResources(resModel, q)}
                        placeholder="Taper un nom ou une référence..."
                        maxSelected={1}
                        className="rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-900"
                        emptyIndicator={<p className="text-center text-xs py-2">Aucun dossier trouvé.</p>}
                    />
                </div>

                {/* 3. DETAILS DE LA TACHE */}
                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-900">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">3. Objet de la tâche</Label>
                        <Input 
                            placeholder="Ex: Rappeler pour confirmer la visite..." 
                            className="h-12 rounded-xl dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                            value={summary}
                            onChange={e => setSummary(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold">Type d'action</Label>
                            <Select value={typeId} onValueChange={setTypeId}>
                                <SelectTrigger className="h-11 rounded-xl dark:bg-slate-900">
                                    <SelectValue placeholder="Action..." />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-slate-900">
                                    {activityTypes.map(t => (
                                        <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold">Échéance</Label>
                            <div className="relative">
                                <Input 
                                    type="date" 
                                    className="h-11 rounded-xl dark:bg-slate-900 pl-10" 
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                />
                                <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            </div>
                        </div>
                    </div>
                </div>

                <Button 
                    onClick={handleSubmit} 
                    disabled={loading || !summary} 
                    className="w-full h-14 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 transition-all active:scale-95"
                >
                    {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-5 w-5" />}
                    Enregistrer la tâche
                </Button>
            </div>
        </DialogContent>
    </Dialog>
  );
}