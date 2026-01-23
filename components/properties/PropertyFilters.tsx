'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RotateCcw, MapPin, DollarSign, Home, Users } from 'lucide-react';
import MultipleSelector, { Option } from "@/components/ui/multiselect";

// Statuts convertis en options pour le Multi-Select
const STATUS_OPTIONS: Option[] = [
  { label: "🔵 À louer", value: "À louer" },
  { label: "🟠 À vendre", value: "À vendre" },
  { label: "⏳ Réservé", value: "Réservé" },
  { label: "✅ Loué", value: "Loué" },
  { label: "✅ Vendu", value: "Vendu" },
];

const COMMUNES_KINSHASA = [
  { value: 'all', label: 'Toutes les communes' },
  { value: 'Gombe', label: 'Gombe' },
  { value: 'Ngaliema', label: 'Ngaliema' },
  { value: 'Limete', label: 'Limete' },
  { value: 'Kintambo', label: 'Kintambo' },
  { value: 'Mont-Ngafula', label: 'Mont-Ngafula' },
];

interface PropertyFiltersProps {
  owners: { id: number; name: string; role: string }[];
}

export default function PropertyFilters({ owners }: PropertyFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Mapping des propriétaires Odoo pour le Multi-Select
  const ownerOptions: Option[] = useMemo(() => 
    owners.map(o => ({
      label: `${o.name} (${o.role})`,
      value: o.id.toString()
    })), [owners]);

  // États locaux (Tableaux d'options pour les multi-selects)
  const [selectedStatuses, setSelectedStatuses] = useState<Option[]>([]);
  const [selectedOwners, setSelectedOwners] = useState<Option[]>([]);
  
  // Autres filtres
  const [city, setCity] = useState(searchParams.get('city') || 'all');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  // Synchronisation initiale avec l'URL (Deep Linking)
  useEffect(() => {
    const statusesFromUrl = searchParams.get('statuses')?.split(',') || [];
    setSelectedStatuses(STATUS_OPTIONS.filter(opt => statusesFromUrl.includes(opt.value)));

    const ownersFromUrl = searchParams.get('ownerIds')?.split(',') || [];
    setSelectedOwners(ownerOptions.filter(opt => ownersFromUrl.includes(opt.value)));
  }, [searchParams, ownerOptions]);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Statuts
    if (selectedStatuses.length > 0) {
      params.set('statuses', selectedStatuses.map(s => s.value).join(','));
    } else {
      params.delete('statuses');
    }

    // Propriétaires
    if (selectedOwners.length > 0) {
      params.set('ownerIds', selectedOwners.map(o => o.value).join(','));
    } else {
      params.delete('ownerIds');
    }

    // Autres
    if (city && city !== 'all') params.set('city', city); else params.delete('city');
    if (minPrice) params.set('minPrice', minPrice); else params.delete('minPrice');
    if (maxPrice) params.set('maxPrice', maxPrice); else params.delete('maxPrice');
    
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const resetFilters = () => {
    setSelectedStatuses([]);
    setSelectedOwners([]);
    setCity('all');
    setMinPrice('');
    setMaxPrice('');
    router.push(pathname);
  };

  return (
    <div className="space-y-6 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm h-fit transition-colors">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
          Filtres Avancés
        </h3>
        <Button onClick={resetFilters} variant="ghost" size="sm" className="h-8 text-xs text-slate-500 hover:text-red-500">
          <RotateCcw className="mr-1 h-3 w-3" /> Reset
        </Button>
      </div>

      {/* MULTI-SELECT STATUTS */}
      <div className="space-y-2">
        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Statuts</Label>
        <MultipleSelector
          value={selectedStatuses}
          onChange={setSelectedStatuses}
          defaultOptions={STATUS_OPTIONS}
          placeholder="Filtrer par statut..."
          emptyIndicator={<p className="text-center text-xs text-slate-500">Aucun statut trouvé</p>}
          className="dark:bg-slate-800 border-none rounded-xl"
        />
      </div>

      {/* MULTI-SELECT PROPRIÉTAIRES */}
      <div className="space-y-2">
        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Propriétaires (Landlords/Sellers)</Label>
        <MultipleSelector
          value={selectedOwners}
          onChange={setSelectedOwners}
          defaultOptions={ownerOptions}
          placeholder="Rechercher un propriétaire..."
          emptyIndicator={<p className="text-center text-xs text-slate-500">Aucun contact trouvé</p>}
          className="dark:bg-slate-800 border-none rounded-xl"
        />
      </div>

      {/* COMMUNE */}
      <div className="space-y-2">
        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Commune de Kinshasa</Label>
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger className="bg-slate-100 dark:bg-slate-800 border-none rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="dark:bg-slate-900 border-slate-800">
            {COMMUNES_KINSHASA.map((c) => (
              <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* BUDGET */}
      <div className="space-y-2">
        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Budget (USD)</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input 
            type="number" placeholder="Min" 
            className="bg-slate-100 dark:bg-slate-800 border-none rounded-xl"
            value={minPrice} onChange={(e) => setMinPrice(e.target.value)} 
          />
          <Input 
            type="number" placeholder="Max" 
            className="bg-slate-100 dark:bg-slate-800 border-none rounded-xl"
            value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} 
          />
        </div>
      </div>

      <Button 
        onClick={applyFilters} 
        className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-6 shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] font-bold"
      >
        Appliquer les filtres
      </Button>
    </div>
  );
}