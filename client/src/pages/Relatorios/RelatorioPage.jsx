import React, { useState, useEffect } from 'react';
import { dashboardAPI, clienteAPI, tipoLicencaTaxaAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatarData, formatarMoeda, getStatusClass } from '@/lib/utils';
import { FileDown, Printer } from 'lucide-react';

const RelatorioPage = () => {
  const [dados, setDados] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [tiposLicencas, setTiposLicencas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  
  const [filtros, setFiltros] = useState({
    cliente_id: '',
    tipo_licenca_id: '',
    status: '',
    data_inicio: '',
    data_fim: ''
  });

  useEffect(() => {
    const carregarDadosIniciais = async () => {
      try {
        setCarregando(true);
        
        // Carregar listas para os selects
        const [clientesData, tiposData] = await Promise.all([
          clienteAPI.listar(),
          tipoLicencaTaxaAPI.listar()
        ]);
        
        setClientes(clientesData);
        setTiposLicencas(tiposData);
        
        // Carregar relatório inicial sem filtros
        await gerarRelatorio();
        
        setErro(null);
      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
        setErro('Não foi possível carregar os dados iniciais. Por favor, tente novamente.');
      } finally {
        setCarregando(false);
      }
    };

    carregarDadosIniciais();
  }, []);

  const gerarRelatorio = async () => {
    try {
      setCarregando(true);
      const resultado = await dashboardAPI.obterDadosRelatorios(filtros);
      setDados(resultado);
      setErro(null);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      setErro('Não foi possível gerar o relatório. Por favor, tente novamente.');
      setDados([]);
    } finally {
      setCarregando(false);
    }
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    gerarRelatorio();
  };

  const exportarCSV = () => {
    if (dados.length === 0) return;
    
    // Preparar cabeçalhos
    const cabecalhos = ['Cliente', 'Tipo', 'Emissão', 'Vencimento', 'Status', 'Valor'];
    
    // Preparar linhas de dados
    const linhas = dados.map(item => [
      item.cliente?.nome_razao_social || '',
      item.tipoLicenca?.nome || '',
      formatarData(item.data_emissao),
      formatarData(item.data_vencimento),
      item.status,
      item.pagamentos && item.pagamentos.length > 0 ? 
        item.pagamentos[0].valor : '0'
    ]);
    
    // Combinar cabeçalhos e linhas
    const conteudoCSV = [
      cabecalhos.join(','),
      ...linhas.map(linha => linha.join(','))
    ].join('\n');
    
    // Criar blob e link para download
    const blob = new Blob([conteudoCSV], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_licencas_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const imprimir = () => {
    window.print();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Relatórios</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportarCSV} disabled={dados.length === 0}>
            <FileDown className="mr-2 h-4 w-4" /> Exportar CSV
          </Button>
          <Button variant="outline" onClick={imprimir} disabled={dados.length === 0}>
            <Printer className="mr-2 h-4 w-4" /> Imprimir
          </Button>
        </div>
      </div>
      
      {erro && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
          <p>{erro}</p>
        </div>
      )}
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Cliente */}
              <div className="space-y-2">
                <label htmlFor="cliente_id" className="text-sm font-medium">
                  Cliente
                </label>
                <Select 
                  value={filtros.cliente_id} 
                  onValueChange={(value) => handleFiltroChange('cliente_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os clientes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    {clientes.map(cliente => (
                      <SelectItem key={cliente.id} value={cliente.id.toString()}>
                        {cliente.nome_razao_social}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Tipo de Licença/Taxa */}
              <div className="space-y-2">
                <label htmlFor="tipo_licenca_id" className="text-sm font-medium">
                  Tipo de Licença/Taxa
                </label>
                <Select 
                  value={filtros.tipo_licenca_id} 
                  onValueChange={(value) => handleFiltroChange('tipo_licenca_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    {tiposLicencas.map(tipo => (
                      <SelectItem key={tipo.id} value={tipo.id.toString()}>
                        {tipo.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Status */}
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Status
                </label>
                <Select 
                  value={filtros.status} 
                  onValueChange={(value) => handleFiltroChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os status" />
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
              
              {/* Data Início */}
              <div className="space-y-2">
                <label htmlFor="data_inicio" className="text-sm font-medium">
                  Data Início
                </label>
                <Input
                  id="data_inicio"
                  type="date"
                  value={filtros.data_inicio}
                  onChange={(e) => handleFiltroChange('data_inicio', e.target.value)}
                />
              </div>
              
              {/* Data Fim */}
              <div className="space-y-2">
                <label htmlFor="data_fim" className="text-sm font-medium">
                  Data Fim
                </label>
                <Input
                  id="data_fim"
                  type="date"
                  value={filtros.data_fim}
                  onChange={(e) => handleFiltroChange('data_fim', e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" disabled={carregando}>
                {carregando ? 'Gerando...' : 'Gerar Relatório'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Resultado do Relatório</CardTitle>
        </CardHeader>
        <CardContent>
          {carregando ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : dados.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Emissão</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dados.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.cliente?.nome_razao_social || '-'}</TableCell>
                      <TableCell>{item.tipoLicenca?.nome || '-'}</TableCell>
                      <TableCell>{formatarData(item.data_emissao)}</TableCell>
                      <TableCell>{formatarData(item.data_vencimento)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusClass(item.status)}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.pagamentos && item.pagamentos.length > 0 ? 
                          formatarMoeda(item.pagamentos[0].valor) : 
                          '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Nenhum resultado encontrado.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RelatorioPage;

