// lib/utils/contact-styles.ts
export const getRoleBadge = (role: string) => {
  const styles: Record<string, string> = {
    internal_agent: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
    external_agent: "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
    promoter: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    private: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    buyer: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    landlord: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
  };
  
  return styles[role] || "bg-slate-100 text-slate-700";
};