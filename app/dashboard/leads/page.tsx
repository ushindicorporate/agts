import Link from "next/link";
import { Plus, Phone, User, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getLeadsAction } from "./actions/crm-actions";

export default async function LeadsPage() {
  const { data: leads, success } = await getLeadsAction();

  // Helper pour formater l'étape Odoo (souvent un array [id, label])
  const getStageName = (stageField: any) => {
    if (Array.isArray(stageField) && stageField.length > 1) {
      return stageField[1];
    }
    return "Nouveau";
  };

  // Helper couleur priorité
  const getPriorityColor = (prio: string) => {
    if (prio === "3") return "text-red-500 fill-red-500";
    if (prio === "2") return "text-orange-500";
    return "text-gray-300";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">CRM & Prospects</h1>
          <p className="text-muted-foreground">Suivi des clients potentiels Immo & Auto</p>
        </div>
        <Button asChild className="bg-slate-900">
          <Link href="/dashboard/leads/create">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Lead
          </Link>
        </Button>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Opportunité</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Budget ($)</TableHead>
              <TableHead>Étape</TableHead>
              <TableHead className="text-right">Priorité</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!success || !leads || leads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Aucun prospect en cours.
                </TableCell>
              </TableRow>
            ) : (
              leads.map((lead: any) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <div className="font-medium text-slate-900">{lead.name}</div>
                    <div className="text-xs text-muted-foreground">Créé le {lead.create_date?.split(" ")[0]}</div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="flex items-center gap-2 font-medium">
                        <User className="h-3 w-3 text-slate-400" /> {lead.contact_name || "Anonyme"}
                      </span>
                      <span className="flex items-center gap-2 text-xs text-slate-500">
                        <Phone className="h-3 w-3" /> {lead.phone || "-"}
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="font-semibold text-green-700">
                     {lead.expected_revenue > 0 ? (
                       new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(lead.expected_revenue)
                     ) : (
                       <span className="text-gray-300">-</span>
                     )}
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
                      {getStageName(lead.stage_id)}
                    </Badge>
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {/* Simulation étoiles */}
                      {[1, 2, 3].map((star) => (
                        <div key={star} className={`h-2 w-2 rounded-full ${parseInt(lead.priority) >= star ? "bg-orange-400" : "bg-gray-200"}`} />
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}