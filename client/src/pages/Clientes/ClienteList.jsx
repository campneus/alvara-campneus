import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clienteAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const ClienteList = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [clienteParaExcluir, setClienteParaExcluir] = useState(null);
  const [filtro, setFiltro] = useState('');

  const carregarClientes = async () => {
    try {
      setCarregando(true);
      const dados = await clienteAPI.listar();
      setClientes(dados);
      setErro(null);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      setErro('Não foi possível carregar a lista de clientes. Por favor, tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  const handleExcluir = async () => {
    if (!clienteParaExcluir) return;
    
    try {
      await clienteAPI.excluir(clienteParaExcluir.id);
      setClienteParaExcluir(null);
      carregarClientes();
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      setErro(`Erro ao excluir cliente: ${error.message}`);
    }
  };

  const clientesFiltrados = clientes.filter(cliente => 
    cliente.nome_razao_social.toLowerCase().includes(filtro.toLowerCase()) ||
    cliente.cnpj_cpf.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <Button onClick={() => navigate('/clientes/novo')}>
          <Plus className="mr-2 h-4 w-4" /> Novo Cliente
        </Button>
      </div>
      
      {erro && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
          <p>{erro}</p>
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou CNPJ/CPF..."
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
          ) : clientesFiltrados.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome / Razão Social</TableHead>
                  <TableHead>CNPJ / CPF</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientesFiltrados.map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell className="font-medium">{cliente.nome_razao_social}</TableCell>
                    <TableCell>{cliente.cnpj_cpf}</TableCell>
                    <TableCell>{cliente.contato_email || '-'}</TableCell>
                    <TableCell>{cliente.contato_telefone || '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/clientes/${cliente.id}`)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setClienteParaExcluir(cliente)}
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
              <p className="text-muted-foreground">Nenhum cliente encontrado.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Diálogo de confirmação de exclusão */}
      <Dialog open={!!clienteParaExcluir} onOpenChange={() => setClienteParaExcluir(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
          </DialogHeader>
          <p>
            Tem certeza que deseja excluir o cliente "{clienteParaExcluir?.nome_razao_social}"?
            Esta ação não pode ser desfeita.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClienteParaExcluir(null)}>
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

export default ClienteList;

