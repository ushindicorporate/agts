'use client'

import { useState } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogTrigger, DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, Loader2, Save, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { resetUserPassword } from '@/lib/actions/user-management-actions';

export default function ResetPasswordDialog({ userId, userName }: { userId: string, userName: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');

  async function handleReset() {
    if (password.length < 6) {
      return toast.error("Le mot de passe doit faire au moins 6 caractères");
    }

    setLoading(true);
    const res = await resetUserPassword(userId, password);
    setLoading(false);

    if (res.success) {
      toast.success(`Mot de passe de ${userName} mis à jour`);
      setOpen(false);
      setPassword('');
    } else {
      toast.error("Erreur", { description: res.error });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start text-slate-600 dark:text-slate-400 font-bold hover:text-primary">
          <KeyRound className="mr-2 h-4 w-4" /> Changer mot de passe
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-[2.5rem] border-none dark:bg-slate-950 p-8 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
                <ShieldAlert size={20} />
            </div>
            <DialogTitle className="text-xl font-black">Réinitialisation</DialogTitle>
          </div>
          <DialogDescription className="font-medium text-slate-500">
            Définissez un nouveau mot de passe pour <strong>{userName}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nouveau mot de passe</Label>
            <div className="relative">
                <Input 
                  type="text" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl dark:bg-slate-900 border-slate-200 dark:border-slate-800 pl-10 font-mono"
                  placeholder="••••••••"
                />
                <KeyRound className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
            </div>
          </div>

          <Button 
            onClick={handleReset} 
            disabled={loading || !password}
            className="w-full h-14 rounded-2xl bg-slate-900 dark:bg-primary text-white font-black text-lg shadow-xl transition-all active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
            Confirmer le changement
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}