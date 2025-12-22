'use client'

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, ArrowRight, User } from 'lucide-react';
import CreateLeadDialog from './CreateLeadDialog'; // On va créer ce petit dialog spécifique

interface Lead {
  id: number;
  name: string;
  partner: string;
  stage: string;
  revenue: number;
  date: string;
}

interface PropertyLeadsProps {
  leads: Lead[];
  propertyId: number;
  propertyName: string;
  allContacts: { id: number|undefined; name: string }[];
}

export default function PropertyLeads({ leads, propertyId, propertyName, allContacts }: PropertyLeadsProps) {
  return (
    <Card className="border-l-4 border-l-emerald-500 shadow-sm mt-6">
      <CardHeader className="pb-3 border-b bg-emerald-50/10">
        <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2 text-emerald-800">
                <TrendingUp className="h-4 w-4" /> Activité Commerciale ({leads.length})
            </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* LISTE DES LEADS */}
        {leads.length > 0 ? (
            <div className="divide-y">
                {leads.map((lead) => (
                    <Link 
                        href={`/dashboard/leads/${lead.id}`} 
                        key={lead.id}
                        className="flex items-center justify-between p-3 hover:bg-muted/50 transition group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-emerald-100 text-emerald-700 p-1.5 rounded-full">
                                <User className="h-3 w-3" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-800 group-hover:text-emerald-700">{lead.partner}</p>
                                <p className="text-xs text-gray-500">{lead.stage}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            {lead.revenue > 0 && <p className="text-xs font-bold text-gray-700">{lead.revenue.toLocaleString()} €</p>}
                            <ArrowRight className="h-3 w-3 text-gray-300 ml-auto group-hover:text-emerald-500 mt-1" />
                        </div>
                    </Link>
                ))}
            </div>
        ) : (
            <div className="p-6 text-center text-gray-400 text-xs flex flex-col items-center">
                <TrendingUp className="h-6 w-6 mb-2 opacity-20" />
                Aucune opportunité en cours.
            </div>
        )}

        {/* BOUTON D'ACTION */}
        <div className="p-3 bg-gray-50 border-t">
            <CreateLeadDialog 
                propertyId={propertyId} 
                propertyName={propertyName} 
                contacts={allContacts} 
            />
        </div>
      </CardContent>
    </Card>
  );
}