'use client'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createPropertyLead } from '@/lib/actions/crm-actions';
import { toast } from 'sonner';
import { UserPlus } from 'lucide-react';

// Tu devras passer une liste simplifiée de contacts {id, name} à ce composant
export default function CreateLeadDialog({ propertyId, propertyName, contacts }: any) {
    const [open, setOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!selectedContact) return;
        setLoading(true);
        const res = await createPropertyLead(propertyId, propertyName, Number(selectedContact));
        setLoading(false);
        if (res.success) {
            toast.success("Opportunité créée dans le CRM !");
            setOpen(false);
        } else {
            toast.error("Erreur création lead");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                    <UserPlus className="mr-2 h-4 w-4" /> Intéresser un client
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Créer une opportunité</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Sélectionner un contact existant</label>
                        <Select onValueChange={setSelectedContact}>
                            <SelectTrigger><SelectValue placeholder="Choisir un client..." /></SelectTrigger>
                            <SelectContent>
                                {contacts.map((c: any) => (
                                    <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={handleSubmit} disabled={loading || !selectedContact} className="w-full">
                        {loading ? 'Création...' : 'Confirmer'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}