'use client'

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Loader2, Save, ImageIcon, Building2, MapPin, 
  DollarSign, Ruler, Bed, Bath, Sofa, UtensilsCrossed, 
  Car, Info, PlusCircle 
} from 'lucide-react';
import { toast } from 'sonner';

import ImageManager from './ImageManager';
import QuickContactDialog from '../crm/QuickContactDialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/lib/types/property';
import { upsertProperty } from '@/lib/actions/property-actions';
import { cn } from '@/lib/utils';

// --- SCHÉMA DE VALIDATION (Strict Odoo) ---
const formSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  type: z.enum(['apartment', 'villa', 'land', 'commercial']),
  address: z.string().min(5, "L'adresse est requise"),
  city: z.string().min(2, "La commune est requise"),
  
  // Champ unique Odoo pour Statut + Type d'offre
  x_studio_statut: z.enum(['À vendre', 'À louer', 'Vendu', 'Loué', 'Réservé']),
  
  price: z.coerce.number().min(0, "Le prix doit être positif"),
  commission: z.coerce.number().min(0, "La commission doit être positive"),
  ownerId: z.coerce.number().optional(),
  
  surface: z.coerce.number().min(0, "Surface requise"),
  bedrooms: z.coerce.number().min(0).optional(),
  salons: z.coerce.number().min(0).optional(),
  kitchens: z.coerce.number().min(0).optional(),
  bathrooms: z.coerce.number().min(0).optional(),
  parking: z.boolean().default(false),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface PropertyFormProps {
  initialData?: Property;
  owners: { id: number; name: string }[];
  onSuccess?: (newId: number) => void;
}

export default function PropertyForm({ initialData, owners, onSuccess }: PropertyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ownersList, setOwnersList] = useState(owners);
  
  const propertyId = initialData?.id;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      ...initialData,
      // On s'assure que x_studio_statut est bien mappé depuis initialData
      x_studio_statut: (initialData as any)?.x_studio_statut || 'À louer',
    } as any
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    const result = await upsertProperty(values);
    setIsSubmitting(false);

    if (result.success) {
      toast.success(propertyId ? "Mise à jour réussie" : "Bien créé avec succès", {
        description: "Les données sont synchronisées avec Odoo AGTS."
      });
      if (onSuccess && result.id) onSuccess(result.id);
    } else {
      toast.error("Erreur Odoo", { description: result.error });
    }
  }

  const handleNewOwnerAdded = (newContact: { id: number, name: string }) => {
      setOwnersList((prev) => [...prev, newContact]);
      form.setValue('ownerId', newContact.id);
      toast.success("Nouveau propriétaire ajouté et sélectionné");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pb-24 lg:pb-10">
      
      {/* --- COLONNE GAUCHE : FORMULAIRE --- */}
      <div className="lg:col-span-2 space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* 1. INFORMATIONS GÉNÉRALES */}
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
                <div className="h-1.5 bg-primary w-full" />
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        <CardTitle>Informations Générales</CardTitle>
                    </div>
                    <CardDescription>Détails principaux du mandat immobilier</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                    <div className="md:col-span-2">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Titre du bien</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Penthouse de luxe - Gombe" className="dark:bg-slate-800" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type de propriété</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger className="dark:bg-slate-800"><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="apartment">Appartement</SelectItem>
                                    <SelectItem value="villa">Villa / Maison</SelectItem>
                                    <SelectItem value="land">Terrain</SelectItem>
                                    <SelectItem value="commercial">Local Commercial</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="x_studio_statut"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-bold text-primary">Statut & Offre</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="border-primary/40 dark:bg-slate-800">
                                        <SelectValue />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="À louer" className="font-medium text-blue-600">🔵 À louer</SelectItem>
                                    <SelectItem value="À vendre" className="font-medium text-orange-600">🟠 À vendre</SelectItem>
                                    <SelectItem value="Réservé" className="text-purple-600">⏳ Réservé</SelectItem>
                                    <SelectItem value="Loué" className="text-slate-400 italic">✅ Loué (Clôturé)</SelectItem>
                                    <SelectItem value="Vendu" className="text-slate-400 italic">✅ Vendu (Clôturé)</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            {/* 2. LOCALISATION & PROPRIÉTAIRE */}
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        <CardTitle>Localisation & Propriétaire</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Commune (Kinshasa)</FormLabel>
                            <FormControl><Input placeholder="Ex: Gombe, Ngaliema..." className="dark:bg-slate-800" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Adresse complète</FormLabel>
                            <FormControl><Input placeholder="Rue, n°, quartier..." className="dark:bg-slate-800" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    
                    <div className="md:col-span-2">
                        <FormField
                            control={form.control}
                            name="ownerId"
                            render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center justify-between mb-2">
                                    <FormLabel>Propriétaire Mandant</FormLabel>
                                    <QuickContactDialog onSuccess={handleNewOwnerAdded} />
                                </div>
                                <Select 
                                    onValueChange={(val) => field.onChange(Number(val))} 
                                    value={field.value?.toString()}
                                >
                                    <FormControl><SelectTrigger className="dark:bg-slate-800"><SelectValue placeholder="Rechercher un contact..." /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {ownersList.map(owner => (
                                            <SelectItem key={owner.id} value={owner.id.toString()}>{owner.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                            )}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* 3. ASPECTS FINANCIERS */}
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900 border-l-4 border-l-emerald-500">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-emerald-600" />
                        <CardTitle>Finances</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Prix de vente / Loyer mensuel</FormLabel>
                            <FormControl>
                                <div className="relative group">
                                    <span className="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-primary transition-colors">$</span>
                                    <Input type="number" className="pl-8 dark:bg-slate-800" {...field} />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="commission"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Commission AGTS</FormLabel>
                            <FormControl>
                                <div className="relative group">
                                    <span className="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-primary transition-colors">$</span>
                                    <Input type="number" className="pl-8 dark:bg-slate-800 font-semibold text-emerald-600" {...field} />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            {/* 4. CARACTÉRISTIQUES TECHNIQUES */}
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Info className="h-5 w-5 text-slate-400" />
                        <CardTitle>Fiche Technique</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-6 grid-cols-2 md:grid-cols-3">
                        <FormField
                            control={form.control}
                            name="surface"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-1"><Ruler className="h-3 w-3" /> Surface</FormLabel>
                                <FormControl><Input type="number" placeholder="m²" className="dark:bg-slate-800" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bedrooms"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-1"><Bed className="h-3 w-3" /> Chambres</FormLabel>
                                <FormControl><Input type="number" className="dark:bg-slate-800" {...field} /></FormControl>
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="salons"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-1"><Sofa className="h-3 w-3" /> Salons</FormLabel>
                                <FormControl><Input type="number" className="dark:bg-slate-800" {...field} /></FormControl>
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="kitchens"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-1"><UtensilsCrossed className="h-3 w-3" /> Cuisines</FormLabel>
                                <FormControl><Input type="number" className="dark:bg-slate-800" {...field} /></FormControl>
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bathrooms"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-1"><Bath className="h-3 w-3" /> SDB</FormLabel>
                                <FormControl><Input type="number" className="dark:bg-slate-800" {...field} /></FormControl>
                            </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description détaillée (Odoo)</FormLabel>
                            <FormControl>
                                <Textarea 
                                    rows={4} 
                                    placeholder="Décrivez les atouts du bien..." 
                                    className="dark:bg-slate-800 resize-none" 
                                    {...field} 
                                />
                            </FormControl>
                        </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            {/* BARRE D'ACTION FIXE (Mobile) OU NORMALE (Desktop) */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t z-50 lg:relative lg:bg-transparent lg:border-0 lg:p-0">
                <Button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="w-full lg:w-fit min-w-[200px] bg-slate-900 dark:bg-primary py-6 lg:py-2 text-white font-bold rounded-xl shadow-xl transition-all active:scale-95"
                >
                    {isSubmitting ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                        <Save className="mr-2 h-5 w-5" />
                    )}
                    {propertyId ? 'Mettre à jour sur Odoo' : 'Créer le mandat'}
                </Button>
            </div>

          </form>
        </Form>
      </div>

      {/* --- COLONNE DROITE : GESTION DES PHOTOS --- */}
      <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-8">
        {propertyId ? (
            <ImageManager 
                propertyId={propertyId} 
                initialMainImage={initialData?.mainImage} 
            />
        ) : (
            <div className="rounded-2xl border-2 border-dashed p-10 flex flex-col items-center justify-center text-center space-y-4 bg-slate-50 dark:bg-slate-800/50">
                <div className="p-4 bg-white dark:bg-slate-900 rounded-full shadow-sm">
                    <ImageIcon className="h-10 w-10 text-slate-300" />
                </div>
                <div>
                    <h4 className="font-bold">Photos bloquées</h4>
                    <p className="text-sm text-slate-500 max-w-[200px] mx-auto mt-1">
                        Enregistrez d'abord les informations du bien pour débloquer l'album photo.
                    </p>
                </div>
            </div>
        )}
      </div>

    </div>
  );
}