'use client'

import { Button } from "@/components/ui/button";
import { MailCheck, Loader2 } from "lucide-react";
import { useState } from "react";
import { resendInvitation } from "@/lib/actions/user-management-actions";
import { toast } from "sonner";

export function ResendInviteButton({ email }: { email: string }) {
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    const res = await resendInvitation(email);
    setLoading(false);
    
    if (res.success) toast.success("Mail d'invitation renvoyé !");
    else toast.error("Erreur lors de l'envoi");
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="hidden md:flex rounded-xl font-bold text-[10px] uppercase tracking-tight h-8 gap-2 border-slate-200 dark:border-slate-800"
      onClick={handleResend}
      disabled={loading}
    >
      {loading ? <Loader2 size={12} className="animate-spin" /> : <MailCheck size={12} />}
      Renvoyer mail
    </Button>
  );
}