'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, UserPlus, CheckIcon, ChevronDownIcon } from 'lucide-react';
import { toast } from 'sonner';

import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { upsertContact } from '@/lib/actions/crm-actions';

// --- LISTE DES TYPES DE PARTENAIRES ---
const partnerTypes = [
  { label: "Private", value: "private" },
  { label: "Agent Interne", value: "internal_agent" },
  { label: "Agence Interne", value: "internal_agency" },
  { label: "Agent Externe", value: "external_agent" },
  { label: "Agence Externe", value: "external_agency" },
  { label: "Promoteur Immobilier", value: "promoter" },
];

// --- SCHÉMA ZOD ---
const quickContactSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide").optional().or(z.literal('')),
  phone: z.string().min(8, "Téléphone requis"),
  
  // Le Type est maintenant dynamique selon la liste ci-dessus
  type: z.string().min(1, "Le type est requis"),
  
  role: z.enum(['seller', 'landlord', 'investor', 'buyer']), 
});

type QuickContactValues = z.infer<typeof quickContactSchema>;

interface Props {
  onSuccess: (newContact: { id: number; name: string }) => void;
}

export default function QuickContactDialog({ onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // État pour l'ouverture du Combobox
  const [openCombobox, setOpenCombobox] = useState(false);

  const form = useForm<QuickContactValues>({
    resolver: zodResolver(quickContactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: 'seller',
      type: 'client', // Valeur par défaut
    }
  });

  async function onSubmit(values: QuickContactValues) {
    setIsSubmitting(true);
    // @ts-ignore
    const result = await upsertContact(values);
    setIsSubmitting(false);

    if (result.success && result.id) {
      toast.success("Partenaire créé avec succès");
      onSuccess({ id: result.id, name: values.name });
      setOpen(false);
      form.reset();
    } else {
      toast.error("Erreur création", { description: result.error });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0" title="Nouveau Partenaire">
            <UserPlus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-visible"> {/* overflow-visible pour laisser le popover sortir si besoin */}
        <DialogHeader>
            <DialogTitle>Nouveau Partenaire</DialogTitle>
            <DialogDescription>Ajout rapide d'un propriétaire ou agent.</DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
                
                {/* 1. NOM */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nom complet</FormLabel>
                        <FormControl><Input placeholder="Ex: M. Kouassi" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                {/* 2. TYPE (COMBOBOX RECHERCHABLE) */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Type de Partenaire</FormLabel>
                      <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openCombobox}
                              className={cn(
                                "w-full justify-between font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? partnerTypes.find((t) => t.value === field.value)?.label
                                : "Sélectionner un type..."}
                              <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Rechercher un type..." />
                            <CommandList>
                              <CommandEmpty>Aucun type trouvé.</CommandEmpty>
                              <CommandGroup>
                                {partnerTypes.map((type) => (
                                  <CommandItem
                                    value={type.label} // Recherche sur le label
                                    key={type.value}
                                    onSelect={() => {
                                      form.setValue("type", type.value);
                                      setOpenCombobox(false);
                                    }}
                                  >
                                    <CheckIcon
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        type.value === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {type.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* 3. EMAIL & PHONE */}
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Téléphone</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>

                {/* 4. RÔLE (Select classique) */}
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Rôle Transaction</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="seller">Vendeur</SelectItem>
                                <SelectItem value="landlord">Bailleur (Loueur)</SelectItem>
                                <SelectItem value="investor">Investisseur</SelectItem>
                                <SelectItem value="buyer">Acheteur</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormItem>
                    )}
                />

                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Créer et Sélectionner
                </Button>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}