"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale"; // Pour le français
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { createEventAction } from "../actions";

const formSchema = z.object({
  name: z.string().min(3, "Titre requis"),
  start_date: z.date().refine(date => date instanceof Date, { message: "Date requise" }),
  start_time: z.string().regex(/^\d{2}:\d{2}$/, "HH:MM"),
  duration: z.coerce.number().min(0.5),
  location: z.string().optional(),
});

export function NewEventDialog({ onEventCreated }: { onEventCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      start_time: "09:00",
      duration: 1,
      location: "",
    },
  });

  async function onSubmit(values: any) {
    setIsSubmitting(true);
    const res = await createEventAction(values);
    setIsSubmitting(false);

    if (res.success) {
      setOpen(false);
      form.reset();
      onEventCreated(); // Rafraîchir la liste parente
      alert("Rendez-vous ajouté !");
    } else {
      alert("Erreur: " + res.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-slate-900">Nouveau RDV</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Planifier un rendez-vous</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Sujet</FormLabel>
                <FormControl><Input placeholder="Visite Villa, Essai Prado..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-4">
              {/* Date Picker */}
              <FormField control={form.control} name="start_date" render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? format(field.value, "PPP", { locale: fr }) : <span>Choisir date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="start_time" render={({ field }) => (
                <FormItem>
                  <FormLabel>Heure</FormLabel>
                  <FormControl><Input type="time" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="duration" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durée (h)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.5" {...field} value={field.value as number ?? ''}  onChange={e => field.onChange(e.target.value)} />
                    </FormControl>
                  </FormItem>
                )} />
                
                <FormField control={form.control} name="location" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lieu</FormLabel>
                    <FormControl><Input placeholder="Agence Kinshasa" {...field} /></FormControl>
                  </FormItem>
                )} />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmer
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}