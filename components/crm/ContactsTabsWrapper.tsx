'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContactsTable from './ContactsTable'; // Ton tableau existant
import { REContact } from '@/lib/types/contact';

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
        <TabsList className="w-full justify-start h-auto p-1 bg-muted/50 overflow-x-auto">
            <TabsTrigger value="all" className="py-2">
                Tous <span className="ml-2 text-xs bg-muted-foreground/20 px-1.5 rounded-full">{counts.all}</span>
            </TabsTrigger>
            <TabsTrigger value="internal_agent" className="py-2">
                Agents Internes <span className="ml-2 text-xs bg-muted-foreground/20 px-1.5 rounded-full">{counts.internal_agent}</span>
            </TabsTrigger>
            <TabsTrigger value="internal_agency" className="py-2">
                Agences Internes <span className="ml-2 text-xs bg-muted-foreground/20 px-1.5 rounded-full">{counts.internal_agency}</span>
            </TabsTrigger>
            <TabsTrigger value="external_agent" className="py-2">
                Agents Externes <span className="ml-2 text-xs bg-muted-foreground/20 px-1.5 rounded-full">{counts.external_agent}</span>
            </TabsTrigger>
            <TabsTrigger value="external_agency" className="py-2">
                Agences Externes <span className="ml-2 text-xs bg-muted-foreground/20 px-1.5 rounded-full">{counts.external_agency}</span>
            </TabsTrigger>
            <TabsTrigger value="promoter" className="py-2">
                Promoteurs <span className="ml-2 text-xs bg-muted-foreground/20 px-1.5 rounded-full">{counts.promoter}</span>
            </TabsTrigger>
            <TabsTrigger value="private" className="py-2">
                Clients <span className="ml-2 text-xs bg-muted-foreground/20 px-1.5 rounded-full">{counts.private}</span>
            </TabsTrigger>
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