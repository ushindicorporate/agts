import { Card, CardContent, CardFooter } from "@/components/ui/card"

export function PropertySkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="overflow-hidden border-slate-200 dark:border-slate-800 rounded-3xl animate-pulse">
          <div className="aspect-4/3 bg-slate-200 dark:bg-slate-800" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
          </div>
          <CardFooter className="p-3 bg-slate-50 dark:bg-slate-800/30">
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}