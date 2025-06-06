import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Função para combinar classes do Tailwind de forma eficiente
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Formatar data para exibição (DD/MM/YYYY)
export function formatarData(data) {
  if (!data) return '';
  const date = new Date(data);
  return date.toLocaleDateString('pt-BR');
}

// Formatar moeda (R$)
export function formatarMoeda(valor) {
  if (valor === null || valor === undefined) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

// Calcular dias restantes até uma data
export function calcularDiasRestantes(dataFutura) {
  if (!dataFutura) return 0;
  const hoje = new Date();
  const data = new Date(dataFutura);
  const diffTempo = data.getTime() - hoje.getTime();
  return Math.ceil(diffTempo / (1000 * 60 * 60 * 24));
}

// Obter classe CSS com base no status da licença/taxa
export function getStatusClass(status) {
  switch (status?.toLowerCase()) {
    case 'ativa':
      return 'bg-green-100 text-green-800';
    case 'expirada':
      return 'bg-red-100 text-red-800';
    case 'aguardando pagamento':
      return 'bg-yellow-100 text-yellow-800';
    case 'renovada':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// Obter classe CSS com base no status do pagamento
export function getStatusPagamentoClass(status) {
  switch (status?.toLowerCase()) {
    case 'pago':
      return 'bg-green-100 text-green-800';
    case 'em aberto':
      return 'bg-yellow-100 text-yellow-800';
    case 'vencido':
      return 'bg-red-100 text-red-800';
    case 'parcelado':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// Obter classe CSS com base nos dias restantes
export function getDiasRestantesClass(dias) {
  if (dias < 0) return 'text-red-600 font-bold';
  if (dias <= 15) return 'text-orange-600 font-bold';
  if (dias <= 30) return 'text-yellow-600';
  return 'text-green-600';
}

// Gerar cores para gráficos
export function gerarCoresGrafico(quantidade) {
  const cores = [
    '#3B82F6', // blue-500
    '#10B981', // emerald-500
    '#F59E0B', // amber-500
    '#EF4444', // red-500
    '#8B5CF6', // violet-500
    '#EC4899', // pink-500
    '#06B6D4', // cyan-500
    '#F97316', // orange-500
    '#14B8A6', // teal-500
    '#6366F1', // indigo-500
  ];
  
  return Array(quantidade).fill().map((_, i) => cores[i % cores.length]);
}

// Truncar texto
export function truncarTexto(texto, tamanho = 30) {
  if (!texto) return '';
  return texto.length > tamanho ? `${texto.substring(0, tamanho)}...` : texto;
}

