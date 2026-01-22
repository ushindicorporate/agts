'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { Building2, Car, Users, Search, Loader2 } from "lucide-react"
import { 
  CommandDialog, CommandEmpty, CommandGroup, 
  CommandInput, CommandItem, CommandList 
} from "@/components/ui/command"
import { globalSearch } from "@/lib/actions/search-actions"
import { useDebounce } from "@/hooks/use-debounce"

export function CommandSearch() {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const debouncedQuery = useDebounce(query, 300)
  const [loading, setLoading] = React.useState(false)
  const [results, setResults] = React.useState<any>(null)
  const router = useRouter()

  // 1. Raccourci clavier ⌘K
  React.useEffect(() => {
    // 1. Écouteur pour le clavier (⌘K)
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    // 2. Écouteur pour le clic sur le bouton (Custom Event)
    const handleOpen = () => setOpen(true)

    document.addEventListener("keydown", down)
    window.addEventListener('open-search', handleOpen) // Écoute le signal

    return () => {
      document.removeEventListener("keydown", down)
      window.removeEventListener('open-search', handleOpen)
    }
  }, [])

  const [isMounted, setIsMounted] = React.useState(false)
  React.useEffect(() => setIsMounted(true), [])
  if (!isMounted) return null

  // 2. Logique de recherche quand l'utilisateur tape
  React.useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.length < 2) {
        setResults(null)
        return
      }
      
      setLoading(true)
      try {
        const data = await globalSearch(debouncedQuery)
        setResults(data)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [debouncedQuery])

  const onSelect = (path: string) => {
    setOpen(false)
    router.push(path)
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput 
        placeholder="Rechercher partout (Immo, Auto, Clients)..." 
        onValueChange={setQuery}
      />
      <CommandList className="max-h-[400px]">
        {loading && (
          <div className="p-4 flex justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
          </div>
        )}
        
        <CommandEmpty>Aucun résultat pour "{query}".</CommandEmpty>

        {results?.properties?.length > 0 && (
          <CommandGroup heading="Immobilier">
            {results.properties.map((item: any) => (
              <CommandItem key={item.id} onSelect={() => onSelect(`/dashboard/properties/${item.id}`)}>
                <Building2 className="mr-2 h-4 w-4 text-violet-500" />
                <span>{item.name}</span>
                <span className="ml-auto text-xs text-slate-400">{item.list_price}$</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {results?.vehicles?.length > 0 && (
          <CommandGroup heading="Automobile">
            {results.vehicles.map((item: any) => (
              <CommandItem key={item.id} onSelect={() => onSelect(`/dashboard/vehicles/${item.id}`)}>
                <Car className="mr-2 h-4 w-4 text-blue-500" />
                <span>{item.name}</span>
                <span className="ml-auto text-xs text-slate-400">{item.list_price}$</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {results?.contacts?.length > 0 && (
          <CommandGroup heading="Clients & Contacts">
            {results.contacts.map((item: any) => (
              <CommandItem key={item.id} onSelect={() => onSelect(`/dashboard/contacts/${item.id}`)}>
                <Users className="mr-2 h-4 w-4 text-pink-500" />
                <span>{item.name}</span>
                <span className="ml-auto text-xs text-slate-400">{item.phone || item.email}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  )
}