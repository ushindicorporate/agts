'use client'

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Save, User, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { updateMyProfile } from '@/lib/actions/user-actions';

const profileSchema = z.object({
  full_name: z.string().min(3, "Nom trop court"),
  phone_number: z.string().min(8, "Numéro trop court"),
});

export default function ProfileForm({ profile }: { profile: any }) {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile.full_name || '',
      phone_number: profile.phone_number || '',
    }
  });

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    setLoading(true);
    const res = await updateMyProfile(values);
    setLoading(false);

    if (res.success) {
      toast.success("Profil mis à jour");
    } else {
      toast.error("Erreur système");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black uppercase text-slate-400">Nom Complet</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input {...field} className="h-12 rounded-xl dark:bg-slate-800 pl-10" />
                    <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black uppercase text-slate-400">Téléphone Direct</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input {...field} placeholder="+243..." className="h-12 rounded-xl dark:bg-slate-800 pl-10" />
                    <Phone className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2 opacity-60">
            <FormLabel className="text-xs font-black uppercase text-slate-400">Adresse Email (Non modifiable)</FormLabel>
            <div className="relative">
              <Input value={profile.email} disabled className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800 pl-10 cursor-not-allowed" />
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={loading} className="rounded-xl h-12 px-8 font-black bg-slate-900 dark:bg-primary shadow-xl shadow-indigo-500/10">
            {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-5 w-5" />}
            Sauvegarder les modifications
          </Button>
        </div>
      </form>
    </Form>
  );
}