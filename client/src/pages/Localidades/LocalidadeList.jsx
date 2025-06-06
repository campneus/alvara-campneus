import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { localidadeAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const LocalidadeList = () => {
  const navigate = useNavigate();
  const [localidades, setLocalidades] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [localidadeParaExcluir, setLocalidadeParaExcluir] = useState(null);
  const [filtro, setFiltro] = useState('');

  const carregarLocalidades = async () => {
    try {
      setCarregando(true);
      const dados = await localidadeAPI.listar();
      setLocalidades(dados);
      setErro(null);
    } catch (error) {
      console.error('Erro ao carregar localidades:', error);
      setErro('Não foi possível carregar a lista de localidades. Por favor, tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarLocalidades();
  }, []);

  const handleExcluir = async () => {
    if (!localidadeParaExcluir) return;
    
    try {
      await localidadeAPI.excluir(localidadeParaExcluir.id);
      setLocalidadeParaExcluir(null);
      carregarLocalidades();
    } catch (error) {
      console.error('Erro ao excluir localidade:', error);
      setErro(`Erro ao excluir localidade: ${error.message}`);
    }
  };

  const localidadesFiltradas = localidades.filter(localidade => 
    localidade.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    (localidade.endereco && localidade.endereco.toLowerCase().includes(filtro.toLowerCase()))
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Localidades</h1>
        <Button onClick={() => navigate('/localidades/nova')}>
          <Plus className="mr-2 h-4 w-4" /> Nova Localidade
        </Button>
      </div>
      
      {erro && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
          <p>{erro}</p>
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Localidades</CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou endereço..."
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
          ) : localidadesFiltradas.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {localidadesFiltradas.map((localidade) => (
                  <TableRow key={localidade.id}>
                    <TableCell className="font-medium">{localidade.nome}</TableCell>
                    <TableCell>{localidade.endereco || '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/localidades/${localidade.id}`)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setLocalidadeParaExcluir(localidade)}
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
              <p className="text-muted-foreground">Nenhuma localidade encontrada.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Diálogo de confirmação de exclusão */}
      <Dialog open={!!localidadeParaExcluir} onOpenChange={() => setLocalidadeParaExcluir(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
          </DialogHeader>
          <p>
            Tem certeza que deseja excluir a localidade "{localidadeParaExcluir?.nome}"?
            Esta ação não pode ser desfeita.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLocalidadeParaExcluir(null)}>
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

export default LocalidadeList;

