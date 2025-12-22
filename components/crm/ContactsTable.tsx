'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Plus, Search } from 'lucide-react';

// Shadcn Components
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

interface ContactsTableProps {
  data: REContact[];
  pageCount: number;
  currentPage: number;
}

export default function ContactsTable({ data, pageCount, currentPage }: ContactsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // ... (Garde les fonctions handleSearch, handleRoleFilter, handlePageChange d'avant) ...
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


  const columns: ColumnDef<REContact>[] = [
    {
      accessorKey: 'name',
      header: 'Client',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary">
              {row.original.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm">{row.original.name}</span>
            <span className="text-xs text-muted-foreground">{row.original.email}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Rôle',
      cell: ({ row }) => {
        const role = row.getValue('role') as string;
        // Mapping de variants de badge shadcn si tu as des variants custom, sinon "outline" ou "secondary"
        return <Badge variant="secondary" className="capitalize">{role}</Badge>;
      }
    },
    {
      accessorKey: 'phone',
      header: 'Téléphone',
    },
    {
      accessorKey: 'source',
      header: 'Source',
      cell: ({ row }) => <span className="text-xs text-muted-foreground capitalize">{row.original.source}</span>
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const id = row.original.id;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => router.push(`/dashboard/contacts/${id}`)}>
                Voir la fiche
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/dashboard/contacts/${id}/edit`)}>
                Modifier
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Archiver (Odoo)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ];

  const table = useReactTable({
    data, columns, getCoreRowModel: getCoreRowModel(), manualPagination: true, pageCount,
  });

  return (
    <div className="space-y-4">
      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex w-full sm:w-auto items-center gap-2">
            <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Rechercher..." className="pl-8" onChange={(e) => handleSearch(e.target.value)} defaultValue={searchParams.get('search')?.toString()}/>
            </div>
             <Select onValueChange={handleRoleChange} defaultValue={searchParams.get('role') || 'all'}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Rôle" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tous les rôles</SelectItem>
                    <SelectItem value="buyer">Acheteur</SelectItem>
                    <SelectItem value="seller">Vendeur</SelectItem>
                    <SelectItem value="tenant">Locataire</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <Button onClick={() => router.push('/dashboard/contacts/create')}>
          <Plus className="mr-2 h-4 w-4" /> Nouveau Contact
        </Button>
      </div>

      {/* Table Component */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
                  className='hover:cursor-pointer'
                  key={row.id} data-state={row.getIsSelected() && "selected"}
                  onClick={(e) => {
                      const target = e.target as HTMLElement;
                      if (target.closest('button') || target.closest('[data-radix-collection-item]')) {
                          return;
                      }
                      router.push(`/dashboard/contacts/${row.original.id}`);
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Aucun résultat.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1}>
          Précédent
        </Button>
        <span className="text-sm text-muted-foreground">Page {currentPage} / {pageCount}</span>
        <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= pageCount}>
          Suivant
        </Button>
      </div>
    </div>
  );
}