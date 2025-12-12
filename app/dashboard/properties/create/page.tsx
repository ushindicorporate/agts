"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, Loader2, Upload } from "lucide-react";
import Link from "next/link";
import { ImageUploadPlaceholder } from "@/components/ImageUploadPlaceholder";

// Composants shadcn
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

// Schéma de validation (Zod)
const formSchema = z.object({
  name: z.string().min(5, "Le titre doit faire au moins 5 caractères"),
  transaction_type: z.enum(["sale", "rent"]),
  property_type: z.string().min(1, "Selectionnez un type"),
  price: z.coerce.number().min(1, "Le prix est requis"),
  availability_date: z.string().optional(),
  
  address: z.string().min(5, "Adresse requise"),
  city: z.string().min(2, "Ville requise"),
  zone: z.string().optional(),
  
  surface: z.coerce.number().min(0),
  bedrooms: z.coerce.number().min(0),
  bathrooms: z.coerce.number().min(0),
  description: z.string().optional(),
});

export default function CreatePropertyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Initialisation du formulaire

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            transaction_type: "sale",
            property_type: "house",
            price: 0,
            surface: 0,
            bedrooms: 0,
            bathrooms: 0,
            address: "",
            city: "Kinshasa",
            description: "",
        },
    });

  // 2. Gestion de la soumission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    console.log("Envoi vers Odoo :", values);

    // TODO: Appel API réel vers Odoo ici
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    router.push("/dashboard/properties");
  }

  return (
    <div className="max-w-5xl mx-auto pb-24">
      
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild className="rounded-full h-8 w-8">
            <Link href="/dashboard/properties">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Nouveau Mandat</h1>
            <p className="text-muted-foreground">Formulaire synchronisé Odoo</p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          <div className="grid gap-8 md:grid-cols-3">
            
            {/* Colonne Gauche (Principale) */}
            <div className="md:col-span-2 space-y-8">
              
              {/* Carte: Informations Générales */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations principales</CardTitle>
                  <CardDescription>Détails de base pour l'annonce publique</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titre de l'annonce</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Villa Duplex avec Piscine - Cocody" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="transaction_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type de transaction</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selectionner" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="sale">Vente</SelectItem>
                              <SelectItem value="rent">Location</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prix ($)</FormLabel>
                          <FormControl>
                            <Input type="number" 
                                placeholder="0"
                                {...field}
                                value={field.value as number ?? ''} 
                                onChange={(e) => field.onChange(e.target.value)} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Carte: Description & Média */}
              <Card>
                <CardHeader>
                  <CardTitle>Détails & Photos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description détaillée</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Décrivez les atouts du bien..." 
                            className="min-h-[150px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Composant Custom (Pas shadcn natif) */}
                  <div className="space-y-2">
                    <FormLabel>Photos du bien</FormLabel>
                    <ImageUploadPlaceholder />
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Colonne Droite (Secondaire) */}
            <div className="space-y-8">
              
              {/* Carte: Caractéristiques */}
              <Card>
                <CardHeader>
                  <CardTitle>Caractéristiques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="property_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de bien</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selectionner" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="house">Maison / Villa</SelectItem>
                            <SelectItem value="apartment">Appartement</SelectItem>
                            <SelectItem value="land">Terrain</SelectItem>
                            <SelectItem value="commercial">Bureau / Commerce</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="surface"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Surface (m²)</FormLabel>
                          <FormControl>
                            <Input type="number" 
                                placeholder="0"
                                {...field}
                                value={field.value as number ?? ''} 
                                onChange={(e) => field.onChange(e.target.value)} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bedrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chambres</FormLabel>
                          <FormControl>
                            <Input type="number" 
                                placeholder="0"
                                {...field}
                                value={field.value as number ?? ''} 
                                onChange={(e) => field.onChange(e.target.value)} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Carte: Localisation */}
              <Card>
                <CardHeader>
                  <CardTitle>Localisation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse complète</FormLabel>
                        <FormControl>
                          <Input placeholder="Rue, Porte..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ville / Commune</FormLabel>
                        <FormControl>
                          <Input placeholder="Abidjan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="zone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zone (Optionnel)</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Riviera 3" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

            </div>
          </div>

          {/* Footer Flottant */}
          <div className="fixed bottom-0 left-0 right-0 border-t bg-background/80 p-4 backdrop-blur-sm md:pl-64 z-50">
            <div className="container mx-auto flex max-w-5xl items-center justify-end gap-4">
              <Button 
                variant="ghost" 
                type="button" 
                onClick={() => router.back()}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Enregistrement..." : "Créer le mandat"}
              </Button>
            </div>
          </div>

        </form>
      </Form>
    </div>
  );
}