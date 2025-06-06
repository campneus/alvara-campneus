import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { licencaTaxaAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Search, Filter, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatarData, getStatusClass } from '@/lib/utils';

const LicencaTaxaList = () => {
  const navigate = useNavigate();
  const [licencasTaxas, setLicencasTaxas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [licencaParaExcluir, setLicencaParaExcluir] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');

  const carregarLicencasTaxas = async () => {
    try {
      setCarregando(true);
      let dados;
      
      if (filtroStatus) {
        dados = await licencaTaxaAPI.listarPorStatus(filtroStatus);
      } else {
        dados = await licencaTaxaAPI.listar();
      }
      
      setLicencasTaxas(dados);
      setErro(null);
    } catch (error) {
      console.error('Erro ao carregar licenças/taxas:', error);
      setErro('Não foi possível carregar a lista de licenças/taxas. Por favor, tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarLicencasTaxas();
  }, [filtroStatus]);

  const handleExcluir = async () => {
    if (!licencaParaExcluir) return;
    
    try {
      await licencaTaxaAPI.excluir(licencaParaExcluir.id);
      setLicencaParaExcluir(null);
      carregarLicencasTaxas();
    } catch (error) {
      console.error('Erro ao excluir licença/taxa:', error);
      setErro(`Erro ao excluir licença/taxa: ${error.message}`);
    }
  };

  const licencasFiltradas = licencasTaxas.filter(licenca => {
    const clienteNome = licenca.cliente?.nome_razao_social || '';
    const tipoNome = licenca.tipoLicenca?.nome || '';
    const localidadeNome = licenca.localidade?.nome || '';
    
    return (
      clienteNome.toLowerCase().includes(filtro.toLowerCase()) ||
      tipoNome.toLowerCase().includes(filtro.toLowerCase()) ||
      localidadeNome.toLowerCase().includes(filtro.toLowerCase())
    );
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Licenças e Taxas</h1>
        <Button onClick={() => navigate('/licencas-taxas/nova')}>
          <Plus className="mr-2 h-4 w-4" /> Nova Licença/Taxa
        </Button>
      </div>
      
      {erro && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
          <p>{erro}</p>
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Licenças e Taxas</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente, tipo ou localidade..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select 
                value={filtroStatus} 
                onValueChange={setFiltroStatus}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="Ativa">Ativa</SelectItem>
                  <SelectItem value="Expirada">Expirada</SelectItem>
                  <SelectItem value="Aguardando Pagamento">Aguardando Pagamento</SelectItem>
                  <SelectItem value="Renovada">Renovada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {carregando ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : licencasFiltradas.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Localidade</TableHead>
                    <TableHead>Emissão</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {licencasFiltradas.map((licenca) => (
                    <TableRow key={licenca.id}>
                      <TableCell className="font-medium">{licenca.cliente?.nome_razao_social || '-'}</TableCell>
                      <TableCell>{licenca.tipoLicenca?.nome || '-'}</TableCell>
                      <TableCell>{licenca.localidade?.nome || '-'}</TableCell>
                      <TableCell>{formatarData(licenca.data_emissao)}</TableCell>
                      <TableCell>{formatarData(licenca.data_vencimento)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusClass(licenca.status)}>
                          {licenca.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/licencas-taxas/${licenca.id}`)}
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/licencas-taxas/${licenca.id}/documentos`)}
                            title="Documentos"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setLicencaParaExcluir(licenca)}
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
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Nenhuma licença/taxa encontrada.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Diálogo de confirmação de exclusão */}
      <Dialog open={!!licencaParaExcluir} onOpenChange={() => setLicencaParaExcluir(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
          </DialogHeader>
          <p>
            Tem certeza que deseja excluir esta licença/taxa?
            Esta ação não pode ser desfeita.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLicencaParaExcluir(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleExcluir}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LicencaTaxaList;

