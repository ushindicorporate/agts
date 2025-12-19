'use client'

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

// Composants Shadcn
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { REContact } from '@/lib/types/real-estate';
import { upsertContact } from '@/lib/actions/crm-actions';

const numberField = z.coerce.number().min(0) as z.ZodNumber;

const formSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide").or(z.literal('')),
  phone: z.string().min(8, "Numéro trop court"),
  role: z.enum(['buyer', 'seller', 'tenant', 'landlord', 'investor']),
  budgetMin: numberField,
  budgetMax: numberField,
  preferredLocation: z.string().optional(),
  source: z.enum(['whatsapp', 'website', 'instagram', 'referral', 'other']),
  notes: z.string().optional(),
});

// On extrait le type automatiquement du schéma
type ContactFormValues = z.infer<typeof formSchema>;

interface ContactFormProps {
  initialData?: REContact;
  onSuccess?: () => void;
}

export default function ContactForm({ initialData, onSuccess }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      email: '',
      phone: '',
      role: 'buyer',
      budgetMin: 0,
      budgetMax: 0,
      preferredLocation: '',
      source: 'website',
      notes: ''
    }
  });

  async function onSubmit(values: ContactFormValues) {
    setIsSubmitting(true);
    const result = await upsertContact(values as REContact);
    
    setIsSubmitting(false);

    if (result.success) {
      toast.success("Contact enregistré", {
        description: "Les données ont été synchronisées avec Odoo.",
      });
      if (!initialData) {
        form.reset();
      }
      if (onSuccess) onSuccess();
    } else {
      toast.error("Erreur de sauvegarde", {
        description: typeof result.error === 'string' ? result.error : "Une erreur inconnue est survenue",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          
          {/* Carte Identité */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Identité du Contact</CardTitle>
              <CardDescription>Informations générales du prospect.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom complet</FormLabel>
                    <FormControl>
                      <Input placeholder="Jean Dupont" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rôle</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="buyer">Acheteur</SelectItem>
                        <SelectItem value="seller">Vendeur</SelectItem>
                        <SelectItem value="tenant">Locataire</SelectItem>
                        <SelectItem value="landlord">Bailleur</SelectItem>
                        <SelectItem value="investor">Investisseur</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="client@exemple.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input placeholder="+33 6 00 00 00 00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Carte Projet Immo */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Critères de recherche</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="budgetMin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget Min</FormLabel>
                      <FormControl>
                        {/* type="number" est important pour l'UX mobile */}
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="budgetMax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget Max</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="preferredLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localisation</FormLabel>
                    <FormControl>
                      <Input placeholder="Quartier, Ville..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Carte Source & Notes */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Suivi & Origine</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source du Lead</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="website">Site Web</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="referral">Parrainage</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes internes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Infos importantes sur le client..." 
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4">
            {/* Bouton Annuler optionnel si on veut */}
            {onSuccess && (
                <Button variant="outline" type="button" onClick={() => window.history.back()}>
                    Annuler
                </Button>
            )}
            <Button type="submit" disabled={isSubmitting} size="lg">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Synchronisation...' : <><Save className="mr-2 h-4 w-4" /> Enregistrer Contact</>}
            </Button>
        </div>
      </form>
    </Form>
  );
}