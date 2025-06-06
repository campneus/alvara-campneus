// API base URL
const API_BASE_URL = '/api';

// Função genérica para fazer requisições à API
const fetchAPI = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.mensagem || `Erro ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Erro na requisição para ${endpoint}:`, error);
    throw error;
  }
};

// API de Clientes
export const clienteAPI = {
  listar: () => fetchAPI('/clientes'),
  buscarPorId: (id) => fetchAPI(`/clientes/${id}`),
  criar: (dados) => fetchAPI('/clientes', { method: 'POST', body: JSON.stringify(dados) }),
  atualizar: (id, dados) => fetchAPI(`/clientes/${id}`, { method: 'PUT', body: JSON.stringify(dados) }),
  excluir: (id) => fetchAPI(`/clientes/${id}`, { method: 'DELETE' })
};

// API de Localidades
export const localidadeAPI = {
  listar: () => fetchAPI('/localidades'),
  buscarPorId: (id) => fetchAPI(`/localidades/${id}`),
  criar: (dados) => fetchAPI('/localidades', { method: 'POST', body: JSON.stringify(dados) }),
  atualizar: (id, dados) => fetchAPI(`/localidades/${id}`, { method: 'PUT', body: JSON.stringify(dados) }),
  excluir: (id) => fetchAPI(`/localidades/${id}`, { method: 'DELETE' })
};

// API de Tipos de Licenças/Taxas
export const tipoLicencaTaxaAPI = {
  listar: () => fetchAPI('/tipos-licencas-taxas'),
  buscarPorId: (id) => fetchAPI(`/tipos-licencas-taxas/${id}`),
  criar: (dados) => fetchAPI('/tipos-licencas-taxas', { method: 'POST', body: JSON.stringify(dados) }),
  atualizar: (id, dados) => fetchAPI(`/tipos-licencas-taxas/${id}`, { method: 'PUT', body: JSON.stringify(dados) }),
  excluir: (id) => fetchAPI(`/tipos-licencas-taxas/${id}`, { method: 'DELETE' })
};

// API de Licenças/Taxas
export const licencaTaxaAPI = {
  listar: () => fetchAPI('/licencas-taxas'),
  buscarPorId: (id) => fetchAPI(`/licencas-taxas/${id}`),
  listarAVencer: (dias = 30) => fetchAPI(`/licencas-taxas/a-vencer?dias=${dias}`),
  listarPorStatus: (status) => fetchAPI(`/licencas-taxas/status/${status}`),
  criar: (dados) => fetchAPI('/licencas-taxas', { method: 'POST', body: JSON.stringify(dados) }),
  atualizar: (id, dados) => fetchAPI(`/licencas-taxas/${id}`, { method: 'PUT', body: JSON.stringify(dados) }),
  excluir: (id) => fetchAPI(`/licencas-taxas/${id}`, { method: 'DELETE' })
};

// API de Dashboard
export const dashboardAPI = {
  obterMetricas: () => fetchAPI('/dashboard/metricas'),
  obterDadosRelatorios: (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    return fetchAPI(`/dashboard/relatorios?${queryParams.toString()}`);
  }
};

// API de Alertas
export const alertaAPI = {
  obterAlertasVencimento: (dias = 30) => fetchAPI(`/alertas/vencimento?dias=${dias}`),
  obterAlertasVencidas: () => fetchAPI('/alertas/vencidas'),
  atualizarStatusVencidas: () => fetchAPI('/alertas/atualizar-status-vencidas', { method: 'POST' })
};

// API de Órgãos Reguladores
export const orgaoReguladorAPI = {
  listar: () => fetchAPI('/orgaos-reguladores'),
  buscarPorId: (id) => fetchAPI(`/orgaos-reguladores/${id}`),
  criar: (dados) => fetchAPI('/orgaos-reguladores', { method: 'POST', body: JSON.stringify(dados) }),
  atualizar: (id, dados) => fetchAPI(`/orgaos-reguladores/${id}`, { method: 'PUT', body: JSON.stringify(dados) }),
  excluir: (id) => fetchAPI(`/orgaos-reguladores/${id}`, { method: 'DELETE' })
};

