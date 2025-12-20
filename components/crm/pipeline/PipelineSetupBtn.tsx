'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { initializePipeline } from '@/lib/actions/pipeline-settings';

export default function PipelineSetupBtn() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSetup = async () => {
    const confirm = window.confirm("Cela va créer les colonnes standards (Nouveau, Visite, Vendu...) dans Odoo si elles n'existent pas. Continuer ?");
    if (!confirm) return;

    setLoading(true);
    const res = await initializePipeline();
    setLoading(false);

    if (res.success) {
      toast.success("Pipeline configuré !", { description: res.message });
      router.refresh(); // Rafraîchit la page pour afficher les nouvelles colonnes
    } else {
      toast.error("Erreur", { description: res.error });
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleSetup} disabled={loading}>
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Settings2 className="mr-2 h-4 w-4" />}
      Config. Standard
    </Button>
  );
}