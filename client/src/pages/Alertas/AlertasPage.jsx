import React, { useState, useEffect } from 'react';
import { alertaAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { formatarData, getDiasRestantesClass } from '@/lib/utils';
import { Bell, RefreshCw, Calendar } from 'lucide-react';

const AlertasPage = () => {
  const [alertasVencimento, setAlertasVencimento] = useState([]);
  const [alertasVencidas, setAlertasVencidas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState(null);

  const carregarAlertas = async () => {
    try {
      setCarregando(true);
      
      // Carregar alertas de vencimento (próximos 30 dias)
      const alertasVencimentoData = await alertaAPI.obterAlertasVencimento(30);
      setAlertasVencimento(alertasVencimentoData);
      
      // Carregar alertas de licenças vencidas
      const alertasVencidasData = await alertaAPI.obterAlertasVencidas();
      setAlertasVencidas(alertasVencidasData);
      
      setErro(null);
    } catch (error) {
      console.error('Erro ao carregar alertas:', error);
      setErro('Não foi possível carregar os alertas. Por favor, tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarAlertas();
  }, []);

  const atualizarStatusVencidas = async () => {
    try {
      setAtualizando(true);
      await alertaAPI.atualizarStatusVencidas();
      await carregarAlertas();
      setErro(null);
    } catch (error) {
      console.error('Erro ao atualizar status de licenças vencidas:', error);
      setErro('Não foi possível atualizar o status das licenças vencidas. Por favor, tente novamente.');
    } finally {
      setAtualizando(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Alertas e Notificações</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={carregarAlertas} disabled={carregando}>
            <RefreshCw className={`mr-2 h-4 w-4 ${carregando ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button onClick={atualizarStatusVencidas} disabled={atualizando || alertasVencidas.length === 0}>
            <Calendar className="mr-2 h-4 w-4" />
            Atualizar Status Vencidas
          </Button>
        </div>
      </div>
      
      {erro && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{erro}</AlertDescription>
        </Alert>
      )}
      
      {/* Alertas de licenças a vencer */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5 text-yellow-500" />
            Licenças/Taxas a Vencer (Próximos 30 dias)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {carregando ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : alertasVencimento.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tipo de Licença/Taxa</TableHead>
                  <TableHead>Data de Vencimento</TableHead>
                  <TableHead>Dias Restantes</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alertasVencimento.map((alerta) => (
                  <TableRow key={alerta.id}>
                    <TableCell className="font-medium">{alerta.cliente}</TableCell>
                    <TableCell>{alerta.tipoLicenca}</TableCell>
                    <TableCell>{formatarData(alerta.dataVencimento)}</TableCell>
                    <TableCell className={getDiasRestantesClass(alerta.diasRestantes)}>
                      {alerta.diasRestantes} dias
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        A Vencer
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Nenhuma licença/taxa a vencer nos próximos 30 dias.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Alertas de licenças vencidas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5 text-red-500" />
            Licenças/Taxas Vencidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {carregando ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : alertasVencidas.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tipo de Licença/Taxa</TableHead>
                  <TableHead>Data de Vencimento</TableHead>
                  <TableHead>Dias Vencidos</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alertasVencidas.map((alerta) => (
                  <TableRow key={alerta.id}>
                    <TableCell className="font-medium">{alerta.cliente}</TableCell>
                    <TableCell>{alerta.tipoLicenca}</TableCell>
                    <TableCell>{formatarData(alerta.dataVencimento)}</TableCell>
                    <TableCell className="text-red-600 font-bold">
                      {alerta.diasVencidos} dias
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-red-100 text-red-800">
                        Vencida
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Nenhuma licença/taxa vencida.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertasPage;

