'use client'

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Loader2, KeyRound, Mail, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { inviteNewUser } from '@/lib/actions/user-management-actions';

export default function InviteUserDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const res = await inviteNewUser({
      email: formData.get('email') as string,
      full_name: formData.get('full_name') as string,
      role: formData.get('role') as string,
      password: formData.get('password') as string, // Nouveau
    });

    setLoading(false);
    if (res.success) {
      toast.success("Utilisateur configuré avec succès");
      setOpen(false);
      window.location.reload();
    } else {
      toast.error("Erreur", { description: res.error });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-2xl font-black bg-slate-900 dark:bg-primary h-12 px-6 shadow-lg hover:scale-105 transition-all">
          <UserPlus className="mr-2 h-5 w-5" /> Ajouter un membre
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-[2.5rem] border-none dark:bg-slate-950 p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tight">Nouvel Accès AGTS</DialogTitle>
          <DialogDescription>Configurez le compte de votre collaborateur.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nom Complet</Label>
              <Input name="full_name" required className="h-12 rounded-xl dark:bg-slate-900 border-slate-200 dark:border-slate-800" placeholder="ex: Marc Bolamba" />
            </div>
            
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Professionnel</Label>
              <div className="relative">
                <Input name="email" type="email" required className="h-12 rounded-xl dark:bg-slate-900 pl-10 border-slate-200 dark:border-slate-800" placeholder="m.bolamba@agts.cd" />
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rôle AGTS</Label>
              <Select name="role" defaultValue="agent">
                <SelectTrigger className="h-12 rounded-xl dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-slate-900 border-slate-800">
                  <SelectItem value="agent">Agent Commercial</SelectItem>
                  <SelectItem value="finance">Gestionnaire Finance</SelectItem>
                  <SelectItem value="admin">Administrateur</SelectItem>
                  <SelectItem value="superadmin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mot de passe temporaire (Optionnel)</Label>
              <div className="relative">
                <Input name="password" type="text" className="h-12 rounded-xl dark:bg-slate-900 pl-10 border-slate-200 dark:border-slate-800 font-mono" placeholder="Laisser vide pour envoi par mail" />
                <KeyRound className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
              </div>
              <p className="text-[10px] text-slate-500 italic">Si rempli, l'utilisateur pourra se connecter immédiatement avec ce code.</p>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 transition-all active:scale-95">
            {loading ? <Loader2 className="animate-spin mr-2" /> : <ShieldCheck className="mr-2" />}
            Activer l'accès
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}