'use client'

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Save, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

import ImageManager from './ImageManager'; // Assure-toi que ce fichier est dans le même dossier

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Property } from '@/lib/types/property';
import { upsertProperty } from '@/lib/actions/property-actions';

// --- SCHÉMA DE VALIDATION ---
const formSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3, "Titre requis (ex: Villa vue mer)"),
  type: z.enum(['apartment', 'villa', 'land', 'commercial']),
  address: z.string().min(5, "Adresse requise"),
  city: z.string().min(2, "Ville requise"),
  offerType: z.enum(['À vendre', 'À louer']),
  // z.coerce permet de gérer les inputs type="number" qui renvoient des strings
  price: z.coerce.number().min(0, "Prix positif requis"),
  commission: z.coerce.number().min(0),
  status: z.enum(['available', 'reserved', 'rented', 'sold']),
  ownerId: z.coerce.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface PropertyFormProps {
  initialData?: Property;
  owners: { id: number; name: string }[];
  onSuccess?: (newId: number) => void; // Callback avec ID pour rediriger si création
}

export default function PropertyForm({ initialData, owners, onSuccess }: PropertyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Si initialData.id existe, on est en mode édition
  const propertyId = initialData?.id;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: initialData || {
      name: '',
      type: 'apartment',
      address: '',
      city: '',
      offerType: 'À vendre',
      price: 0,
      commission: 0,
      status: 'available',
    }
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    
    // Adaptation TypeScript si besoin (cast vers Property)
    // @ts-ignore
    const result = await upsertProperty(values);
    
    setIsSubmitting(false);

    if (result.success) {
      toast.success(propertyId ? "Modifications enregistrées" : "Bien immobilier créé", {
        // description: "Synchronisé avec Odoo."
      });
      
      if (!initialData) form.reset();
      if (onSuccess && result.id) onSuccess(result.id);
    } else {
      toast.error("Erreur", { description: result.error || "Une erreur est survenue." });
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      
      {/* --- COLONNE GAUCHE : FORMULAIRE (2/3) --- */}
      <div className="lg:col-span-2 space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* CARTE 1: INFOS PRINCIPALES */}
            <Card>
                <CardHeader>
                    <CardTitle>Détails du Bien</CardTitle>
                    <CardDescription>Informations générales visibles sur l'annonce.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Titre de l'annonce</FormLabel>
                                <FormControl><Input placeholder="Ex: Appartement T3 Centre Ville" {...field} /></FormControl>
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
                            <FormLabel>Type de bien</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
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
                        name="status"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Disponibilité</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="available">Disponible</SelectItem>
                                    <SelectItem value="reserved">Réservé</SelectItem>
                                    <SelectItem value="À vendre">Vendu</SelectItem>
                                    <SelectItem value="À louer">Loué</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            {/* CARTE 2: LOCALISATION & PROPRIÉTAIRE */}
            <Card>
                <CardHeader><CardTitle>Localisation & Mandat</CardTitle></CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Adresse</FormLabel>
                            <FormControl><Input placeholder="Rue, Quartier..." {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ville</FormLabel>
                            <FormControl><Input placeholder="Ville" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    
                    <div className="md:col-span-2 pt-2">
                        <FormField
                            control={form.control}
                            name="ownerId"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Propriétaire (Client Odoo)</FormLabel>
                                <Select 
                                    onValueChange={(val) => field.onChange(Number(val))} 
                                    defaultValue={field.value ? field.value.toString() : undefined}
                                >
                                    <FormControl><SelectTrigger><SelectValue placeholder="Sélectionner un propriétaire..." /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {owners.length > 0 ? owners.map(owner => (
                                            <SelectItem key={owner.id} value={owner.id.toString()}>
                                                {owner.name}
                                            </SelectItem>
                                        )) : <SelectItem value="0" disabled>Aucun propriétaire trouvé</SelectItem>}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* CARTE 3: FINANCES */}
            <Card>
                <CardHeader><CardTitle>Conditions Financières</CardTitle></CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                    <FormField
                        control={form.control}
                        name="offerType"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type d'offre</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="À vendre">Vente</SelectItem>
                                    <SelectItem value="À louer">Location</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Prix / Loyer</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input type="number" className="pl-8" {...field} />
                                    <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">€</span>
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
                            <FormLabel>Commission</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input type="number" className="pl-8" {...field} />
                                    <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">€</span>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            {/* ACTION BAR */}
            <div className="flex items-center justify-end gap-4 sticky bottom-0 z-10 bg-background/80 backdrop-blur p-4 border-t md:static md:bg-transparent md:border-0 md:p-0">
                <Button type="submit" disabled={isSubmitting} size="lg" className="w-full md:w-auto shadow-md">
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {propertyId ? 'Sauvegarder les modifications' : 'Créer le bien immobilier'}
                </Button>
            </div>

          </form>
        </Form>
      </div>

      {/* --- COLONNE DROITE : IMAGES (1/3) --- */}
      <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-8">
        {propertyId ? (
            // MODE ÉDITION : Le gestionnaire est actif
            <ImageManager 
                propertyId={propertyId} 
                // Si l'objet initialData contient l'image principale (base64 ou url), on la passe
                // Note: Il faut s'assurer que getPropertyById retourne un champ 'image' si on veut la prévisualiser direct
                initialMainImage={initialData?.mainImage ? `data:image/png;base64,${initialData.mainImage}` : undefined} 
            />
        ) : (
            // MODE CRÉATION : Placeholder incitatif
            <Alert className="border-dashed bg-muted/30 py-8 flex flex-col items-center justify-center text-center">
                <div className="mb-4 p-4 bg-background rounded-full shadow-sm">
                    <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <AlertTitle className="mb-2 text-lg font-medium">Gestion des Photos</AlertTitle>
                <AlertDescription className="text-muted-foreground max-w-[250px] mx-auto">
                    Veuillez d'abord <strong>enregistrer les informations</strong> du bien (colonne de gauche) pour débloquer l'ajout de photos.
                </AlertDescription>
            </Alert>
        )}
      </div>

    </div>
  );
}