import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { licencaTaxaAPI, clienteAPI, tipoLicencaTaxaAPI, orgaoReguladorAPI, localidadeAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const LicencaTaxaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdicao = !!id;

  const [formData, setFormData] = useState({
    cliente_id: '',
    tipo_licenca_id: '',
    orgao_regulador_id: '',
    localidade_id: '',
    data_emissao: '',
    data_vencimento: '',
    status: 'Ativa',
    observacoes: ''
  });
  
  const [clientes, setClientes] = useState([]);
  const [tiposLicencas, setTiposLicencas] = useState([]);
  const [orgaosReguladores, setOrgaosReguladores] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setCarregando(true);
        
        // Carregar listas para os selects
        const [clientesData, tiposData, orgaosData, localidadesData] = await Promise.all([
          clienteAPI.listar(),
          tipoLicencaTaxaAPI.listar(),
          orgaoReguladorAPI.listar(),
          localidadeAPI.listar()
        ]);
        
        setClientes(clientesData);
        setTiposLicencas(tiposData);
        setOrgaosReguladores(orgaosData);
        setLocalidades(localidadesData);
        
        // Se for edição, carregar dados da licença/taxa
        if (isEdicao) {
          const licencaTaxa = await licencaTaxaAPI.buscarPorId(id);
          
          // Formatar datas para o formato esperado pelo input type="date"
          const formatarData = (dataString) => {
            if (!dataString) return '';
            const data = new Date(dataString);
            return data.toISOString().split('T')[0];
          };
          
          setFormData({
            cliente_id: licencaTaxa.cliente_id?.toString() || '',
            tipo_licenca_id: licencaTaxa.tipo_licenca_id?.toString() || '',
            orgao_regulador_id: licencaTaxa.orgao_regulador_id?.toString() || '',
            localidade_id: licencaTaxa.localidade_id?.toString() || '',
            data_emissao: formatarData(licencaTaxa.data_emissao),
            data_vencimento: formatarData(licencaTaxa.data_vencimento),
            status: licencaTaxa.status || 'Ativa',
            observacoes: licencaTaxa.observacoes || ''
          });
        }
        
        setErro(null);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setErro('Não foi possível carregar os dados necessários. Por favor, tente novamente.');
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, [id, isEdicao]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSalvando(true);
      
      if (isEdicao) {
        await licencaTaxaAPI.atualizar(id, formData);
      } else {
        await licencaTaxaAPI.criar(formData);
      }
      
      navigate('/licencas-taxas');
    } catch (error) {
      console.error('Erro ao salvar licença/taxa:', error);
      setErro(`Erro ao ${isEdicao ? 'atualizar' : 'cadastrar'} licença/taxa: ${error.message}`);
      setSalvando(false);
    }
  };

  if (carregando) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        {isEdicao ? 'Editar Licença/Taxa' : 'Nova Licença/Taxa'}
      </h1>
      
      {erro && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{erro}</AlertDescription>
        </Alert>
      )}
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>{isEdicao ? 'Editar informações da licença/taxa' : 'Preencha os dados da licença/taxa'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {/* Cliente */}
              <div className="space-y-2">
                <label htmlFor="cliente_id" className="text-sm font-medium">
                  Cliente *
                </label>
                <Select 
                  value={formData.cliente_id} 
                  onValueChange={(value) => handleSelectChange('cliente_id', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
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
                  Tipo de Licença/Taxa *
                </label>
                <Select 
                  value={formData.tipo_licenca_id} 
                  onValueChange={(value) => handleSelectChange('tipo_licenca_id', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposLicencas.map(tipo => (
                      <SelectItem key={tipo.id} value={tipo.id.toString()}>
                        {tipo.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Órgão Regulador */}
              <div className="space-y-2">
                <label htmlFor="orgao_regulador_id" className="text-sm font-medium">
                  Órgão Regulador
                </label>
                <Select 
                  value={formData.orgao_regulador_id} 
                  onValueChange={(value) => handleSelectChange('orgao_regulador_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um órgão regulador" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhum</SelectItem>
                    {orgaosReguladores.map(orgao => (
                      <SelectItem key={orgao.id} value={orgao.id.toString()}>
                        {orgao.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Localidade */}
              <div className="space-y-2">
                <label htmlFor="localidade_id" className="text-sm font-medium">
                  Localidade
                </label>
                <Select 
                  value={formData.localidade_id} 
                  onValueChange={(value) => handleSelectChange('localidade_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma localidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhuma</SelectItem>
                    {localidades.map(localidade => (
                      <SelectItem key={localidade.id} value={localidade.id.toString()}>
                        {localidade.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Data de Emissão */}
                <div className="space-y-2">
                  <label htmlFor="data_emissao" className="text-sm font-medium">
                    Data de Emissão *
                  </label>
                  <Input
                    id="data_emissao"
                    name="data_emissao"
                    type="date"
                    value={formData.data_emissao}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                {/* Data de Vencimento */}
                <div className="space-y-2">
                  <label htmlFor="data_vencimento" className="text-sm font-medium">
                    Data de Vencimento *
                  </label>
                  <Input
                    id="data_vencimento"
                    name="data_vencimento"
                    type="date"
                    value={formData.data_vencimento}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              {/* Status */}
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Status
                </label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativa">Ativa</SelectItem>
                    <SelectItem value="Expirada">Expirada</SelectItem>
                    <SelectItem value="Aguardando Pagamento">Aguardando Pagamento</SelectItem>
                    <SelectItem value="Renovada">Renovada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Observações */}
              <div className="space-y-2">
                <label htmlFor="observacoes" className="text-sm font-medium">
                  Observações
                </label>
                <Textarea
                  id="observacoes"
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/licencas-taxas')}
              disabled={salvando}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={salvando}>
              {salvando ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Salvando...
                </>
              ) : (
                isEdicao ? 'Atualizar Licença/Taxa' : 'Cadastrar Licença/Taxa'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LicencaTaxaForm;

