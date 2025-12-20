'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { createOffer } from '@/lib/actions/offer-actions';

export default function CreateOfferClient({ clients, properties }: { clients: any[], properties: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [clientId, setClientId] = useState<string>('');
  const [propertyId, setPropertyId] = useState<string>('');
  const [price, setPrice] = useState<string>('');

  // Quand on sélectionne un bien, on pré-remplit le prix par défaut
  const handlePropertyChange = (val: string) => {
    setPropertyId(val);
    const prop = properties.find(p => p.id.toString() === val);
    if (prop) setPrice(prop.price.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !propertyId || !price) return;
    
    setLoading(true);
    const res = await createOffer(parseInt(clientId), parseInt(propertyId), parseFloat(price));
    setLoading(false);

    if (res.success) {
        toast.success("Devis créé avec succès !");
        router.push('/dashboard/offers');
        router.refresh();
    } else {
        toast.error("Erreur lors de la création", { description: res.error });
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
       <Button variant="ghost" onClick={() => router.back()} className="mb-6 pl-0 hover:bg-transparent hover:text-primary">
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour
      </Button>

      <Card>
        <CardHeader>
            <CardTitle>Nouveau Devis</CardTitle>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* SÉLECTION CLIENT */}
                <div className="space-y-2">
                    <Label>Client (Acheteur / Locataire)</Label>
                    <Select onValueChange={setClientId} value={clientId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Choisir un client..." />
                        </SelectTrigger>
                        <SelectContent>
                            {clients.map(c => (
                                <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* SÉLECTION BIEN */}
                <div className="space-y-2">
                    <Label>Bien Immobilier</Label>
                    <Select onValueChange={handlePropertyChange} value={propertyId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Choisir un bien..." />
                        </SelectTrigger>
                        <SelectContent>
                            {properties.map(p => (
                                <SelectItem key={p.id} value={p.id.toString()}>
                                    {p.name} - {p.price} €
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* PRIX OFFRE */}
                <div className="space-y-2">
                    <Label>Prix proposé (Offre)</Label>
                    <div className="relative">
                        <Input 
                            type="number" 
                            value={price} 
                            onChange={(e) => setPrice(e.target.value)} 
                            className="pl-8"
                        />
                        <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">$</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Ce montant apparaîtra sur le devis envoyé au client.
                    </p>
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                    Générer le Devis
                </Button>

            </form>
        </CardContent>
      </Card>
    </div>
  );
}