// app/dashboard/contacts/[id]/page.tsx

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Edit, Mail, Phone, MapPin, Building, 
  Wallet, Calendar, Briefcase, ChevronRight, Home, 
  Globe
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import ActivityTimeline from '@/components/crm/ActivityTimeline';
import QuickTaskDialog from '@/components/tasks/QuickTaskDialog';
import { getAllTags, getContactById, getContactHistory } from '@/lib/actions/crm-actions';
import { getPropertiesByOwner } from '@/lib/actions/property-actions'; // Importé
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import PropertyImage from '@/components/properties/property-image';

export default async function ContactDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contactId = parseInt(id);
  if (isNaN(contactId)) return notFound();

  // CHARGEMENT PARALLÈLE (Optimisé Entreprise)
  const [contact, history, allTags, patrimony] = await Promise.all([
    getContactById(contactId),
    getContactHistory(contactId),
    getAllTags(),
    getPropertiesByOwner(contactId) // On récupère ses biens
  ]);

  if (!contact) return notFound();

  const initials = contact.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-6 min-h-screen bg-slate-50/30 dark:bg-transparent">
      
      {/* --- NAVIGATION & ACTIONS --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link href="/dashboard/contacts">
          <Button variant="ghost" className="hover:bg-white dark:hover:bg-slate-900 rounded-xl">
            <ArrowLeft className="mr-2 h-4 w-4" /> Annuaire
          </Button>
        </Link>

        <div className="flex items-center gap-2">
            <QuickTaskDialog resModel="res.partner" resId={contactId} />
            <Link href={`/dashboard/contacts/${contactId}/edit`}>
                <Button className="rounded-xl font-bold bg-slate-900 dark:bg-primary">
                    <Edit className="mr-2 h-4 w-4" /> Modifier
                </Button>
            </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* === COLONNE GAUCHE (Infos & Patrimoine) === */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Header Profil */}
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
            <div className="h-2 bg-indigo-600 w-full" />
            <CardHeader className="flex flex-row items-center gap-5 pb-6">
              <Avatar className="h-20 w-20 border-4 border-white dark:border-slate-800 shadow-xl">
                <AvatarFallback className="text-2xl bg-indigo-50 text-indigo-700 font-black">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-3xl font-black tracking-tight">{contact.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge className="bg-indigo-600 font-bold uppercase text-[10px] tracking-widest border-none">
                                <Briefcase className="h-3 w-3 mr-1" /> {contact.role || 'Contact'}
                            </Badge>
                            <span className="text-xs text-slate-400 font-bold">ID #{contact.id}</span>
                        </div>
                    </div>
                </div>
              </div>
            </CardHeader>
            <Separator className="opacity-50" />
            <CardContent className="grid md:grid-cols-2 gap-8 pt-6">
                <div className="space-y-4">
                    <ContactInfoItem icon={Mail} label="Email" value={contact.email} href={`mailto:${contact.email}`} color="text-blue-600 bg-blue-50" />
                    <ContactInfoItem icon={Phone} label="Téléphone" value={contact.phone} href={`tel:${contact.phone}`} color="text-emerald-600 bg-emerald-50" />
                </div>
                <div className="space-y-4">
                    <ContactInfoItem icon={Globe} label="Source du lead" value={contact.source} color="text-purple-600 bg-purple-50" />
                    <ContactInfoItem icon={Calendar} label="Depuis le" value={formatDate(contact.createdAt!)} color="text-orange-600 bg-orange-50" />
                </div>
            </CardContent>
          </Card>

          {/* 2. PATRIMOINE IMMOBILIER (Nouveau) */}
          <Card className="border-none shadow-sm rounded-3xl">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Home className="h-5 w-5 text-indigo-600" />
                        <CardTitle>Patrimoine Immobilier</CardTitle>
                    </div>
                    <Badge variant="secondary" className="font-bold">{patrimony.length} biens</Badge>
                </div>
            </CardHeader>
            <CardContent>
                {patrimony.length === 0 ? (
                    <div className="py-10 text-center border-2 border-dashed rounded-2xl border-slate-100 dark:border-slate-800">
                        <p className="text-sm text-slate-400">Ce contact ne possède aucun bien référencé.</p>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {patrimony.map((item) => (
                            <Link 
                                key={item.id} 
                                href={`/dashboard/properties/${item.id}`}
                                className="group flex items-center gap-4 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
                            >
                                <div className="h-14 w-14 rounded-xl overflow-hidden relative shrink-0">
                                    <PropertyImage src={item.image} alt={item.name} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm truncate group-hover:text-indigo-600 transition-colors">{item.name}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-xs font-black text-slate-900 dark:text-slate-200">{formatCurrency(item.price)}</span>
                                        <span className="text-[10px] uppercase font-bold text-slate-400">• {item.status}</span>
                                    </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        ))}
                    </div>
                )}
            </CardContent>
          </Card>

          {/* 3. Projet & Besoins */}
          <Card className="border-none shadow-sm rounded-3xl">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-indigo-600" />
                <CardTitle>Besoins & Projets</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <BudgetBox label="Budget Min" value={contact.budgetMin || 0} />
                    <BudgetBox label="Budget Max" value={contact.budgetMax || 0} />
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Zone de recherche</p>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <MapPin className="h-4 w-4 text-indigo-600" />
                        <span className="text-sm font-bold">{contact.preferredLocation || 'Non spécifiée'}</span>
                    </div>
                </div>
            </CardContent>
          </Card>
        </div>

        {/* === COLONNE DROITE (Timeline) === */}
        <div className="lg:col-span-1">
            <div className="sticky top-6">
                <ActivityTimeline partnerId={contactId} history={history} />
            </div>
        </div>

      </div>
    </div>
  );
}

// --- SOUS-COMPOSANTS UI (Privés) ---

function ContactInfoItem({ icon: Icon, label, value, href, color }: any) {
    return (
        <div className="flex items-center gap-4 group">
            <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", color)}>
                <Icon size={20} />
            </div>
            <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{label}</p>
                {href ? (
                    <a href={href} className="text-sm font-bold text-slate-900 dark:text-slate-200 hover:text-indigo-600 transition truncate block max-w-[200px]">
                        {value || 'Non renseigné'}
                    </a>
                ) : (
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-200 capitalize">{value || 'N/A'}</p>
                )}
            </div>
        </div>
    )
}

function BudgetBox({ label, value }: { label: string, value: number }) {
    return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <p className="text-[10px] font-black uppercase text-slate-400 mb-1">{label}</p>
            <p className="text-xl font-black text-indigo-600">{formatCurrency(value)}</p>
        </div>
    )
}