'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createPropertyLead } from '@/lib/actions/crm-actions'; // Vérifie le chemin
import { toast } from 'sonner';
import { UserPlus, Loader2 } from 'lucide-react';

interface Props {
    propertyId: number;
    propertyName: string;
    contacts: { id: number|undefined; name: string }[];
}

export default function CreateLeadDialog({ propertyId, propertyName, contacts }: Props) {
    const [open, setOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState<string>('');
    const [revenue, setRevenue] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!selectedContact) {
            toast.error("Veuillez sélectionner un contact");
            return;
        }
        setLoading(true);
        
        // Appel Server Action
        const res = await createPropertyLead(
            propertyId, 
            propertyName, 
            parseInt(selectedContact),
            revenue ? parseFloat(revenue) : 0
        );
        
        setLoading(false);
        
        if (res.success) {
            toast.success("Opportunité créée !", { description: "Visible dans le pipeline." });
            setOpen(false);
            setRevenue('');
            setSelectedContact('');
        } else {
            toast.error("Erreur", { description: res.error });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
                    <UserPlus className="mr-2 h-4 w-4" /> Intéresser un client
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Créer une opportunité</DialogTitle>
                    <DialogDescription>Lier un contact existant à ce bien immobilier.</DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Sélectionner un contact</Label>
                        <Select onValueChange={setSelectedContact} value={selectedContact}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choisir un client..." />
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                                {contacts.map((c) => (
                                    <SelectItem key={c.id} value={c.id?.toString() || ''}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Budget / Offre potentielle ($)</Label>
                        <Input 
                            type="number" 
                            placeholder="Ex: 250000" 
                            value={revenue} 
                            onChange={(e) => setRevenue(e.target.value)} 
                        />
                        <p className="text-xs text-muted-foreground">Laisser vide si inconnu.</p>
                    </div>

                    <Button onClick={handleSubmit} disabled={loading || !selectedContact} className="w-full">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Créer le Lead'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}