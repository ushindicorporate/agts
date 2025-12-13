"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ImageUpload } from "@/components/image-upload";
import { createVehicleAction } from "../actions/vehicle-actions";

const formSchema = z.object({
  brand: z.string().min(2, "Marque requise"),
  model: z.string().min(2, "Modèle requis"),
  year: z.coerce.number().min(1990),
  price: z.coerce.number().min(0),
  mileage: z.coerce.number().min(0),
  fuel_type: z.enum(["petrol", "diesel", "hybrid", "electric"]),
  transmission: z.enum(["manual", "automatic"]),
  status: z.enum(["available", "rented", "sold"]),
  image: z.string().optional(),
});

export default function CreateVehiclePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brand: "",
      model: "",
      year: 2024,
      price: 0,
      mileage: 0,
      fuel_type: "petrol",
      transmission: "automatic",
      status: "available",
      image: undefined,
    },
  });

  async function onSubmit(values: any) {
    setIsSubmitting(true);
    const res = await createVehicleAction(values);
    setIsSubmitting(false);

    if (res.success) {
        alert("Véhicule ajouté !");
        router.push("/dashboard/vehicles");
    } else {
        alert("Erreur: " + res.error);
    }
  }

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <h1 className="text-2xl font-bold mb-6">Ajouter un Véhicule</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          <Card>
            <CardHeader><CardTitle>Informations Véhicule</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
               <FormField control={form.control} name="brand" render={({ field }) => (
                 <FormItem>
                   <FormLabel>Marque</FormLabel>
                   <FormControl><Input placeholder="Toyota" {...field} /></FormControl>
                   <FormMessage />
                 </FormItem>
               )} />
               <FormField control={form.control} name="model" render={({ field }) => (
                 <FormItem>
                   <FormLabel>Modèle</FormLabel>
                   <FormControl><Input placeholder="Prado" {...field} /></FormControl>
                   <FormMessage />
                 </FormItem>
               )} />
               <FormField control={form.control} name="year" render={({ field }) => (
                 <FormItem>
                   <FormLabel>Année</FormLabel>
                   <FormControl>
                     <Input type="number" {...field} value={field.value as number ?? ''} onChange={e => field.onChange(e.target.value)} />
                   </FormControl>
                 </FormItem>
               )} />
               <FormField control={form.control} name="price" render={({ field }) => (
                 <FormItem>
                   <FormLabel>Prix ($)</FormLabel>
                   <FormControl>
                     <Input type="number" {...field} value={field.value as number ?? ''} onChange={e => field.onChange(e.target.value)} />
                   </FormControl>
                 </FormItem>
               )} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Détails Techniques</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
               <FormField control={form.control} name="fuel_type" render={({ field }) => (
                 <FormItem>
                   <FormLabel>Carburant</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                     <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                     <SelectContent>
                       <SelectItem value="petrol">Essence</SelectItem>
                       <SelectItem value="diesel">Diesel</SelectItem>
                       <SelectItem value="hybrid">Hybride</SelectItem>
                     </SelectContent>
                   </Select>
                 </FormItem>
               )} />
               <FormField control={form.control} name="transmission" render={({ field }) => (
                 <FormItem>
                   <FormLabel>Boite</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                     <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                     <SelectContent>
                       <SelectItem value="manual">Manuelle</SelectItem>
                       <SelectItem value="automatic">Automatique</SelectItem>
                     </SelectContent>
                   </Select>
                 </FormItem>
               )} />
               <div className="col-span-2">
                 <FormField control={form.control} name="image" render={({ field }) => (
                   <FormItem>
                     <FormLabel>Photo</FormLabel>
                     <FormControl><ImageUpload value={field.value} onChange={field.onChange} /></FormControl>
                   </FormItem>
                 )} />
               </div>
            </CardContent>
          </Card>

          <Button type="submit" disabled={isSubmitting} className="w-full bg-slate-900">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enregistrer le véhicule
          </Button>

        </form>
      </Form>
    </div>
  );
}