import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload } from 'lucide-react';

const DocumentoUploadForm = ({ licencaTaxaId, onUploadComplete }) => {
  const [arquivo, setArquivo] = useState(null);
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);
  const [progresso, setProgresso] = useState(0);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setArquivo(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!arquivo) {
      setErro('Por favor, selecione um arquivo para upload.');
      return;
    }
    
    if (!tipoDocumento) {
      setErro('Por favor, selecione o tipo de documento.');
      return;
    }
    
    try {
      setEnviando(true);
      setErro(null);
      
      // Criar FormData para envio do arquivo
      const formData = new FormData();
      formData.append('arquivo', arquivo);
      formData.append('tipo_documento', tipoDocumento);
      formData.append('licenca_taxa_id', licencaTaxaId);
      
      // Simular progresso de upload (em um cenário real, isso seria feito com XMLHttpRequest ou fetch com progress tracking)
      const simulateProgress = () => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setProgresso(progress);
          if (progress >= 100) {
            clearInterval(interval);
            
            // Após o upload "completo", notificar o componente pai
            setTimeout(() => {
              setEnviando(false);
              setArquivo(null);
              setTipoDocumento('');
              setProgresso(0);
              if (onUploadComplete) onUploadComplete();
            }, 500);
          }
        }, 300);
      };
      
      // Iniciar simulação de progresso
      simulateProgress();
      
      // Em um cenário real, aqui seria feita a requisição para a API
      // const response = await fetch('/api/documentos-anexos', {
      //   method: 'POST',
      //   body: formData
      // });
      
      // if (!response.ok) {
      //   throw new Error('Falha ao fazer upload do documento');
      // }
      
    } catch (error) {
      console.error('Erro ao fazer upload do documento:', error);
      setErro(`Erro ao fazer upload do documento: ${error.message}`);
      setEnviando(false);
      setProgresso(0);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Upload de Documento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {erro && (
            <Alert variant="destructive">
              <AlertDescription>{erro}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <label htmlFor="tipo_documento" className="text-sm font-medium">
              Tipo de Documento *
            </label>
            <Select 
              value={tipoDocumento} 
              onValueChange={setTipoDocumento}
              disabled={enviando}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de documento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Alvará">Alvará</SelectItem>
                <SelectItem value="Licença">Licença</SelectItem>
                <SelectItem value="Comprovante de Pagamento">Comprovante de Pagamento</SelectItem>
                <SelectItem value="Formulário">Formulário</SelectItem>
                <SelectItem value="Outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="arquivo" className="text-sm font-medium">
              Arquivo *
            </label>
            <Input
              id="arquivo"
              type="file"
              onChange={handleFileChange}
              disabled={enviando}
            />
            <p className="text-xs text-muted-foreground">
              Formatos aceitos: PDF, JPG, PNG. Tamanho máximo: 5MB.
            </p>
          </div>
          
          {enviando && (
            <div className="space-y-2">
              <div className="text-sm">Enviando: {progresso}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${progresso}%` }}
                ></div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={enviando || !arquivo || !tipoDocumento}>
            {enviando ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Enviando...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Enviar Documento
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default DocumentoUploadForm;

