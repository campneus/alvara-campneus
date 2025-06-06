import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { clienteAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ClienteForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdicao = !!id;

  const [formData, setFormData] = useState({
    nome_razao_social: '',
    cnpj_cpf: '',
    endereco: '',
    contato_email: '',
    contato_telefone: ''
  });
  
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const carregarCliente = async () => {
      if (!isEdicao) return;
      
      try {
        setCarregando(true);
        const cliente = await clienteAPI.buscarPorId(id);
        setFormData({
          nome_razao_social: cliente.nome_razao_social || '',
          cnpj_cpf: cliente.cnpj_cpf || '',
          endereco: cliente.endereco || '',
          contato_email: cliente.contato_email || '',
          contato_telefone: cliente.contato_telefone || ''
        });
        setErro(null);
      } catch (error) {
        console.error('Erro ao carregar cliente:', error);
        setErro('Não foi possível carregar os dados do cliente. Por favor, tente novamente.');
      } finally {
        setCarregando(false);
      }
    };

    carregarCliente();
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
        await clienteAPI.atualizar(id, formData);
      } else {
        await clienteAPI.criar(formData);
      }
      
      navigate('/clientes');
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      setErro(`Erro ao ${isEdicao ? 'atualizar' : 'cadastrar'} cliente: ${error.message}`);
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
        {isEdicao ? 'Editar Cliente' : 'Novo Cliente'}
      </h1>
      
      {erro && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{erro}</AlertDescription>
        </Alert>
      )}
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>{isEdicao ? 'Editar informações do cliente' : 'Preencha os dados do cliente'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label htmlFor="nome_razao_social" className="text-sm font-medium">
                  Nome / Razão Social *
                </label>
                <Input
                  id="nome_razao_social"
                  name="nome_razao_social"
                  value={formData.nome_razao_social}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="cnpj_cpf" className="text-sm font-medium">
                  CNPJ / CPF *
                </label>
                <Input
                  id="cnpj_cpf"
                  name="cnpj_cpf"
                  value={formData.cnpj_cpf}
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="contato_email" className="text-sm font-medium">
                    E-mail
                  </label>
                  <Input
                    id="contato_email"
                    name="contato_email"
                    type="email"
                    value={formData.contato_email}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="contato_telefone" className="text-sm font-medium">
                    Telefone
                  </label>
                  <Input
                    id="contato_telefone"
                    name="contato_telefone"
                    value={formData.contato_telefone}
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
              onClick={() => navigate('/clientes')}
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
                isEdicao ? 'Atualizar Cliente' : 'Cadastrar Cliente'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ClienteForm;

