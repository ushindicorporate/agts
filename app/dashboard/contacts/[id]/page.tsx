import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Edit, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Globe, 
  Wallet,
  Calendar
} from 'lucide-react';

// Composants UI
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Composants Custom
import ActivityTimeline from '@/components/crm/ActivityTimeline';
import { TagsManager } from '@/components/crm/TagsManager';
import QuickTaskDialog from '@/components/tasks/QuickTaskDialog'; // <--- IMPORT AJOUTÉ
import { getAllTags, getContactById, getContactHistory } from '@/lib/actions/crm-actions';
import { formatCurrency } from '@/lib/utils';

// --- Page Component ---

export default async function ContactDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contactId = parseInt(id);

  if (isNaN(contactId)) return notFound();

  // Chargement PARALLÈLE des données
  const [contact, history, allTags] = await Promise.all([
    getContactById(contactId),
    getContactHistory(contactId),
    getAllTags()
  ]);

  if (!contact) return notFound();

  // Initials pour l'avatar
  const initials = contact.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      
      {/* --- HEADER NAVIGATION & ACTIONS --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Gauche : Retour */}
        <div className="flex items-center gap-2">
          <Link href="/dashboard/contacts">
            <Button variant="ghost" size="sm" className="pl-0 hover:bg-transparent hover:text-primary">
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour liste
            </Button>
          </Link>
        </div>

        {/* Droite : Actions (Rappel + Modifier) */}
        <div className="flex items-center gap-2">
            
            {/* --- AJOUT DU BOUTON TÂCHE RAPIDE --- */}
            <QuickTaskDialog 
                resModel="res.partner" 
                resId={contactId} 
            />
            {/* ------------------------------------ */}

            <Link href={`/dashboard/contacts/${contactId}/edit`}>
                <Button>
                    <Edit className="mr-2 h-4 w-4" /> Modifier Fiche
                </Button>
            </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* === COLONNE GAUCHE (Infos) === */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Carte Profil Principal */}
          <Card>
            <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4">
              <Avatar className="h-16 w-16 border-2 border-muted">
                <AvatarFallback className="text-xl bg-primary/10 text-primary font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold">{contact.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">ID Odoo: {contact.id}</p>
                    </div>
                    <Badge variant="outline" className="text-sm capitalize px-3 py-1">
                        {contact.role}
                    </Badge>
                </div>
                
                {/* Manager de Tags */}
                <div className="pt-2">
                    <TagsManager 
                        partnerId={contact.id!} 
                        allTags={allTags} 
                        currentTagIds={contact.tags ? contact.tags.map(t => t[0]) : []} 
                    />
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="grid md:grid-cols-2 gap-6 pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase">Email</p>
                    <a href={`mailto:${contact.email}`} className="text-sm hover:underline hover:text-primary transition">
                      {contact.email || 'Non renseigné'}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                        <Phone size={16} />
                    </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase">Téléphone</p>
                    <a href={`tel:${contact.phone}`} className="text-sm hover:underline hover:text-primary transition">
                      {contact.phone || 'Non renseigné'}
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                        <Globe size={16} />
                    </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase">Source</p>
                    <p className="text-sm capitalize">{contact.source}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                        <Calendar size={16} />
                    </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase">Date création</p>
                    <p className="text-sm text-muted-foreground">Synchronisé Odoo</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Carte Projet Immobilier */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                <CardTitle>Projet Immobilier</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/40 p-4 rounded-lg border">
                        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                            <Wallet className="h-4 w-4" />
                            <span className="text-xs font-semibold uppercase">Budget Min</span>
                        </div>
                        <p className="text-xl font-bold text-foreground">
                            {formatCurrency(contact.budgetMin)}
                        </p>
                    </div>
                    <div className="bg-muted/40 p-4 rounded-lg border">
                        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                            <Wallet className="h-4 w-4" />
                            <span className="text-xs font-semibold uppercase">Budget Max</span>
                        </div>
                        <p className="text-xl font-bold text-foreground">
                            {formatCurrency(contact.budgetMax)}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-blue-50/50 border border-blue-100 rounded-lg">
                    <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-blue-900">Localisation recherchée</p>
                        <p className="text-sm text-blue-700 mt-1">
                            {contact.preferredLocation || 'Aucune zone géographique précisée.'}
                        </p>
                    </div>
                </div>
            </CardContent>
          </Card>

          {/* 3. Carte Notes Internes (Lecture seule) */}
          {contact.notes && (
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base text-muted-foreground">Note permanente</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{contact.notes}</p>
                </CardContent>
            </Card>
          )}
        </div>

        {/* === COLONNE DROITE (Timeline) === */}
        <div className="lg:col-span-1">
            <div className="sticky top-6 h-[calc(100vh-100px)] min-h-[500px]">
                {/* Composant Client Timeline */}
                <ActivityTimeline partnerId={contactId} history={history} />
            </div>
        </div>

      </div>
    </div>
  );
}