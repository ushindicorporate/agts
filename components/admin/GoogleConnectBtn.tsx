// components/settings/GoogleConnectBtn.tsx
'use client'

import { getGoogleAuthUrl } from "@/lib/actions/google-auth-actions";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Globe, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function GoogleConnectBtn({ isConnected }: { isConnected: boolean }) {
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    const url = await getGoogleAuthUrl();
    window.location.href = url; // Redirection vers Google
  };

  return (
    <Button 
      onClick={handleConnect}
      disabled={loading || isConnected}
      className={cn(
        "rounded-2xl h-14 px-8 font-black text-lg",
        isConnected ? "bg-emerald-500" : "bg-primary"
      )}
    >
      {loading ? <Loader2 className="animate-spin mr-2" /> : <Globe className="mr-2 h-5 w-5" />}
      {isConnected ? "Google Connecté" : "Lier mon compte Google"}
    </Button>
  );
}