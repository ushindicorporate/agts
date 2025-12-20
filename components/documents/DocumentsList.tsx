'use client'

import { useState } from 'react';
import { FileText, Image as ImageIcon, File, Download, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { deleteDocument, getDocumentContent } from '@/lib/actions/document-actions';
import { Document } from '@/lib/types/documents';

// Helper Icône
const getFileIcon = (mime: string) => {
  if (mime.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
  if (mime.includes('image')) return <ImageIcon className="h-5 w-5 text-blue-500" />;
  return <File className="h-5 w-5 text-gray-500" />;
};

// Helper Taille
const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export default function DocumentsList({ documents }: { documents: Document[] }) {
  const [downloading, setDownloading] = useState<number | null>(null);

  const handleDownload = async (doc: Document) => {
    setDownloading(doc.id);
    const res = await getDocumentContent(doc.id);
    setDownloading(null);

    if (res.success && res.base64) {
      // Création dynamique d'un lien de téléchargement
      const link = document.createElement('a');
      link.href = `data:${res.mime};base64,${res.base64}`;
      link.download = res.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      toast.error("Erreur téléchargement");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce fichier ?")) return;
    const res = await deleteDocument(id);
    if (res.success) toast.success("Fichier supprimé");
    else toast.error("Erreur suppression");
  };

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Nom du fichier</TableHead>
            <TableHead>Lié à</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Taille</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.length === 0 ? (
            <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Aucun document.</TableCell>
            </TableRow>
          ) : (
            documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>{getFileIcon(doc.type)}</TableCell>
                <TableCell className="font-medium">{doc.name}</TableCell>
                <TableCell>
                    {/* Badge contextuel */}
                    {doc.resName ? (
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-gray-700">{doc.resName}</span>
                            <span className="text-[10px] text-gray-400 uppercase">{doc.resModel.replace('_', ' ')}</span>
                        </div>
                    ) : <span className="text-gray-400">-</span>}
                </TableCell>
                <TableCell className="text-gray-500">
                    {new Date(doc.createDate).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right text-xs text-gray-500">
                    {formatSize(doc.fileSize)}
                </TableCell>
                <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => handleDownload(doc)} disabled={downloading === doc.id}>
                        {downloading === doc.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(doc.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}