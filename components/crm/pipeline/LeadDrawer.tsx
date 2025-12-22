'use client'

import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import ActivityTimeline from '@/components/crm/ActivityTimeline';
import { Badge } from '@/components/ui/badge';
import { Loader2, DollarSign, User } from 'lucide-react';
import { getLeadById } from '@/lib/actions/pipeline-actions';
import { getActivityHistory } from '@/lib/actions/crm-actions';

interface LeadDrawerProps {
  leadId: number | null;
  open: boolean;
  onClose: () => void;
}

export default function LeadDrawer({ leadId, open, onClose }: LeadDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ lead: any, history: any[] } | null>(null);

  useEffect(() => {
    if (open && leadId) {
      setLoading(true);
      Promise.all([
        getLeadById(leadId),
        getActivityHistory('crm.lead', leadId)
      ]).then(([lead, history]) => {
        setData({ lead, history });
        setLoading(false);
      });
    } else {
        setData(null); // Reset quand on ferme
    }
  }, [open, leadId]);

  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        {loading || !data ? (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        ) : (
            <div className="space-y-6">
                <SheetHeader>
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{data.lead.stageName}</Badge>
                        <span className="text-xs text-muted-foreground">Créé le {new Date(data.lead.createDate).toLocaleDateString()}</span>
                    </div>
                    <SheetTitle className="text-xl">{data.lead.name}</SheetTitle>
                    <SheetDescription className="flex items-center gap-4 pt-2">
                        <span className="flex items-center gap-1 text-green-600 font-bold">
                            <DollarSign className="h-4 w-4" /> {data.lead.expectedRevenue.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                            <User className="h-4 w-4" /> {data.lead.partnerName}
                        </span>
                    </SheetDescription>
                </SheetHeader>

                {/* Historique Timeline */}
                <div className="pt-4 border-t">
                    <h3 className="text-sm font-semibold mb-4">Historique & Activités</h3>
                    {/* On réutilise ton composant Timeline existant */}
                    <ActivityTimeline 
                        partnerId={data.lead.id} 
                        history={data.history} 
                        // Il faudra peut-être adapter ActivityTimeline pour qu'il sache qu'il doit poster sur 'crm.lead' et pas 'res.partner'
                        // Ajoute une prop 'model="crm.lead"' à ton ActivityTimeline
                        resModel="crm.lead"
                    />
                </div>
            </div>
        )}
      </SheetContent>
    </Sheet>
  );
}