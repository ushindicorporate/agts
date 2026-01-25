'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { LayoutGrid, LayoutList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ViewToggle() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  
  const currentView = searchParams.get('view') || 'grid'

  const setView = (view: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('view', view)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setView('grid')}
        className={cn(
            "h-8 w-8 rounded-lg transition-all",
            currentView === 'grid' ? "bg-white dark:bg-slate-700 shadow-sm text-primary" : "text-slate-400"
        )}
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setView('list')}
        className={cn(
            "h-8 w-8 rounded-lg transition-all",
            currentView === 'list' ? "bg-white dark:bg-slate-700 shadow-sm text-primary" : "text-slate-400"
        )}
      >
        <LayoutList className="h-4 w-4" />
      </Button>
    </div>
  )
}