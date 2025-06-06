const { LicencaTaxa, Cliente, TipoLicencaTaxa } = require('../models');
const { Op } = require('sequelize');

/**
 * Verifica licenças e taxas próximas do vencimento e retorna os alertas
 * @param {number} diasAntecedencia - Número de dias de antecedência para alertar
 * @returns {Promise<Array>} - Lista de licenças/taxas próximas do vencimento
 */
const verificarLicencasTaxasAVencer = async (diasAntecedencia = 30) => {
  try {
    const dataAtual = new Date();
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() + diasAntecedencia);
    
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
        { model: TipoLicencaTaxa, as: 'tipoLicenca' }
      ],
      order: [['data_vencimento', 'ASC']]
    });
    
    return licencasTaxas.map(licenca => {
      const diasRestantes = Math.ceil((new Date(licenca.data_vencimento) - dataAtual) / (1000 * 60 * 60 * 24));
      
      return {
        id: licenca.id,
        cliente: licenca.cliente.nome_razao_social,
        tipoLicenca: licenca.tipoLicenca.nome,
        dataVencimento: licenca.data_vencimento,
        diasRestantes,
        status: licenca.status,
        mensagem: `A licença/taxa ${licenca.tipoLicenca.nome} do cliente ${licenca.cliente.nome_razao_social} vencerá em ${diasRestantes} dias (${licenca.data_vencimento}).`
      };
    });
  } catch (error) {
    console.error('Erro ao verificar licenças/taxas a vencer:', error);
    throw error;
  }
};

/**
 * Verifica licenças e taxas já vencidas e retorna os alertas
 * @returns {Promise<Array>} - Lista de licenças/taxas vencidas
 */
const verificarLicencasTaxasVencidas = async () => {
  try {
    const dataAtual = new Date();
    
    const licencasTaxas = await LicencaTaxa.findAll({
      where: {
        data_vencimento: {
          [Op.lt]: dataAtual
        },
        status: {
          [Op.notIn]: ['Expirada', 'Renovada']
        }
      },
      include: [
        { model: Cliente, as: 'cliente' },
        { model: TipoLicencaTaxa, as: 'tipoLicenca' }
      ],
      order: [['data_vencimento', 'ASC']]
    });
    
    return licencasTaxas.map(licenca => {
      const diasVencidos = Math.ceil((dataAtual - new Date(licenca.data_vencimento)) / (1000 * 60 * 60 * 24));
      
      return {
        id: licenca.id,
        cliente: licenca.cliente.nome_razao_social,
        tipoLicenca: licenca.tipoLicenca.nome,
        dataVencimento: licenca.data_vencimento,
        diasVencidos,
        status: licenca.status,
        mensagem: `A licença/taxa ${licenca.tipoLicenca.nome} do cliente ${licenca.cliente.nome_razao_social} está vencida há ${diasVencidos} dias (${licenca.data_vencimento}).`
      };
    });
  } catch (error) {
    console.error('Erro ao verificar licenças/taxas vencidas:', error);
    throw error;
  }
};

/**
 * Atualiza automaticamente o status das licenças/taxas vencidas
 * @returns {Promise<number>} - Número de registros atualizados
 */
const atualizarStatusLicencasVencidas = async () => {
  try {
    const dataAtual = new Date();
    
    const [registrosAtualizados] = await LicencaTaxa.update(
      { status: 'Expirada' },
      {
        where: {
          data_vencimento: {
            [Op.lt]: dataAtual
          },
          status: {
            [Op.notIn]: ['Expirada', 'Renovada']
          }
        }
      }
    );
    
    return registrosAtualizados;
  } catch (error) {
    console.error('Erro ao atualizar status de licenças/taxas vencidas:', error);
    throw error;
  }
};

module.exports = {
  verificarLicencasTaxasAVencer,
  verificarLicencasTaxasVencidas,
  atualizarStatusLicencasVencidas
};

