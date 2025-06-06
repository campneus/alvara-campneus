import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { localidadeAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const LocalidadeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdicao = !!id;

  const [formData, setFormData] = useState({
    nome: '',
    endereco: ''
  });
  
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const carregarLocalidade = async () => {
      if (!isEdicao) return;
      
      try {
        setCarregando(true);
        const localidade = await localidadeAPI.buscarPorId(id);
        setFormData({
          nome: localidade.nome || '',
          endereco: localidade.endereco || ''
        });
        setErro(null);
      } catch (error) {
        console.error('Erro ao carregar localidade:', error);
        setErro('Não foi possível carregar os dados da localidade. Por favor, tente novamente.');
      } finally {
        setCarregando(false);
      }
    };

    carregarLocalidade();
  }, [id, isEdicao]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSalvando(true);
      
      if (isEdicao) {
        await localidadeAPI.atualizar(id, formData);
      } else {
        await localidadeAPI.criar(formData);
      }
      
      navigate('/localidades');
    } catch (error) {
      console.error('Erro ao salvar localidade:', error);
      setErro(`Erro ao ${isEdicao ? 'atualizar' : 'cadastrar'} localidade: ${error.message}`);
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
        {isEdicao ? 'Editar Localidade' : 'Nova Localidade'}
      </h1>
      
      {erro && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{erro}</AlertDescription>
        </Alert>
      )}
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>{isEdicao ? 'Editar informações da localidade' : 'Preencha os dados da localidade'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label htmlFor="nome" className="text-sm font-medium">
                  Nome da Localidade *
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
                <label htmlFor="endereco" className="text-sm font-medium">
                  Endereço
                </label>
                <Textarea
                  id="endereco"
                  name="endereco"
                  value={formData.endereco}
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
              onClick={() => navigate('/localidades')}
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
                isEdicao ? 'Atualizar Localidade' : 'Cadastrar Localidade'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LocalidadeForm;

