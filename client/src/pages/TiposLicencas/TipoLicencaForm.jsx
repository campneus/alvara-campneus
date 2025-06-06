import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tipoLicencaTaxaAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const TipoLicencaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdicao = !!id;

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    tempo_expiracao_dias: '',
    frequencia_renovacao_meses: ''
  });
  
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const carregarTipoLicenca = async () => {
      if (!isEdicao) return;
      
      try {
        setCarregando(true);
        const tipoLicenca = await tipoLicencaTaxaAPI.buscarPorId(id);
        setFormData({
          nome: tipoLicenca.nome || '',
          descricao: tipoLicenca.descricao || '',
          tempo_expiracao_dias: tipoLicenca.tempo_expiracao_dias?.toString() || '',
          frequencia_renovacao_meses: tipoLicenca.frequencia_renovacao_meses?.toString() || ''
        });
        setErro(null);
      } catch (error) {
        console.error('Erro ao carregar tipo de licença:', error);
        setErro('Não foi possível carregar os dados do tipo de licença. Por favor, tente novamente.');
      } finally {
        setCarregando(false);
      }
    };

    carregarTipoLicenca();
  }, [id, isEdicao]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Converter campos numéricos
    const dadosParaEnviar = {
      ...formData,
      tempo_expiracao_dias: formData.tempo_expiracao_dias ? parseInt(formData.tempo_expiracao_dias) : null,
      frequencia_renovacao_meses: formData.frequencia_renovacao_meses ? parseInt(formData.frequencia_renovacao_meses) : null
    };
    
    try {
      setSalvando(true);
      
      if (isEdicao) {
        await tipoLicencaTaxaAPI.atualizar(id, dadosParaEnviar);
      } else {
        await tipoLicencaTaxaAPI.criar(dadosParaEnviar);
      }
      
      navigate('/tipos-licencas');
    } catch (error) {
      console.error('Erro ao salvar tipo de licença:', error);
      setErro(`Erro ao ${isEdicao ? 'atualizar' : 'cadastrar'} tipo de licença: ${error.message}`);
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
        {isEdicao ? 'Editar Tipo de Licença/Taxa' : 'Novo Tipo de Licença/Taxa'}
      </h1>
      
      {erro && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{erro}</AlertDescription>
        </Alert>
      )}
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>{isEdicao ? 'Editar informações do tipo de licença/taxa' : 'Preencha os dados do tipo de licença/taxa'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label htmlFor="nome" className="text-sm font-medium">
                  Nome *
                </label>
                <Input
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="descricao" className="text-sm font-medium">
                  Descrição
                </label>
                <Textarea
                  id="descricao"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="tempo_expiracao_dias" className="text-sm font-medium">
                    Tempo de Expiração (dias)
                  </label>
                  <Input
                    id="tempo_expiracao_dias"
                    name="tempo_expiracao_dias"
                    type="number"
                    min="1"
                    value={formData.tempo_expiracao_dias}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="frequencia_renovacao_meses" className="text-sm font-medium">
                    Frequência de Renovação (meses)
                  </label>
                  <Input
                    id="frequencia_renovacao_meses"
                    name="frequencia_renovacao_meses"
                    type="number"
                    min="1"
                    value={formData.frequencia_renovacao_meses}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/tipos-licencas')}
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
                isEdicao ? 'Atualizar Tipo de Licença/Taxa' : 'Cadastrar Tipo de Licença/Taxa'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default TipoLicencaForm;

