'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Pour Vente/Location
import { RotateCcw, MapPin, DollarSign, Home, Maximize } from 'lucide-react';

// Liste des communes majeures de Kinshasa pour AGTS
const COMMUNES_KINSHASA = [
  { value: 'all', label: 'Toutes les communes' },
  { value: 'Gombe', label: 'Gombe' },
  { value: 'Ngaliema', label: 'Ngaliema (Binza/Ma Campagne)' },
  { value: 'Limete', label: 'Limete' },
  { value: 'Kintambo', label: 'Kintambo' },
  { value: 'Mont-Ngafula', label: 'Mont-Ngafula' },
  { value: 'Lingwala', label: 'Lingwala' },
  { value: 'Barumbu', label: 'Barumbu' },
];

export default function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  // États locaux synchronisés avec l'URL
  const [offerType, setOfferType] = useState(searchParams.get('offerType') || 'all');
  const [type, setType] = useState(searchParams.get('type') || 'all');
  const [city, setCity] = useState(searchParams.get('city') || 'all');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [minSurface, setMinSurface] = useState(searchParams.get('minSurface') || '');

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Helper pour mettre à jour les params
    const updateParam = (key: string, value: string) => {
      if (value && value !== 'all') params.set(key, value);
      else params.delete(key);
    };

    updateParam('offerType', offerType);
    updateParam('type', type);
    updateParam('city', city);
    updateParam('minPrice', minPrice);
    updateParam('maxPrice', maxPrice);
    updateParam('minSurface', minSurface);
    
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const resetFilters = () => {
    setOfferType('all');
    setType('all');
    setCity('all');
    setMinPrice('');
    setMaxPrice('');
    setMinSurface('');
    router.push(pathname);
  };

  return (
    <div className="space-y-6 bg-white dark:bg-slate-900 p-5 rounded-2xl border shadow-sm h-fit">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
          Filtres Avancés
        </h3>
        <Button onClick={resetFilters} variant="ghost" size="sm" className="h-8 text-xs text-slate-500">
          <RotateCcw className="mr-1 h-3 w-3" /> Effacer
        </Button>
      </div>

      {/* 1. Type d'offre (Vente / Location) */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase text-slate-400">Transaction</Label>
        <Tabs value={offerType} onValueChange={setOfferType} className="w-full">
          <TabsList className="grid grid-cols-3 w-full bg-slate-100">
            <TabsTrigger value="all" className="text-xs">Tous</TabsTrigger>
            <TabsTrigger value="À louer" className="text-xs">Location</TabsTrigger>
            <TabsTrigger value="À vendre" className="text-xs">Vente</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* 2. Commune de Kinshasa */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase text-slate-400 flex items-center gap-1">
          <MapPin className="h-3 w-3" /> Commune
        </Label>
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger className="bg-slate-50 border-none">
            <SelectValue placeholder="Choisir une commune" />
          </SelectTrigger>
          <SelectContent>
            {COMMUNES_KINSHASA.map((c) => (
              <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 3. Type de bien */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase text-slate-400 flex items-center gap-1">
          <Home className="h-3 w-3" /> Type de bien
        </Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="bg-slate-50 border-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="apartment">Appartement</SelectItem>
            <SelectItem value="villa">Villa / Maison</SelectItem>
            <SelectItem value="land">Terrain / Concession</SelectItem>
            <SelectItem value="commercial">Bureau / Commerce</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 4. Budget (En USD car c'est la norme à Kin) */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase text-slate-400 flex items-center gap-1">
          <DollarSign className="h-3 w-3" /> Budget (USD)
        </Label>
        <div className="grid grid-cols-2 gap-2">
          <Input 
            type="number" placeholder="Min" 
            className="bg-slate-50 border-none"
            value={minPrice} onChange={(e) => setMinPrice(e.target.value)} 
          />
          <Input 
            type="number" placeholder="Max" 
            className="bg-slate-50 border-none"
            value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} 
          />
        </div>
      </div>

      {/* 5. Surface */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase text-slate-400 flex items-center gap-1">
          <Maximize className="h-3 w-3" /> Surface (m²)
        </Label>
        <Input 
          type="number" placeholder="Surface min" 
          className="bg-slate-50 border-none"
          value={minSurface} onChange={(e) => setMinSurface(e.target.value)} 
        />
      </div>

      <Button onClick={applyFilters} className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-6 shadow-lg shadow-slate-200 transition-all active:scale-[0.98]">
        Afficher les résultats
      </Button>
    </div>
  );
}