'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from '@tanstack/react-table';
import { 
  MessageSquare, MoreHorizontal, Phone, Plus, Search, 
  Building2, User, ChevronRight, Briefcase 
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { REContact } from '@/lib/types/contact';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { archiveContact } from '@/lib/actions/crm-actions';

// --- HELPERS DE STYLE ---
const getTypeBadge = (type: string) => {
  const configs: Record<string, string> = {
    internal_agent: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
    external_agent: "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
    promoter: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    private: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  };
  return configs[type] || "bg-slate-100 text-slate-700";
};

interface ContactsTableProps {
  data: REContact[];
  pageCount: number;
  currentPage: number;
}

export default function ContactsTable({ data, pageCount, currentPage }: ContactsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // --- LOGIQUE FILTRES ---
  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) params.set('search', term); else params.delete('search');
    params.set('page', '1');
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleRoleChange = (val: string) => {
    const params = new URLSearchParams(searchParams);
    if (val && val !== 'all') params.set('role', val); else params.delete('role');
    params.set('page', '1');
    router.replace(`${pathname}?${params.toString()}`);
  }
  
  const handlePageChange = (p: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', p.toString());
    router.push(`${pathname}?${params.toString()}`);
  }

  // --- DÉFINITION DES COLONNES ---
  const columns: ColumnDef<REContact>[] = [
    {
      accessorKey: 'name',
      header: 'Identité',
      cell: ({ row }) => {
        const contact = row.original;
        const isCompany = contact.isCompany;

        return (
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-800 shadow-sm">
                <AvatarFallback className={cn(
                  "font-black text-[10px]",
                  isCompany ? "bg-amber-50 text-amber-600" : "bg-indigo-50 text-indigo-600"
                )}>
                  {contact.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isCompany && (
                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-0.5 shadow-sm border border-slate-100 dark:border-slate-800">
                  <Building2 className="h-3 w-3 text-amber-600" />
                </div>
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-slate-900 dark:text-slate-100 truncate text-sm leading-tight">
                {contact.name}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-slate-400 truncate max-w-[150px]">{contact.email}</span>
                {contact.parentName && (
                   <>
                    <div className="h-1 w-1 rounded-full bg-slate-300" />
                    <span className="text-[10px] font-bold text-primary truncate max-w-[120px]">
                      {contact.parentName}
                    </span>
                   </>
                )}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'type',
      header: 'Catégorie',
      cell: ({ row }) => (
        <Badge className={cn("border-none font-black text-[9px] uppercase tracking-wider", getTypeBadge(row.original.type))}>
          {row.original.type.replace('_', ' ')}
        </Badge>
      )
    },
    {
      accessorKey: 'role',
      header: 'Rôle Immo',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 capitalize">
           <Briefcase className="h-3 w-3 opacity-50" />
           {row.original.role}
        </div>
      )
    },
    {
      accessorKey: 'phone',
      header: 'Contact direct',
      cell: ({ row }) => {
        const phone = row.original.phone;
        if (phone === '-') return <span className="text-slate-300">-</span>;
        
        return (
          <div className="flex items-center gap-1">
              <span className="text-xs font-bold tabular-nums mr-2">{phone}</span>
              <a 
                href={`tel:${phone}`} 
                className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors text-blue-600"
                onClick={(e) => e.stopPropagation()}
              >
                  <Phone className="h-3.5 w-3.5" />
              </a>
              <a 
                href={`https://wa.me/${phone.replace(/\D/g, '')}`} 
                target="_blank" 
                className="p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors text-emerald-600"
                onClick={(e) => e.stopPropagation()}
              >
                  <MessageSquare className="h-3.5 w-3.5" />
              </a>
          </div>
        )
      }
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex justify-end pr-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl border-slate-200 dark:border-slate-800">
              <DropdownMenuLabel className="text-xs font-black uppercase text-slate-400">Actions Dossier</DropdownMenuLabel>
              
              <DropdownMenuItem onClick={() => router.push(`/dashboard/contacts/${row.original.id}`)} className="font-bold cursor-pointer">
                Consulter la fiche
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => router.push(`/dashboard/contacts/${row.original.id}/edit`)} className="font-bold cursor-pointer">
                Modifier infos
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {/* ACTION D'ARCHIVAGE AVEC CONFIRMATION */}
              <DropdownMenuItem 
                className="text-rose-600 font-bold cursor-pointer focus:bg-rose-50 dark:focus:bg-rose-950/30"
                onClick={async (e) => {
                    e.stopPropagation(); // Empêche l'ouverture de la fiche au clic
                    
                    const confirmed = window.confirm(`Voulez-vous vraiment archiver ${row.original.name} ?`);
                    
                    if (confirmed) {
                        const promise = archiveContact(row.original.id!);
                        
                        toast.promise(promise, {
                            loading: 'Archivage dans le système...',
                            success: 'Le contact a été déplacé vers les archives.',
                            error: (err) => `Erreur: ${err}`
                        });
                    }
                }}
              >
                Archiver le contact
              </DropdownMenuItem>
            </DropdownMenuContent>

          </DropdownMenu>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-300">
             <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data, columns, getCoreRowModel: getCoreRowModel(), manualPagination: true, pageCount,
  });

  return (
    <div className="space-y-6 pb-20">
      {/* TOOLBAR PREMIUM */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex w-full md:w-auto items-center gap-3">
            <div className="relative w-full md:w-80 group">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="Rechercher un partenaire (Nom, Email, Tel)..." 
                  className="pl-10 h-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl" 
                  onChange={(e) => handleSearch(e.target.value)} 
                  defaultValue={searchParams.get('search') || ''}
                />
            </div>
             <Select onValueChange={handleRoleChange} defaultValue={searchParams.get('role') || 'all'}>
                <SelectTrigger className="w-[180px] h-10 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-bold text-xs">
                    <SelectValue placeholder="Rôle Immo" />
                </SelectTrigger>
                <SelectContent className="dark:bg-slate-900 border-slate-800">
                    <SelectItem value="all">Tous les rôles</SelectItem>
                    <SelectItem value="buyer">Acheteurs</SelectItem>
                    <SelectItem value="seller">Propriétaires/Vendeurs</SelectItem>
                    <SelectItem value="tenant">Locataires</SelectItem>
                    <SelectItem value="landlord">Bailleurs</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>

      {/* TABLE COMPONENT */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-slate-200 dark:border-slate-800">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-12 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer border-slate-100 dark:border-slate-900 group"
                  onClick={() => router.push(`/dashboard/contacts/${row.original.id}`)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-6 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-48 text-center text-slate-400 font-medium italic">
                  Aucun contact correspondant à vos filtres dans le système.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION PRO */}
      <div className="flex items-center justify-center gap-2 pt-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="rounded-xl font-bold h-9 px-4"
          onClick={() => handlePageChange(currentPage - 1)} 
          disabled={currentPage <= 1}
        >
          Précédent
        </Button>
        
        <div className="h-9 px-4 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-xs font-black">
           <span className="text-primary">{currentPage}</span>
           <span className="mx-1 text-slate-400">/</span>
           <span className="text-slate-600 dark:text-slate-300">{pageCount}</span>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          className="rounded-xl font-bold h-9 px-4"
          onClick={() => handlePageChange(currentPage + 1)} 
          disabled={currentPage >= pageCount}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}