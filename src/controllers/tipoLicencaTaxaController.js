const { TipoLicencaTaxa } = require('../models');
const { Op } = require('sequelize');

// Listar todos os tipos de licenças/taxas
exports.listarTiposLicencasTaxas = async (req, res) => {
  try {
    const tipos = await TipoLicencaTaxa.findAll();
    return res.status(200).json(tipos);
  } catch (error) {
    console.error('Erro ao listar tipos de licenças/taxas:', error);
    return res.status(500).json({ mensagem: 'Erro ao listar tipos de licenças/taxas', erro: error.message });
  }
};

// Buscar tipo de licença/taxa por ID
exports.buscarTipoLicencaTaxaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const tipo = await TipoLicencaTaxa.findByPk(id);
    
    if (!tipo) {
      return res.status(404).json({ mensagem: 'Tipo de licença/taxa não encontrado' });
    }
    
    return res.status(200).json(tipo);
  } catch (error) {
    console.error('Erro ao buscar tipo de licença/taxa:', error);
    return res.status(500).json({ mensagem: 'Erro ao buscar tipo de licença/taxa', erro: error.message });
  }
};

// Criar novo tipo de licença/taxa
exports.criarTipoLicencaTaxa = async (req, res) => {
  try {
    const { nome, descricao, tempo_expiracao_dias, frequencia_renovacao_meses } = req.body;
    
    // Verificar se já existe tipo com o mesmo nome
    const tipoExistente = await TipoLicencaTaxa.findOne({ where: { nome } });
    if (tipoExistente) {
      return res.status(400).json({ mensagem: 'Já existe um tipo de licença/taxa com este nome' });
    }
    
    const novoTipo = await TipoLicencaTaxa.create({
      nome,
      descricao,
      tempo_expiracao_dias,
      frequencia_renovacao_meses
    });
    
    return res.status(201).json(novoTipo);
  } catch (error) {
    console.error('Erro ao criar tipo de licença/taxa:', error);
    return res.status(500).json({ mensagem: 'Erro ao criar tipo de licença/taxa', erro: error.message });
  }
};

// Atualizar tipo de licença/taxa
exports.atualizarTipoLicencaTaxa = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, tempo_expiracao_dias, frequencia_renovacao_meses } = req.body;
    
    const tipo = await TipoLicencaTaxa.findByPk(id);
    if (!tipo) {
      return res.status(404).json({ mensagem: 'Tipo de licença/taxa não encontrado' });
    }
    
    // Verificar se o novo nome já está em uso por outro tipo
    if (nome && nome !== tipo.nome) {
      const tipoExistente = await TipoLicencaTaxa.findOne({ 
        where: { 
          nome,
          id: { [Op.ne]: id }
        } 
      });
      
      if (tipoExistente) {
        return res.status(400).json({ mensagem: 'Já existe outro tipo de licença/taxa com este nome' });
      }
    }
    
    await tipo.update({
      nome: nome || tipo.nome,
      descricao: descricao !== undefined ? descricao : tipo.descricao,
      tempo_expiracao_dias: tempo_expiracao_dias !== undefined ? tempo_expiracao_dias : tipo.tempo_expiracao_dias,
      frequencia_renovacao_meses: frequencia_renovacao_meses !== undefined ? frequencia_renovacao_meses : tipo.frequencia_renovacao_meses
    });
    
    return res.status(200).json(tipo);
  } catch (error) {
    console.error('Erro ao atualizar tipo de licença/taxa:', error);
    return res.status(500).json({ mensagem: 'Erro ao atualizar tipo de licença/taxa', erro: error.message });
  }
};

// Excluir tipo de licença/taxa
exports.excluirTipoLicencaTaxa = async (req, res) => {
  try {
    const { id } = req.params;
    
    const tipo = await TipoLicencaTaxa.findByPk(id);
    if (!tipo) {
      return res.status(404).json({ mensagem: 'Tipo de licença/taxa não encontrado' });
    }
    
    await tipo.destroy();
    return res.status(200).json({ mensagem: 'Tipo de licença/taxa excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir tipo de licença/taxa:', error);
    return res.status(500).json({ mensagem: 'Erro ao excluir tipo de licença/taxa', erro: error.message });
  }
};

