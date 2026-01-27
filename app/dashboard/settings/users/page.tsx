import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MoreHorizontal, Mail, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import InviteUserDialog from "@/components/admin/InviteUserDialog";
import { getTeamMembers } from "@/lib/actions/user-actions";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ResendInviteButton } from "@/components/admin/ResendInviteButton";
import ResetPasswordDialog from "@/components/admin/ResetPasswordDialog";

const ROLE_STYLES = {
  super_admin: "bg-rose-500/10 text-rose-600 border-rose-200",
  admin: "bg-indigo-500/10 text-indigo-600 border-indigo-200",
  agent: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  finance: "bg-amber-500/10 text-amber-600 border-amber-200",
};

export default async function UsersPage() {
  const members = await getTeamMembers();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Gestion d'Équipe</h2>
          <p className="text-sm text-slate-500 font-medium">Contrôlez les accès de vos collaborateurs AGTS.</p>
        </div>
        <InviteUserDialog />
      </div>

      <div className="grid gap-3">
        {members.map((member) => (
          <Card key={member.id} className="border-none shadow-sm rounded-3xl bg-white dark:bg-slate-900 overflow-hidden group">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-slate-50 dark:border-slate-800">
                  <AvatarImage src={member.avatar_url!} />
                  <AvatarFallback className="font-black bg-slate-100 dark:bg-slate-800 uppercase">
                    {member.full_name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{member.full_name}</span>
                    <Badge variant="outline" className={cn("text-[9px] uppercase font-black px-2 py-0", ROLE_STYLES[member.role])}>
                      {member.role.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1"><Mail size={12} /> {member.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* BOUTON RENVOYER MAIL (Uniquement si pas admin lui-même) */}
                <ResendInviteButton email={member.email} />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                            <MoreHorizontal size={20} className="text-slate-400" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-slate-200 dark:border-slate-800 shadow-xl">
                        {/* COMPOSANT DE RESET PASSWORD ICI */}
                        <ResetPasswordDialog userId={member.id} userName={member.full_name} />
                        
                        <DropdownMenuItem className="text-rose-600 font-bold mt-1 rounded-xl cursor-pointer">
                            Désactiver l'accès
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}