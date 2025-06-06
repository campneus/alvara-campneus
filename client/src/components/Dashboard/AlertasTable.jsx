import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatarData, getDiasRestantesClass } from '@/lib/utils';

const AlertasTable = ({ alertas }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Licenças/Taxas a Vencer</CardTitle>
      </CardHeader>
      <CardContent>
        {alertas && alertas.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Dias Restantes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alertas.map((alerta) => (
                <TableRow key={alerta.id}>
                  <TableCell>{alerta.cliente}</TableCell>
                  <TableCell>{alerta.tipoLicenca}</TableCell>
                  <TableCell>{formatarData(alerta.dataVencimento)}</TableCell>
                  <TableCell className={getDiasRestantesClass(alerta.diasRestantes)}>
                    {alerta.diasRestantes}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex justify-center items-center py-8">
            <p className="text-muted-foreground">Nenhum alerta encontrado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertasTable;

