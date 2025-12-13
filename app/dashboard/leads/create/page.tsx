"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { createLeadAction } from "../actions/crm-actions";

const formSchema = z.object({
  name: z.string().min(3, "Titre requis"),
  contact_name: z.string().min(2, "Nom requis"),
  email: z.string().optional(),
  phone: z.string().min(8, "Téléphone requis"),
  expected_revenue: z.coerce.number(),
  priority: z.enum(["0", "1", "2", "3"]),
  description: z.string().optional(),
});

export default function CreateLeadPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      contact_name: "",
      email: "",
      phone: "",
      expected_revenue: 0,
      priority: "1",
      description: "",
    },
  });

  async function onSubmit(values: any) {
    setIsSubmitting(true);
    const res = await createLeadAction(values);
    setIsSubmitting(false);

    if (res.success) {
        alert("Prospect enregistré !");
        router.push("/dashboard/leads");
    } else {
        alert("Erreur: " + res.error);
    }
  }

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <h1 className="text-2xl font-bold mb-6">Nouveau Prospect</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          <Card>
            <CardHeader><CardTitle>Détails du contact</CardTitle></CardHeader>
            <CardContent className="grid gap-4">
               <FormField control={form.control} name="contact_name" render={({ field }) => (
                 <FormItem>
                   <FormLabel>Nom du client</FormLabel>
                   <FormControl><Input placeholder="M. Kabongo" {...field} /></FormControl>
                   <FormMessage />
                 </FormItem>
               )} />
               
               <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl><Input placeholder="+243..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (Optionnel)</FormLabel>
                      <FormControl><Input placeholder="client@gmail.com" {...field} /></FormControl>
                    </FormItem>
                  )} />
               </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>L'Opportunité</CardTitle></CardHeader>
            <CardContent className="grid gap-4">
               <FormField control={form.control} name="name" render={({ field }) => (
                 <FormItem>
                   <FormLabel>Sujet / Intérêt</FormLabel>
                   <FormControl><Input placeholder="Ex: Recherche Villa Gombe ou Toyota Prado" {...field} /></FormControl>
                   <FormMessage />
                 </FormItem>
               )} />

               <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="expected_revenue" render={({ field }) => (
                   <FormItem>
                     <FormLabel>Budget estimé ($)</FormLabel>
                     <FormControl>
                        <Input type="number" {...field} value={field.value as number ?? ''} onChange={e => field.onChange(e.target.value)} />
                     </FormControl>
                   </FormItem>
                 )} />

                 <FormField control={form.control} name="priority" render={({ field }) => (
                   <FormItem>
                     <FormLabel>Priorité</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                       <SelectContent>
                         <SelectItem value="0">Faible</SelectItem>
                         <SelectItem value="1">Moyenne</SelectItem>
                         <SelectItem value="2">Haute</SelectItem>
                         <SelectItem value="3">Urgente 🔥</SelectItem>
                       </SelectContent>
                     </Select>
                   </FormItem>
                 )} />
               </div>

               <FormField control={form.control} name="description" render={({ field }) => (
                 <FormItem>
                   <FormLabel>Notes internes</FormLabel>
                   <FormControl>
                     <Textarea placeholder="Détails de la demande..." className="min-h-[100px]" {...field} />
                   </FormControl>
                 </FormItem>
               )} />
            </CardContent>
          </Card>

          <Button type="submit" disabled={isSubmitting} className="w-full bg-slate-900">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Créer l'opportunité
          </Button>

        </form>
      </Form>
    </div>
  );
}