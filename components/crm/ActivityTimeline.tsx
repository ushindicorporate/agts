'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { addLogNote } from '@/lib/actions/crm-actions';

interface TimelineProps {
  partnerId: number;
  history: any[]; // On typerait mieux idéalement
}

export default function ActivityTimeline({ partnerId, history }: TimelineProps) {
  const [note, setNote] = useState('');
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();

  const handleSend = async () => {
    if (!note.trim()) return;
    setIsSending(true);
    
    const result = await addLogNote(partnerId, note);
    
    if (result.success) {
      setNote('');
      toast.success("Note ajoutée");
      router.refresh(); // Rafraîchit la liste des messages
    } else {
      toast.error("Erreur lors de l'envoi");
    }
    setIsSending(false);
  };

  // Fonction pour nettoyer le HTML d'Odoo (très basique, idéalement utiliser dompurify)
  const createMarkup = (htmlContent: string) => {
    return { __html: htmlContent };
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <CardTitle>Fil d'activité</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4">
        {/* Zone de saisie */}
        <div className="flex gap-2">
          <Textarea 
            placeholder="Ajouter une note interne..." 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-20 resize-none text-sm"
          />
        </div>
        <div className="flex justify-end">
             <Button size="sm" onClick={handleSend} disabled={isSending || !note.trim()}>
                <Send className="mr-2 h-3 w-3" /> 
                {isSending ? 'Envoi...' : 'Ajouter Note'}
            </Button>
        </div>

        {/* Liste Historique */}
        <div className="mt-4 flex-1">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3">Historique récent</h4>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-6">
              {history.map((msg) => (
                <div key={msg.id} className="flex gap-3 relative">
                  {/* Ligne verticale */}
                  <div className="absolute left-[18px] top-10 -bottom-6 w-px bg-border last:hidden"></div>
                  
                  <Avatar className="h-9 w-9 border">
                    <AvatarFallback className="text-xs bg-muted">
                        {msg.author.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{msg.author}</p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(msg.date).toLocaleDateString('fr-FR', {
                            day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit'
                        })}
                      </span>
                    </div>
                    {/* Contenu HTML du message */}
                    <div 
                        className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md prose prose-sm max-w-none prose-p:my-0 prose-p:leading-tight"
                        dangerouslySetInnerHTML={createMarkup(msg.body)}
                    />
                  </div>
                </div>
              ))}
              
              {history.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-10">
                    Aucune activité récente.
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}