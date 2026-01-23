'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition, useEffect } from 'react'
import { Search, Loader2, X } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function PropertySearch({ defaultValue }: { defaultValue: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const [isPending, startTransition] = useTransition() // État de chargement Next.js
  const [value, setValue] = useState(defaultValue)

  // Effet pour mettre à jour l'URL après un délai de frappe (500ms)
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (value !== defaultValue) {
        const params = new URLSearchParams(searchParams.toString())
        if (value) params.set('search', value)
        else params.delete('search')
        params.set('page', '1')

        // startTransition permet de marquer ce changement comme une "transition"
        // ce qui active l'état isPending
        startTransition(() => {
          router.push(`${pathname}?${params.toString()}`)
        })
      }
    }, 500)

    return () => clearTimeout(timeout)
  }, [value, pathname, router, searchParams, defaultValue])

  return (
    <div className="relative w-full group">
      <div className="absolute left-3 top-3 h-4 w-4 text-slate-400">
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        ) : (
          <Search className="h-4 w-4 group-focus-within:text-primary transition-colors" />
        )}
      </div>
      
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Rechercher par titre, ville, référence..."
        className="pl-10 pr-10 h-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl focus-visible:ring-primary/20"
      />

      {value && (
        <button
          onClick={() => setValue('')}
          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {/* Indicateur visuel discret en dessous de l'input */}
      {isPending && (
        <div className="absolute -bottom-6 left-0 text-[10px] font-bold text-primary animate-pulse uppercase tracking-widest">
          Recherche sur Odoo en cours...
        </div>
      )}
    </div>
  )
}