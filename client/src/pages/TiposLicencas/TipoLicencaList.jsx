import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tipoLicencaTaxaAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const TipoLicencaList = () => {
  const navigate = useNavigate();
  const [tiposLicencas, setTiposLicencas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [tipoParaExcluir, setTipoParaExcluir] = useState(null);
  const [filtro, setFiltro] = useState('');

  const carregarTiposLicencas = async () => {
    try {
      setCarregando(true);
      const dados = await tipoLicencaTaxaAPI.listar();
      setTiposLicencas(dados);
      setErro(null);
    } catch (error) {
      console.error('Erro ao carregar tipos de licenças:', error);
      setErro('Não foi possível carregar a lista de tipos de licenças. Por favor, tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarTiposLicencas();
  }, []);

  const handleExcluir = async () => {
    if (!tipoParaExcluir) return;
    
    try {
      await tipoLicencaTaxaAPI.excluir(tipoParaExcluir.id);
      setTipoParaExcluir(null);
      carregarTiposLicencas();
    } catch (error) {
      console.error('Erro ao excluir tipo de licença:', error);
      setErro(`Erro ao excluir tipo de licença: ${error.message}`);
    }
  };

  const tiposFiltrados = tiposLicencas.filter(tipo => 
    tipo.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    (tipo.descricao && tipo.descricao.toLowerCase().includes(filtro.toLowerCase()))
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tipos de Licenças/Taxas</h1>
        <Button onClick={() => navigate('/tipos-licencas/novo')}>
          <Plus className="mr-2 h-4 w-4" /> Novo Tipo
        </Button>
      </div>
      
      {erro && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
          <p>{erro}</p>
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Tipos de Licenças/Taxas</CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou descrição..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent>
          {carregando ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : tiposFiltrados.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tempo de Expiração (dias)</TableHead>
                  <TableHead>Frequência de Renovação (meses)</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tiposFiltrados.map((tipo) => (
                  <TableRow key={tipo.id}>
                    <TableCell className="font-medium">{tipo.nome}</TableCell>
                    <TableCell>{tipo.tempo_expiracao_dias || '-'}</TableCell>
                    <TableCell>{tipo.frequencia_renovacao_meses || '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/tipos-licencas/${tipo.id}`)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setTipoParaExcluir(tipo)}
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
              <p className="text-muted-foreground">Nenhum tipo de licença/taxa encontrado.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Diálogo de confirmação de exclusão */}
      <Dialog open={!!tipoParaExcluir} onOpenChange={() => setTipoParaExcluir(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
          </DialogHeader>
          <p>
            Tem certeza que deseja excluir o tipo de licença/taxa "{tipoParaExcluir?.nome}"?
            Esta ação não pode ser desfeita.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTipoParaExcluir(null)}>
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

export default TipoLicencaList;

