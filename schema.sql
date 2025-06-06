-- Schema do Banco de Dados PostgreSQL para o Sistema de Controle de Taxas e Alvarás

-- Tabela para Clientes/Contribuintes/Empresas
CREATE TABLE Clientes (
    id SERIAL PRIMARY KEY,
    nome_razao_social VARCHAR(255) NOT NULL,
    cnpj_cpf VARCHAR(20) UNIQUE NOT NULL,
    endereco TEXT,
    contato_email VARCHAR(255),
    contato_telefone VARCHAR(20),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para Órgãos Reguladores ou Licenciadores
CREATE TABLE OrgaosReguladores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE,
    contato_email VARCHAR(255),
    contato_telefone VARCHAR(20)
);

-- Tabela para Tipos de Licenças e Taxas
CREATE TABLE TiposLicencasTaxas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE,
    descricao TEXT,
    tempo_expiracao_dias INTEGER, -- Tempo em dias para expiração
    frequencia_renovacao_meses INTEGER -- Frequência em meses para renovação
);

-- Tabela para Localidades (para vincular imóveis a locais específicos)
CREATE TABLE Localidades (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE,
    endereco TEXT
);

-- Tabela para Licenças e Taxas (vinculadas a clientes e tipos)
CREATE TABLE LicencasTaxas (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL REFERENCES Clientes(id) ON DELETE CASCADE,
    tipo_licenca_id INTEGER NOT NULL REFERENCES TiposLicencasTaxas(id) ON DELETE CASCADE,
    orgao_regulador_id INTEGER REFERENCES OrgaosReguladores(id) ON DELETE SET NULL,
    localidade_id INTEGER REFERENCES Localidades(id) ON DELETE SET NULL,
    data_emissao DATE NOT NULL,
    data_vencimento DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Ativa', -- Ativa, Expirada, Aguardando Pagamento, Renovada
    observacoes TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para Documentos Anexos
CREATE TABLE DocumentosAnexos (
    id SERIAL PRIMARY KEY,
    licenca_taxa_id INTEGER NOT NULL REFERENCES LicencasTaxas(id) ON DELETE CASCADE,
    nome_arquivo VARCHAR(255) NOT NULL,
    caminho_arquivo TEXT NOT NULL, -- Caminho ou URL para o arquivo
    tipo_documento VARCHAR(100),
    data_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para Histórico de Renovações
CREATE TABLE HistoricoRenovacoes (
    id SERIAL PRIMARY KEY,
    licenca_taxa_id INTEGER NOT NULL REFERENCES LicencasTaxas(id) ON DELETE CASCADE,
    data_renovacao DATE NOT NULL,
    nova_data_vencimento DATE,
    observacoes TEXT,
    usuario_responsavel VARCHAR(255),
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para Controle Financeiro / Pagamentos
CREATE TABLE Pagamentos (
    id SERIAL PRIMARY KEY,
    licenca_taxa_id INTEGER NOT NULL REFERENCES LicencasTaxas(id) ON DELETE CASCADE,
    valor DECIMAL(10, 2) NOT NULL,
    data_pagamento DATE,
    data_vencimento_boleto DATE,
    status_pagamento VARCHAR(50) NOT NULL DEFAULT 'Em aberto', -- Em aberto, Pago, Vencido, Parcelado
    comprovante_url TEXT, -- URL ou caminho para o comprovante
    observacoes TEXT,
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para otimização de consultas
CREATE INDEX idx_clientes_cnpj_cpf ON Clientes(cnpj_cpf);
CREATE INDEX idx_licencas_taxas_cliente_id ON LicencasTaxas(cliente_id);
CREATE INDEX idx_licencas_taxas_tipo_licenca_id ON LicencasTaxas(tipo_licenca_id);
CREATE INDEX idx_licencas_taxas_data_vencimento ON LicencasTaxas(data_vencimento);
CREATE INDEX idx_pagamentos_licenca_taxa_id ON Pagamentos(licenca_taxa_id);
CREATE INDEX idx_pagamentos_status_pagamento ON Pagamentos(status_pagamento);


