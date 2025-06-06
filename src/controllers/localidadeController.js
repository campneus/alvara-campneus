const { Localidade } = require('../models');
const { Op } = require('sequelize');

// Listar todas as localidades
exports.listarLocalidades = async (req, res) => {
  try {
    const localidades = await Localidade.findAll();
    return res.status(200).json(localidades);
  } catch (error) {
    console.error('Erro ao listar localidades:', error);
    return res.status(500).json({ mensagem: 'Erro ao listar localidades', erro: error.message });
  }
};

// Buscar localidade por ID
exports.buscarLocalidadePorId = async (req, res) => {
  try {
    const { id } = req.params;
    const localidade = await Localidade.findByPk(id);
    
    if (!localidade) {
      return res.status(404).json({ mensagem: 'Localidade não encontrada' });
    }
    
    return res.status(200).json(localidade);
  } catch (error) {
    console.error('Erro ao buscar localidade:', error);
    return res.status(500).json({ mensagem: 'Erro ao buscar localidade', erro: error.message });
  }
};

// Criar nova localidade
exports.criarLocalidade = async (req, res) => {
  try {
    const { nome, endereco } = req.body;
    
    // Verificar se já existe localidade com o mesmo nome
    const localidadeExistente = await Localidade.findOne({ where: { nome } });
    if (localidadeExistente) {
      return res.status(400).json({ mensagem: 'Já existe uma localidade com este nome' });
    }
    
    const novaLocalidade = await Localidade.create({
      nome,
      endereco
    });
    
    return res.status(201).json(novaLocalidade);
  } catch (error) {
    console.error('Erro ao criar localidade:', error);
    return res.status(500).json({ mensagem: 'Erro ao criar localidade', erro: error.message });
  }
};

// Atualizar localidade
exports.atualizarLocalidade = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, endereco } = req.body;
    
    const localidade = await Localidade.findByPk(id);
    if (!localidade) {
      return res.status(404).json({ mensagem: 'Localidade não encontrada' });
    }
    
    // Verificar se o novo nome já está em uso por outra localidade
    if (nome && nome !== localidade.nome) {
      const localidadeExistente = await Localidade.findOne({ 
        where: { 
          nome,
          id: { [Op.ne]: id }
        } 
      });
      
      if (localidadeExistente) {
        return res.status(400).json({ mensagem: 'Já existe outra localidade com este nome' });
      }
    }
    
    await localidade.update({
      nome: nome || localidade.nome,
      endereco: endereco || localidade.endereco
    });
    
    return res.status(200).json(localidade);
  } catch (error) {
    console.error('Erro ao atualizar localidade:', error);
    return res.status(500).json({ mensagem: 'Erro ao atualizar localidade', erro: error.message });
  }
};

// Excluir localidade
exports.excluirLocalidade = async (req, res) => {
  try {
    const { id } = req.params;
    
    const localidade = await Localidade.findByPk(id);
    if (!localidade) {
      return res.status(404).json({ mensagem: 'Localidade não encontrada' });
    }
    
    await localidade.destroy();
    return res.status(200).json({ mensagem: 'Localidade excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir localidade:', error);
    return res.status(500).json({ mensagem: 'Erro ao excluir localidade', erro: error.message });
  }
};

