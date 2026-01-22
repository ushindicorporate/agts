'use client'

import { Search } from "lucide-react"

export function SearchTrigger() {
  const handleClick = () => {
    console.log('click');
    
    // On envoie un signal global pour ouvrir la recherche
    window.dispatchEvent(new CustomEvent('open-search'))
  }

  return (
    <div 
      onClick={handleClick}
      className="hidden lg:flex items-center px-3 py-1.5 bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition cursor-pointer w-64 group border border-transparent hover:border-slate-200"
    >
      <Search className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
      <span className="text-xs font-medium">Rechercher (⌘K)</span>
      <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium text-slate-500">
        <span className="text-xs">⌘</span>K
      </kbd>
    </div>
  )
}