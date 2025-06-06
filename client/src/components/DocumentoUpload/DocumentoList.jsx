import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Trash2 } from 'lucide-react';
import { formatarData } from '@/lib/utils';

const DocumentoList = ({ documentos = [], onExcluir }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Documentos Anexos</CardTitle>
      </CardHeader>
      <CardContent>
        {documentos.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Data de Upload</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documentos.map((documento) => (
                <TableRow key={documento.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                      {documento.nome_arquivo}
                    </div>
                  </TableCell>
                  <TableCell>{documento.tipo_documento}</TableCell>
                  <TableCell>{formatarData(documento.data_upload)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(documento.caminho_arquivo, '_blank')}
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onExcluir && onExcluir(documento.id)}
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">Nenhum documento anexado.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentoList;

