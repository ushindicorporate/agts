'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Slider } from '@/components/ui/slider'; // Si tu as shadcn slider, sinon input number
import { RotateCcw } from 'lucide-react';

export default function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // États locaux
  const [type, setType] = useState(searchParams.get('type') || 'all');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [minSurface, setMinSurface] = useState(searchParams.get('minSurface') || '');

  // Appliquer les filtres
  const applyFilters = () => {
    const params = new URLSearchParams(searchParams);
    
    if (type && type !== 'all') params.set('type', type); else params.delete('type');
    if (minPrice) params.set('minPrice', minPrice); else params.delete('minPrice');
    if (maxPrice) params.set('maxPrice', maxPrice); else params.delete('maxPrice');
    if (minSurface) params.set('minSurface', minSurface); else params.delete('minSurface');
    
    params.set('page', '1'); // Reset pagination
    router.push(`?${params.toString()}`);
  };

  // Reset
  const resetFilters = () => {
    router.push('/dashboard/properties');
    setType('all');
    setMinPrice('');
    setMaxPrice('');
    setMinSurface('');
  };

  return (
    <div className="space-y-6 bg-white p-4 rounded-lg border shadow-sm h-fit">
      <div>
        <h3 className="font-semibold mb-4">Filtrer les biens</h3>
        
        {/* Type de bien */}
        <div className="space-y-2 mb-4">
            <Label>Type de bien</Label>
            <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                    <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="apartment">Appartement</SelectItem>
                    <SelectItem value="villa">Maison / Villa</SelectItem>
                    <SelectItem value="land">Terrain</SelectItem>
                    <SelectItem value="commercial">Local Commercial</SelectItem>
                </SelectContent>
            </Select>
        </div>

        {/* Budget */}
        <div className="space-y-2 mb-4">
            <Label>Budget</Label>
            <div className="flex items-center gap-2">
                <Input 
                    type="number" placeholder="Min" 
                    value={minPrice} onChange={(e) => setMinPrice(e.target.value)} 
                />
                <span className="text-muted-foreground">-</span>
                <Input 
                    type="number" placeholder="Max" 
                    value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} 
                />
            </div>
        </div>

        {/* Surface */}
        <div className="space-y-2 mb-6">
            <Label>Surface Min (m²)</Label>
            <Input 
                type="number" placeholder="0" 
                value={minSurface} onChange={(e) => setMinSurface(e.target.value)} 
            />
        </div>

        <Button onClick={applyFilters} className="w-full mb-2">Appliquer</Button>
        <Button onClick={resetFilters} variant="ghost" className="w-full text-muted-foreground">
            <RotateCcw className="mr-2 h-3 w-3" /> Réinitialiser
        </Button>
      </div>
    </div>
  );
}