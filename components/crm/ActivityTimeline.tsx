'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, Loader2 } from 'lucide-react'; // Ajout Loader2
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { addLogNote } from '@/lib/actions/crm-actions';

interface TimelineProps {
  partnerId: number; // C'est l'ID de l'objet (Contact ou Lead)
  history: any[];
  resModel?: string; // NOUVEAU PROP : Modèle Odoo ('res.partner' par défaut)
}

export default function ActivityTimeline({ partnerId, history, resModel = 'res.partner' }: TimelineProps) {
  const [note, setNote] = useState('');
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();

  const handleSend = async () => {
    if (!note.trim()) return;
    setIsSending(true);
    
    // Appel avec le modèle dynamique
    const result = await addLogNote(partnerId, note, resModel);
    
    if (result.success) {
      setNote('');
      toast.success("Note ajoutée");
      router.refresh(); 
    } else {
      toast.error("Erreur lors de l'envoi");
    }
    setIsSending(false);
  };

  const createMarkup = (htmlContent: string) => {
    return { __html: htmlContent };
  };

  return (
    <Card className="h-full flex flex-col border-none shadow-none sm:border sm:shadow-sm"> {/* Ajustement CSS pour intégration dans Drawer */}
      <CardHeader className="pb-3 px-0 sm:px-6"> {/* Padding ajusté */}
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <CardTitle>Fil d'activité</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4 px-0 sm:px-6">
        
        {/* Zone de saisie */}
        <div className="flex flex-col gap-2">
          <Textarea 
            placeholder={`Ajouter une note sur ce ${resModel === 'crm.lead' ? 'lead' : 'contact'}...`}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-20 resize-none text-sm"
          />
          <div className="flex justify-end">
             <Button size="sm" onClick={handleSend} disabled={isSending || !note.trim()}>
                {isSending ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Send className="mr-2 h-3 w-3" />}
                {isSending ? 'Envoi...' : 'Ajouter Note'}
            </Button>
          </div>
        </div>

        {/* Liste Historique */}
        <div className="mt-4 flex-1">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3">Historique récent</h4>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-6">
              {history.map((msg) => (
                <div key={msg.id} className="flex gap-3 relative group">
                  {/* Ligne verticale */}
                  <div className="absolute left-[18px] top-10 -bottom-6 w-px bg-border last:hidden group-last:hidden"></div>
                  
                  <Avatar className="h-9 w-9 border shrink-0">
                    <AvatarFallback className="text-xs bg-muted font-medium text-foreground/70">
                        {msg.author ? msg.author.substring(0, 2).toUpperCase() : 'SY'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate pr-2">{msg.author}</p>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {new Date(msg.date).toLocaleDateString('fr-FR', {
                            day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit'
                        })}
                      </span>
                    </div>
                    
                    <div 
                        className="text-sm text-foreground/80 bg-muted/40 p-3 rounded-md prose prose-sm max-w-none prose-p:my-0 prose-p:leading-tight wrap-break-word"
                        dangerouslySetInnerHTML={createMarkup(msg.body)}
                    />
                  </div>
                </div>
              ))}
              
              {history.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground bg-muted/10 rounded-lg border border-dashed">
                    <MessageSquare className="h-8 w-8 mb-2 opacity-20" />
                    <p className="text-sm">Aucune activité récente.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}