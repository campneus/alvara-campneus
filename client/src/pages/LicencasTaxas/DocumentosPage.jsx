import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { licencaTaxaAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft } from 'lucide-react';
import DocumentoUploadForm from '@/components/DocumentoUpload/DocumentoUploadForm';
import DocumentoList from '@/components/DocumentoUpload/DocumentoList';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const DocumentosPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [licencaTaxa, setLicencaTaxa] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [documentoParaExcluir, setDocumentoParaExcluir] = useState(null);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      
      // Carregar dados da licença/taxa
      const licencaTaxaData = await licencaTaxaAPI.buscarPorId(id);
      setLicencaTaxa(licencaTaxaData);
      
      // Simular dados de documentos (em um cenário real, estes viriam da API)
      // Aqui estamos simulando que a licença/taxa já tem alguns documentos anexados
      const documentosSimulados = [
        {
          id: 1,
          licenca_taxa_id: id,
          nome_arquivo: 'alvara_2023.pdf',
          caminho_arquivo: '#',
          tipo_documento: 'Alvará',
          data_upload: new Date().toISOString()
        },
        {
          id: 2,
          licenca_taxa_id: id,
          nome_arquivo: 'comprovante_pagamento.jpg',
          caminho_arquivo: '#',
          tipo_documento: 'Comprovante de Pagamento',
          data_upload: new Date(Date.now() - 86400000).toISOString() // Ontem
        }
      ];
      
      setDocumentos(documentosSimulados);
      setErro(null);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setErro('Não foi possível carregar os dados. Por favor, tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [id]);

  const handleUploadComplete = () => {
    // Simular adição de um novo documento
    const novoDocumento = {
      id: documentos.length + 1,
      licenca_taxa_id: id,
      nome_arquivo: `documento_${Date.now()}.pdf`,
      caminho_arquivo: '#',
      tipo_documento: 'Outro',
      data_upload: new Date().toISOString()
    };
    
    setDocumentos([...documentos, novoDocumento]);
  };

  const handleExcluirDocumento = (documentoId) => {
    const documento = documentos.find(doc => doc.id === documentoId);
    if (documento) {
      setDocumentoParaExcluir(documento);
    }
  };

  const confirmarExclusao = () => {
    if (!documentoParaExcluir) return;
    
    // Simular exclusão do documento
    const novaLista = documentos.filter(doc => doc.id !== documentoParaExcluir.id);
    setDocumentos(novaLista);
    setDocumentoParaExcluir(null);
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
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          size="icon" 
          className="mr-4"
          onClick={() => navigate('/licencas-taxas')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">
          Documentos da Licença/Taxa
        </h1>
      </div>
      
      {erro && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{erro}</AlertDescription>
        </Alert>
      )}
      
      {licencaTaxa && (
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cliente</p>
              <p className="text-lg">{licencaTaxa.cliente?.nome_razao_social || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tipo</p>
              <p className="text-lg">{licencaTaxa.tipoLicenca?.nome || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Data de Vencimento</p>
              <p className="text-lg">{new Date(licencaTaxa.data_vencimento).toLocaleDateString('pt-BR')}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <p className="text-lg">{licencaTaxa.status}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DocumentoUploadForm 
          licencaTaxaId={id} 
          onUploadComplete={handleUploadComplete} 
        />
        <DocumentoList 
          documentos={documentos} 
          onExcluir={handleExcluirDocumento} 
        />
      </div>
      
      {/* Diálogo de confirmação de exclusão */}
      <Dialog open={!!documentoParaExcluir} onOpenChange={() => setDocumentoParaExcluir(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
          </DialogHeader>
          <p>
            Tem certeza que deseja excluir o documento "{documentoParaExcluir?.nome_arquivo}"?
            Esta ação não pode ser desfeita.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDocumentoParaExcluir(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmarExclusao}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentosPage;

