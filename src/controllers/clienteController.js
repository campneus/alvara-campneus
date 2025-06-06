const { Cliente } = require('../models');
const { Op } = require('sequelize');

// Listar todos os clientes
exports.listarClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    return res.status(200).json(clientes);
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    return res.status(500).json({ mensagem: 'Erro ao listar clientes', erro: error.message });
  }
};

// Buscar cliente por ID
exports.buscarClientePorId = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.findByPk(id);
    
    if (!cliente) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado' });
    }
    
    return res.status(200).json(cliente);
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    return res.status(500).json({ mensagem: 'Erro ao buscar cliente', erro: error.message });
  }
};

// Criar novo cliente
exports.criarCliente = async (req, res) => {
  try {
    const { nome_razao_social, cnpj_cpf, endereco, contato_email, contato_telefone } = req.body;
    
    // Verificar se já existe cliente com o mesmo CNPJ/CPF
    const clienteExistente = await Cliente.findOne({ where: { cnpj_cpf } });
    if (clienteExistente) {
      return res.status(400).json({ mensagem: 'Já existe um cliente com este CNPJ/CPF' });
    }
    
    const novoCliente = await Cliente.create({
      nome_razao_social,
      cnpj_cpf,
      endereco,
      contato_email,
      contato_telefone
    });
    
    return res.status(201).json(novoCliente);
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    return res.status(500).json({ mensagem: 'Erro ao criar cliente', erro: error.message });
  }
};

// Atualizar cliente
exports.atualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome_razao_social, cnpj_cpf, endereco, contato_email, contato_telefone } = req.body;
    
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado' });
    }
    
    // Verificar se o novo CNPJ/CPF já está em uso por outro cliente
    if (cnpj_cpf && cnpj_cpf !== cliente.cnpj_cpf) {
      const clienteExistente = await Cliente.findOne({ 
        where: { 
          cnpj_cpf,
          id: { [Op.ne]: id }
        } 
      });
      
      if (clienteExistente) {
        return res.status(400).json({ mensagem: 'Já existe outro cliente com este CNPJ/CPF' });
      }
    }
    
    await cliente.update({
      nome_razao_social: nome_razao_social || cliente.nome_razao_social,
      cnpj_cpf: cnpj_cpf || cliente.cnpj_cpf,
      endereco: endereco || cliente.endereco,
      contato_email: contato_email || cliente.contato_email,
      contato_telefone: contato_telefone || cliente.contato_telefone
    });
    
    return res.status(200).json(cliente);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    return res.status(500).json({ mensagem: 'Erro ao atualizar cliente', erro: error.message });
  }
};

// Excluir cliente
exports.excluirCliente = async (req, res) => {
  try {
    const { id } = req.params;
    
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado' });
    }
    
    await cliente.destroy();
    return res.status(200).json({ mensagem: 'Cliente excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir cliente:', error);
    return res.status(500).json({ mensagem: 'Erro ao excluir cliente', erro: error.message });
  }
};

