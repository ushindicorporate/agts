'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useMemo } from 'react';
import { Loader2, Save, User, Building2, DollarSign, Star } from 'lucide-react';
import { toast } from 'sonner';
import { createLeadAction } from '@/lib/actions/pipeline-actions';
import MultipleSelector, { Option } from "@/components/ui/multiselect";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const leadSchema = z.object({
  name: z.string().min(5, "Le titre doit être explicite"),
  partner_id: z.number().min(1, "Veuillez sélectionner un client"),
  property_id: z.number().optional(),
  expected_revenue: z.coerce.number().min(0),
  priority: z.enum(['0', '1', '2', '3']),
  description: z.string().optional(),
});

export default function LeadForm({ contacts, properties, onSuccess }: any) {
  const [loading, setLoading] = useState(false);

  // Mappings pour les sélecteurs de recherche
  const contactOptions = useMemo(() => 
    contacts.map((c: any) => ({ label: c.name, value: c.id.toString() })), [contacts]);
  
  const propertyOptions = useMemo(() => 
    properties.map((p: any) => ({ label: p.name, value: p.id.toString() })), [properties]);

  const form = useForm({
    resolver: zodResolver(leadSchema),
    defaultValues: { name: '', partner_id: 0, expected_revenue: 0, priority: '1', description: '' }
  });

  async function onSubmit(values: any) {
    setLoading(true);
    const res = await createLeadAction(values);
    setLoading(false);

    if (res.success) {
      toast.success("Opportunité créée dans Odoo");
      onSuccess();
    } else {
      toast.error("Erreur", { description: res.error });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white dark:bg-slate-950">
          <CardContent className="p-8 space-y-8">
            
            {/* Titre de l'opportunité */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Titre de l'affaire</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Achat Villa Gombe - M. Katumbi" className="h-12 dark:bg-slate-900" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-8">
              {/* Sélecteur Client (Recherche) */}
              <FormField
                control={form.control}
                name="partner_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 font-bold">
                        <User className="h-4 w-4 text-primary" /> Client Concerné
                    </FormLabel>
                    <MultipleSelector
                      value={contactOptions.filter((o: {label: string, value: string}) => o.value === field.value.toString())}
                      onChange={(opts) => field.onChange(Number(opts[0]?.value || 0))}
                      defaultOptions={contactOptions}
                      placeholder="Chercher un client..."
                      maxSelected={1}
                      className="dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sélecteur Bien (Optionnel) */}
              <FormField
                control={form.control}
                name="property_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 font-bold">
                        <Building2 className="h-4 w-4 text-primary" /> Bien Lié (Optionnel)
                    </FormLabel>
                    <MultipleSelector
                      value={propertyOptions.filter((o: {label: string, value: string}) => o.value === field.value?.toString())}
                      onChange={(opts) => field.onChange(Number(opts[0]?.value || 0))}
                      defaultOptions={propertyOptions}
                      placeholder="Lier à une propriété..."
                      maxSelected={1}
                      className="dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                    />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Revenu Espéré */}
              <FormField
                control={form.control}
                name="expected_revenue"
                render={({ field: { value, onChange, ...fieldProps } }) => ( // On extrait value et onChange
                    <FormItem>
                    <FormLabel className="flex items-center gap-2 font-bold text-emerald-600">
                        <DollarSign className="h-4 w-4" /> Revenu Espéré (USD)
                    </FormLabel>
                    <FormControl>
                        <Input 
                        type="number" 
                        className="h-12 dark:bg-slate-900 font-black text-lg" 
                        {...fieldProps} // On passe name, onBlur, ref, mais PAS la value d'origine
                        value={value === undefined || value === null ? "" : (value as number)} 
                        onChange={(e) => onChange(e.target.valueAsNumber || 0)}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

              {/* Priorité */}
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 font-bold">
                        <Star className="h-4 w-4 text-orange-500" /> Priorité AGTS
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger className="h-12 dark:bg-slate-900">
                                <SelectValue />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="0">Basse</SelectItem>
                            <SelectItem value="1">Moyenne</SelectItem>
                            <SelectItem value="2">Haute</SelectItem>
                            <SelectItem value="3">🔥 Très Haute (Hot)</SelectItem>
                        </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Notes internes / Besoins spécifiques</FormLabel>
                  <FormControl>
                    <Textarea rows={4} className="dark:bg-slate-900 resize-none" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button disabled={loading} className="w-full h-14 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 transition-all active:scale-95">
                {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
                Lancer l'opportunité
            </Button>

          </CardContent>
        </Card>
      </form>
    </Form>
  );
}