'use client'

import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Save, Building2, User, Users2, ShieldCheck, Mail, Phone, MapPin, Wallet } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import MultipleSelector, { Option } from "@/components/ui/multiselect";
import { upsertContact } from '@/lib/actions/crm-actions';

const formSchema = z.object({
  id: z.number().optional(),
  isCompany: z.boolean().default(false),
  name: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide").or(z.literal('')),
  phone: z.string().min(8, "Numéro requis"),
  parentId: z.number().optional(), // Utilisé pour lier Individu -> Société OU Société -> Représentant
  role: z.enum(['buyer', 'Vendeur', 'tenant', 'landlord', 'investor']),
  type: z.enum(['internal_agent', 'internal_agency', 'external_agent', 'external_agency', 'promoter', 'private']),
  budgetMin: z.coerce.number().min(0),
  budgetMax: z.coerce.number().min(0),
  preferredLocation: z.string().optional(),
  source: z.enum(['whatsapp', 'website', 'instagram', 'referral', 'other']),
  notes: z.string().optional(),
});

type ContactFormValues = z.infer<typeof formSchema>;

export default function ContactForm({ 
  initialData, 
  companies = [], 
  individuals = [],
  onSuccess 
}: { 
  initialData?: any, 
  companies?: any[], 
  individuals?: any[],
  onSuccess?: () => void 
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      isCompany: initialData?.isCompany || false,
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      role: initialData?.role || 'buyer',
      type: initialData?.type || 'private',
      parentId: initialData?.parentId || undefined,
      budgetMin: initialData?.budgetMin || 0,
      budgetMax: initialData?.budgetMax || 0,
      preferredLocation: initialData?.preferredLocation || '',
      source: initialData?.source || 'whatsapp',
      notes: initialData?.notes || '',
    }
  });

  const isCompany = form.watch("isCompany");

  // Options de recherche dynamiques
  const companyOptions = useMemo(() => 
    companies.map(c => ({ label: c.name, value: c.id.toString() })), [companies]);
  
  const individualOptions = useMemo(() => 
    individuals.map(i => ({ label: i.name, value: i.id.toString() })), [individuals]);
  
  useEffect(() => {
    // On ne réinitialise QUE si la valeur actuelle du formulaire est différente 
    // de la valeur initiale (donc si l'utilisateur a cliqué sur le switch)
    const isDifferentFromInitial = isCompany !== initialData?.isCompany;
    
    if (isDifferentFromInitial) {
      form.setValue("parentId", undefined);
    }
  }, [isCompany, initialData?.isCompany, form]);

  async function onSubmit(values: ContactFormValues) {
    setIsSubmitting(true);
    const result = await upsertContact(values as any);
    setIsSubmitting(false);

    if (result.success) {
      toast.success("Succès", { description: "La fiche a été synchronisée avec le système AGTS." });
      onSuccess?.();
    } else {
      toast.error("Erreur système", { description: result.error });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-24 md:pb-10">
        <input type="hidden" {...form.register("id")} />
        
        {/* --- TOGGLE ENTITÉ --- */}
        <div className="flex items-center justify-between p-6 bg-slate-900 dark:bg-primary rounded-3xl text-white shadow-xl transition-all">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    {isCompany ? <Building2 size={24} /> : <User size={24} />}
                </div>
                <div>
                    <h3 className="font-black text-lg leading-none mb-1">
                        {isCompany ? "Compte Société" : "Compte Individuel"}
                    </h3>
                    <p className="text-slate-300 dark:text-indigo-100 text-xs font-medium">
                        {isCompany ? "Enregistrez une personne morale" : "Enregistrez une personne physique"}
                    </p>
                </div>
            </div>
            <FormField
                control={form.control}
                name="isCompany"
                render={({ field }) => (
                    <FormControl>
                        <Switch 
                            checked={field.value} 
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-emerald-500 border-2 border-white/20"
                        />
                    </FormControl>
                )}
            />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          
          {/* CARTE 1: IDENTITÉ & LIAISON */}
          <Card className="md:col-span-2 border-none shadow-sm bg-white dark:bg-slate-900 rounded-xl">
            <CardHeader><CardTitle className="text-xl font-black">Informations & Relations</CardTitle></CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">{isCompany ? "Dénomination Sociale" : "Nom Complet"}</FormLabel>
                    <FormControl><Input placeholder="..." className="h-12 dark:bg-slate-800 rounded-xl" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* LIAISON DYNAMIQUE */}
              <FormField
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">
                      {isCompany ? "Représentant Légal (Individu)" : "Société rattachée"}
                    </FormLabel>
                    <FormControl>
                      <MultipleSelector
                        // FORCE LA RÉINITIALISATION LORS DU SWITCH
                        key={isCompany ? "select-individual" : "select-company"} 
                        
                        value={(isCompany ? individualOptions : companyOptions).filter(
                          (o) => o.value === field.value?.toString()
                        )}
                        onChange={(opts) => {
                          const val = opts[0]?.value;
                          field.onChange(val ? Number(val) : undefined);
                        }}
                        // ON FILTRE LES OPTIONS EN FONCTION DU SWITCH
                        defaultOptions={isCompany ? individualOptions : companyOptions}
                        
                        // RECHERCHE MANUELLE POUR ÉVITER LES BUGS DE MISE À JOUR
                        onSearch={async (query) => {
                          const targetOptions = isCompany ? individualOptions : companyOptions;
                          return targetOptions.filter((o) =>
                            o.label.toLowerCase().includes(query.toLowerCase())
                          );
                        }}
                        
                        placeholder={isCompany ? "Chercher un individu..." : "Chercher une société..."}
                        maxSelected={1}
                        hidePlaceholderWhenSelected
                        emptyIndicator={
                          <p className="text-center text-xs p-2 text-slate-500">
                            Aucun résultat trouvé dans le système.
                          </p>
                        }
                        className="dark:bg-slate-800 rounded-xl border-slate-200 dark:border-slate-800 shadow-sm"
                      />
                    </FormControl>
                    <FormDescription className="text-[10px]">
                      {isCompany 
                        ? "Liez cette société à une personne physique existante." 
                        : "Liez cet individu à une entreprise parente."}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input type="email" placeholder="contact@agts.cd" className="h-12 dark:bg-slate-800 rounded-xl" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone / WhatsApp</FormLabel>
                        <FormControl><Input placeholder="+243..." className="h-12 dark:bg-slate-800 rounded-xl" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>
            </CardContent>
          </Card>

          {/* CARTE 2: CLASSIFICATION AGTS */}
          <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-xl">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg font-black">Classification Système</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-primary font-bold">Catégorie Partenaire</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger className="h-12 dark:bg-slate-800 rounded-xl"><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="private">👤 Client Particulier</SelectItem>
                                <SelectItem value="internal_agent">💼 Agent Interne AGTS</SelectItem>
                                <SelectItem value="internal_agency">🏢 Agence / Filiale</SelectItem>
                                <SelectItem value="external_agency">🏢 Agence / Filiale (Externe)</SelectItem>
                                <SelectItem value="promoter">🏗️ Promoteur Immobilier</SelectItem>
                                <SelectItem value="external_agent">🤝 Apporteur Externe</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="font-bold text-slate-500">Rôle Commercial</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger className="h-12 dark:bg-slate-800 rounded-xl"><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="buyer">Acheteur Potential</SelectItem>
                                <SelectItem value="Vendeur">Vendeur / Propriétaire</SelectItem>
                                <SelectItem value="tenant">Locataire</SelectItem>
                                <SelectItem value="landlord">Bailleur</SelectItem>
                                <SelectItem value="investor">Investisseur</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormItem>
                    )}
                />
            </CardContent>
          </Card>

          {/* CARTE 3: BESOINS PROJET */}
          <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-xl">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-emerald-600" />
                    <CardTitle className="text-lg font-black">Besoins Immobiliers</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="budgetMin"
                        render={({ field: { value, onChange, ...fieldProps } }) => (
                        <FormItem>
                            <FormLabel className="text-xs">Budget Min ($)</FormLabel>
                            <FormControl>
                                <Input type="number" className="h-12 dark:bg-slate-800 font-bold rounded-xl" {...fieldProps} value={value} onChange={e => onChange(e.target.valueAsNumber || 0)} />
                            </FormControl>
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="budgetMax"
                        render={({ field: { value, onChange, ...fieldProps } }) => (
                        <FormItem>
                            <FormLabel className="text-xs">Budget Max ($)</FormLabel>
                            <FormControl>
                                <Input type="number" className="h-12 dark:bg-slate-800 font-bold rounded-xl text-emerald-600" {...fieldProps} value={value} onChange={e => onChange(e.target.valueAsNumber || 0)} />
                            </FormControl>
                        </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="preferredLocation"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-1 text-slate-500"><MapPin className="h-3 w-3" /> Zone de recherche</FormLabel>
                        <FormControl><Input placeholder="Ex: Gombe, Ngaliema..." className="h-12 dark:bg-slate-800 rounded-xl" {...field} /></FormControl>
                    </FormItem>
                    )}
                />
            </CardContent>
          </Card>
        </div>

        {/* BARRE D'ACTION FIXE MOBILE / DESKTOP */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 z-50 lg:relative lg:bg-transparent lg:border-none lg:p-0 flex justify-end">
            <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full sm:w-auto h-14 px-12 rounded-2xl bg-slate-900 dark:bg-primary text-white font-black shadow-2xl transition-all active:scale-95"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Traitement AGTS...
                    </>
                ) : (
                    <>
                        <Save className="mr-2 h-5 w-5" />
                        Finaliser l'inscription
                    </>
                )}
            </Button>
        </div>
      </form>
    </Form>
  );
}