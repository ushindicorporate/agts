'use client'

import * as React from "react"
import { Check, ChevronsUpDown, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils" // Utilitaire shadcn standard
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { updateContactTags } from "@/lib/actions/crm-actions"

interface Tag {
  id: number;
  name: string;
  color?: number;
}

interface TagsManagerProps {
  partnerId: number;
  allTags: Tag[];       // Liste complète des tags dispos
  currentTagIds: number[]; // IDs des tags actuels du contact
}

// Mapping des couleurs Odoo (index 0 à 11) vers des classes Tailwind
const ODOO_COLORS = [
  "bg-gray-100 text-gray-800",       // 0
  "bg-red-100 text-red-800",         // 1
  "bg-orange-100 text-orange-800",   // 2
  "bg-yellow-100 text-yellow-800",   // 3
  "bg-blue-100 text-blue-800",       // 4
  "bg-purple-100 text-purple-800",   // 5
  "bg-pink-100 text-pink-800",       // 6
  "bg-cyan-100 text-cyan-800",       // 7
  "bg-green-100 text-green-800",     // 8
  "bg-indigo-100 text-indigo-800",   // 9
  "bg-lime-100 text-lime-800",       // 10
  "bg-teal-100 text-teal-800",       // 11
];

export function TagsManager({ partnerId, allTags, currentTagIds }: TagsManagerProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedIds, setSelectedIds] = React.useState<number[]>(currentTagIds)
  const router = useRouter()

  // Mettre à jour l'état local si les props changent
  React.useEffect(() => {
    setSelectedIds(currentTagIds)
  }, [currentTagIds])

  const handleSelect = async (tagId: number) => {
    let newIds: number[];
    if (selectedIds.includes(tagId)) {
      newIds = selectedIds.filter(id => id !== tagId); // Retirer
    } else {
      newIds = [...selectedIds, tagId]; // Ajouter
    }

    // Optimistic UI update
    setSelectedIds(newIds);
    
    // Appel Serveur
    const result = await updateContactTags(partnerId, newIds);
    if (!result.success) {
      toast.error("Erreur maj tags");
      setSelectedIds(selectedIds); // Rollback en cas d'erreur
    } else {
        router.refresh();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Affichage des Tags Actifs */}
      {selectedIds.map(id => {
        const tag = allTags.find(t => t.id === id);
        if (!tag) return null;
        const colorClass = ODOO_COLORS[tag.color || 0] || ODOO_COLORS[0];
        
        return (
          <Badge key={id} variant="secondary" className={cn("pl-2 pr-1 py-1 flex items-center gap-1", colorClass)}>
            {tag.name}
            <button 
                onClick={() => handleSelect(id)}
                className="hover:bg-black/10 rounded-full p-0.5 ml-1 transition"
            >
                <X className="h-3 w-3" />
            </button>
          </Badge>
        );
      })}

      {/* Popover Sélecteur */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-7 border-dashed text-xs rounded-full">
            <Plus className="mr-1 h-3 w-3" />
            Tag
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[200px]" align="start">
          <Command>
            <CommandInput placeholder="Chercher un tag..." />
            <CommandList>
              <CommandEmpty>Aucun tag trouvé.</CommandEmpty>
              <CommandGroup>
                {allTags.map((tag) => (
                  <CommandItem
                    key={tag.id}
                    value={tag.name} // Pour la recherche
                    onSelect={() => handleSelect(tag.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedIds.includes(tag.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex items-center gap-2">
                        {/* Petit point de couleur */}
                        <div className={cn("h-2 w-2 rounded-full", ODOO_COLORS[tag.color || 0].split(' ')[0].replace('bg-', 'bg-'))} />
                        {tag.name}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}