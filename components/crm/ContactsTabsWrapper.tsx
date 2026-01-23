'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContactsTable from './ContactsTable';
import { REContact } from '@/lib/types/contact';
import { Badge } from '../ui/badge';

interface Props {
  contacts: REContact[];
  pageCount: number;
  currentPage: number;
  counts: Record<string, number>;
}

export default function ContactsTabsWrapper({ contacts, pageCount, currentPage, counts }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  // Le rôle actuel est lu depuis l'URL, par défaut 'all'
  const currentTab = searchParams.get('type') || 'all';

  const handleTabChange = (val: string) => {
    const params = new URLSearchParams(searchParams);
    if (val === 'all') params.delete('type');
    else params.set('type', val);
    
    params.set('page', '1'); // Reset pagination quand on change d'onglet
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      
      {/* ONGLETS DE NAVIGATION */}
      <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full justify-start h-auto p-1.5 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl overflow-x-auto flex-nowrap scrollbar-hide">
            {[
              { id: 'all', label: 'Tous', count: counts.all },
              { id: 'internal_agent', label: 'Agents AGTS', count: counts.internal_agent },
              { id: 'external_agent', label: 'Agents Externes', count: counts.external_agent },
              { id: 'landlord', label: 'Propriétaires', count: counts.landlord },
              { id: 'tenant', label: 'Locataires', count: counts.tenant },
            ].map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id} 
                className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm transition-all"
              >
                <span className="text-sm font-bold">{tab.label}</span>
                <Badge variant="secondary" className="ml-2 bg-slate-200/50 dark:bg-slate-700/50 text-[10px] font-black border-none">
                  {tab.count}
                </Badge>
              </TabsTrigger>
            ))}
        </TabsList>
      </Tabs>

      {/* TABLEAU */}
      <ContactsTable 
        data={contacts} 
        pageCount={pageCount} 
        currentPage={currentPage}
        // Tu peux retirer le selecteur de rôle interne à ContactsTable s'il fait doublon
      />
    </div>
  );
}