import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function ContactSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      
      {/* 1. SKELETON DES ONGLETS (TABS) */}
      <div className="flex gap-2 p-1.5 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl w-full overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 w-32 bg-white dark:bg-slate-800 rounded-xl shadow-sm" />
        ))}
      </div>

      {/* 2. SKELETON DE LA BARRE D'OUTILS (SEARCH & FILTERS) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex w-full sm:w-auto items-center gap-2">
          {/* Barre de recherche */}
          <div className="h-10 w-full sm:w-64 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          {/* Select Rôle */}
          <div className="h-10 w-[150px] bg-slate-200 dark:bg-slate-800 rounded-xl hidden sm:block" />
        </div>
        {/* Bouton Nouveau Contact */}
        <div className="h-10 w-full sm:w-40 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>

      {/* 3. SKELETON DU TABLEAU */}
      <Card className="rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
            <TableRow className="hover:bg-transparent border-slate-200 dark:border-slate-800">
              <TableHead className="w-[300px] h-12 px-6">Identité</TableHead>
              <TableHead className="px-6">Catégorie</TableHead>
              <TableHead className="px-6">Contact</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
              <TableRow key={row} className="border-slate-100 dark:border-slate-800">
                {/* Colonne Identité (Avatar + Texte) */}
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
                      <div className="h-3 w-24 bg-slate-100 dark:bg-slate-800/50 rounded" />
                    </div>
                  </div>
                </TableCell>
                
                {/* Colonne Catégorie (Badge) */}
                <TableCell className="px-6 py-4">
                  <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                </TableCell>

                {/* Colonne Téléphone */}
                <TableCell className="px-6 py-4">
                  <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
                </TableCell>

                {/* Colonne Actions */}
                <TableCell className="px-6 py-4">
                  <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-lg ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}