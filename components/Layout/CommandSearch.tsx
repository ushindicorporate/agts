"use client"

import * as React from "react"
import { Search, Building2, Car, Users } from "lucide-react"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

export function CommandSearch() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Rechercher un véhicule, un bien, un client..." />
      <CommandList>
        <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
        <CommandGroup heading="Actions rapides">
          <CommandItem><Building2 className="mr-2 h-4 w-4" /> Ajouter un bien immo</CommandItem>
          <CommandItem><Car className="mr-2 h-4 w-4" /> Ajouter un véhicule</CommandItem>
        </CommandGroup>
        <CommandGroup heading="Contacts">
          <CommandItem><Users className="mr-2 h-4 w-4" /> Voir tous les clients</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}