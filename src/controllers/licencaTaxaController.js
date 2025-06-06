const { LicencaTaxa, Cliente, TipoLicencaTaxa, OrgaoRegulador, Localidade } = require('../models');
const { Op } = require('sequelize');

// Listar todas as licenças/taxas
exports.listarLicencasTaxas = async (req, res) => {
  try {
    const licencasTaxas = await LicencaTaxa.findAll({
      include: [
        { model: Cliente, as: 'cliente' },
        { model: TipoLicencaTaxa, as: 'tipoLicenca' },
        { model: OrgaoRegulador, as: 'orgaoRegulador' },
        { model: Localidade, as: 'localidade' }
      ]
    });
    return res.status(200).json(licencasTaxas);
  } catch (error) {
    console.error('Erro ao listar licenças/taxas:', error);
    return res.status(500).json({ mensagem: 'Erro ao listar licenças/taxas', erro: error.message });
  }
};

// Buscar licença/taxa por ID
exports.buscarLicencaTaxaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const licencaTaxa = await LicencaTaxa.findByPk(id, {
      include: [
        { model: Cliente, as: 'cliente' },
        { model: TipoLicencaTaxa, as: 'tipoLicenca' },
        { model: OrgaoRegulador, as: 'orgaoRegulador' },
        { model: Localidade, as: 'localidade' }
      ]
    });
    
    if (!licencaTaxa) {
      return res.status(404).json({ mensagem: 'Licença/taxa não encontrada' });
    }
    
    return res.status(200).json(licencaTaxa);
  } catch (error) {
    console.error('Erro ao buscar licença/taxa:', error);
    return res.status(500).json({ mensagem: 'Erro ao buscar licença/taxa', erro: error.message });
  }
};

// Criar nova licença/taxa
exports.criarLicencaTaxa = async (req, res) => {
  try {
    const { 
      cliente_id, 
      tipo_licenca_id, 
      orgao_regulador_id, 
      localidade_id, 
      data_emissao, 
      data_vencimento, 
      status, 
      observacoes 
    } = req.body;
    
    // Verificar se o cliente existe
    const cliente = await Cliente.findByPk(cliente_id);
    if (!cliente) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado' });
    }
    
    // Verificar se o tipo de licença/taxa existe
    const tipoLicenca = await TipoLicencaTaxa.findByPk(tipo_licenca_id);
    if (!tipoLicenca) {
      return res.status(404).json({ mensagem: 'Tipo de licença/taxa não encontrado' });
    }
    
    // Verificar se o órgão regulador existe (se fornecido)
    if (orgao_regulador_id) {
      const orgaoRegulador = await OrgaoRegulador.findByPk(orgao_regulador_id);
      if (!orgaoRegulador) {
        return res.status(404).json({ mensagem: 'Órgão regulador não encontrado' });
      }
    }
    
    // Verificar se a localidade existe (se fornecida)
    if (localidade_id) {
      const localidade = await Localidade.findByPk(localidade_id);
      if (!localidade) {
        return res.status(404).json({ mensagem: 'Localidade não encontrada' });
      }
    }
    
    const novaLicencaTaxa = await LicencaTaxa.create({
      cliente_id,
      tipo_licenca_id,
      orgao_regulador_id,
      localidade_id,
      data_emissao,
      data_vencimento,
      status: status || 'Ativa',
      observacoes
    });
    
    // Buscar a licença/taxa criada com os relacionamentos
    const licencaTaxaComRelacionamentos = await LicencaTaxa.findByPk(novaLicencaTaxa.id, {
      include: [
        { model: Cliente, as: 'cliente' },
        { model: TipoLicencaTaxa, as: 'tipoLicenca' },
        { model: OrgaoRegulador, as: 'orgaoRegulador' },
        { model: Localidade, as: 'localidade' }
      ]
    });
    
    return res.status(201).json(licencaTaxaComRelacionamentos);
  } catch (error) {
    console.error('Erro ao criar licença/taxa:', error);
    return res.status(500).json({ mensagem: 'Erro ao criar licença/taxa', erro: error.message });
  }
};

// Atualizar licença/taxa
exports.atualizarLicencaTaxa = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      cliente_id, 
      tipo_licenca_id, 
      orgao_regulador_id, 
      localidade_id, 
      data_emissao, 
      data_vencimento, 
      status, 
      observacoes 
    } = req.body;
    
    const licencaTaxa = await LicencaTaxa.findByPk(id);
    if (!licencaTaxa) {
      return res.status(404).json({ mensagem: 'Licença/taxa não encontrada' });
    }
    
    // Verificar se o cliente existe (se fornecido)
    if (cliente_id) {
      const cliente = await Cliente.findByPk(cliente_id);
      if (!cliente) {
        return res.status(404).json({ mensagem: 'Cliente não encontrado' });
      }
    }
    
    // Verificar se o tipo de licença/taxa existe (se fornecido)
    if (tipo_licenca_id) {
      const tipoLicenca = await TipoLicencaTaxa.findByPk(tipo_licenca_id);
      if (!tipoLicenca) {
        return res.status(404).json({ mensagem: 'Tipo de licença/taxa não encontrado' });
      }
    }
    
    // Verificar se o órgão regulador existe (se fornecido)
    if (orgao_regulador_id) {
      const orgaoRegulador = await OrgaoRegulador.findByPk(orgao_regulador_id);
      if (!orgaoRegulador) {
        return res.status(404).json({ mensagem: 'Órgão regulador não encontrado' });
      }
    }
    
    // Verificar se a localidade existe (se fornecida)
    if (localidade_id) {
      const localidade = await Localidade.findByPk(localidade_id);
      if (!localidade) {
        return res.status(404).json({ mensagem: 'Localidade não encontrada' });
      }
    }
    
    await licencaTaxa.update({
      cliente_id: cliente_id || licencaTaxa.cliente_id,
      tipo_licenca_id: tipo_licenca_id || licencaTaxa.tipo_licenca_id,
      orgao_regulador_id: orgao_regulador_id !== undefined ? orgao_regulador_id : licencaTaxa.orgao_regulador_id,
      localidade_id: localidade_id !== undefined ? localidade_id : licencaTaxa.localidade_id,
      data_emissao: data_emissao || licencaTaxa.data_emissao,
      data_vencimento: data_vencimento || licencaTaxa.data_vencimento,
      status: status || licencaTaxa.status,
      observacoes: observacoes !== undefined ? observacoes : licencaTaxa.observacoes
    });
    
    // Buscar a licença/taxa atualizada com os relacionamentos
    const licencaTaxaAtualizada = await LicencaTaxa.findByPk(id, {
      include: [
        { model: Cliente, as: 'cliente' },
        { model: TipoLicencaTaxa, as: 'tipoLicenca' },
        { model: OrgaoRegulador, as: 'orgaoRegulador' },
        { model: Localidade, as: 'localidade' }
      ]
    });
    
    return res.status(200).json(licencaTaxaAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar licença/taxa:', error);
    return res.status(500).json({ mensagem: 'Erro ao atualizar licença/taxa', erro: error.message });
  }
};

// Excluir licença/taxa
exports.excluirLicencaTaxa = async (req, res) => {
  try {
    const { id } = req.params;
    
    const licencaTaxa = await LicencaTaxa.findByPk(id);
    if (!licencaTaxa) {
      return res.status(404).json({ mensagem: 'Licença/taxa não encontrada' });
    }
    
    await licencaTaxa.destroy();
    return res.status(200).json({ mensagem: 'Licença/taxa excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir licença/taxa:', error);
    return res.status(500).json({ mensagem: 'Erro ao excluir licença/taxa', erro: error.message });
  }
};

// Listar licenças/taxas a vencer
exports.listarLicencasTaxasAVencer = async (req, res) => {
  try {
    const { dias = 30 } = req.query; // Padrão: próximos 30 dias
    
    const dataAtual = new Date();
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() + parseInt(dias));
    
    const licencasTaxas = await LicencaTaxa.findAll({
      where: {
        data_vencimento: {
          [Op.between]: [dataAtual, dataLimite]
        },
        status: {
          [Op.notIn]: ['Expirada', 'Renovada']
        }
      },
      include: [
        { model: Cliente, as: 'cliente' },
        { model: TipoLicencaTaxa, as: 'tipoLicenca' },
        { model: OrgaoRegulador, as: 'orgaoRegulador' },
        { model: Localidade, as: 'localidade' }
      ],
      order: [['data_vencimento', 'ASC']]
    });
    
    return res.status(200).json(licencasTaxas);
  } catch (error) {
    console.error('Erro ao listar licenças/taxas a vencer:', error);
    return res.status(500).json({ mensagem: 'Erro ao listar licenças/taxas a vencer', erro: error.message });
  }
};

// Listar licenças/taxas por status
exports.listarLicencasTaxasPorStatus = async (req, res) => {
  try {
    const { status } = req.params;
    
    const licencasTaxas = await LicencaTaxa.findAll({
      where: { status },
      include: [
        { model: Cliente, as: 'cliente' },
        { model: TipoLicencaTaxa, as: 'tipoLicenca' },
        { model: OrgaoRegulador, as: 'orgaoRegulador' },
        { model: Localidade, as: 'localidade' }
      ]
    });
    
    return res.status(200).json(licencasTaxas);
  } catch (error) {
    console.error('Erro ao listar licenças/taxas por status:', error);
    return res.status(500).json({ mensagem: 'Erro ao listar licenças/taxas por status', erro: error.message });
  }
};

