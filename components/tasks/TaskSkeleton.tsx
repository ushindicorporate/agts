import { Card, CardContent } from "@/components/ui/card";

export function TaskSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      
      {/* 1. SKELETON DU HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="space-y-3">
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-full" />
          <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-4 w-80 bg-slate-100 dark:bg-slate-900 rounded-lg" />
        </div>
        <div className="h-12 w-40 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>

      {/* 2. GRILLE DES COLONNES */}
      <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
        {[1, 2, 3].map((column) => (
          <div key={column} className="space-y-4">
            
            {/* En-tête de colonne */}
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-slate-200 dark:bg-slate-800 rounded-full" />
                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded-md" />
              </div>
              <div className="h-4 w-6 bg-slate-100 dark:bg-slate-900 rounded-full" />
            </div>

            {/* Liste de cartes factices */}
            <div className="space-y-3 p-2 rounded-3xl bg-slate-50/50 dark:bg-slate-900/20">
              {[1, 2].map((card) => (
                <Card key={card} className="border-none shadow-sm rounded-2xl bg-white dark:bg-slate-900 overflow-hidden">
                  <CardContent className="p-4 flex items-start gap-4">
                    {/* Bouton Checkbox */}
                    <div className="mt-1 h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 shrink-0" />
                    
                    <div className="flex-1 space-y-3">
                      {/* Titre de la tâche */}
                      <div className="space-y-2">
                        <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                        <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-800 rounded" />
                      </div>

                      {/* Badges/Tags */}
                      <div className="flex gap-2">
                        <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded" />
                        <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded" />
                      </div>

                      {/* Lien objet rattaché */}
                      <div className="h-8 w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}