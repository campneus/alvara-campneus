const { LicencaTaxa, Cliente, TipoLicencaTaxa, Pagamento } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

// Obter métricas para o dashboard
exports.obterMetricas = async (req, res) => {
  try {
    const dataAtual = new Date();
    
    // Total de licenças/taxas
    const totalLicencasTaxas = await LicencaTaxa.count();
    
    // Licenças/taxas por status
    const licencasPorStatus = await LicencaTaxa.findAll({
      attributes: [
        'status',
        [fn('COUNT', col('id')), 'total']
      ],
      group: ['status']
    });
    
    // Licenças/taxas a vencer nos próximos 30 dias
    const dataLimite30Dias = new Date();
    dataLimite30Dias.setDate(dataLimite30Dias.getDate() + 30);
    
    const licencasAVencer30Dias = await LicencaTaxa.count({
      where: {
        data_vencimento: {
          [Op.between]: [dataAtual, dataLimite30Dias]
        },
        status: {
          [Op.notIn]: ['Expirada', 'Renovada']
        }
      }
    });
    
    // Licenças/taxas a vencer nos próximos 60 dias
    const dataLimite60Dias = new Date();
    dataLimite60Dias.setDate(dataLimite60Dias.getDate() + 60);
    
    const licencasAVencer60Dias = await LicencaTaxa.count({
      where: {
        data_vencimento: {
          [Op.between]: [dataLimite30Dias, dataLimite60Dias]
        },
        status: {
          [Op.notIn]: ['Expirada', 'Renovada']
        }
      }
    });
    
    // Licenças/taxas a vencer nos próximos 90 dias
    const dataLimite90Dias = new Date();
    dataLimite90Dias.setDate(dataLimite90Dias.getDate() + 90);
    
    const licencasAVencer90Dias = await LicencaTaxa.count({
      where: {
        data_vencimento: {
          [Op.between]: [dataLimite60Dias, dataLimite90Dias]
        },
        status: {
          [Op.notIn]: ['Expirada', 'Renovada']
        }
      }
    });
    
    // Licenças/taxas expiradas
    const licencasExpiradas = await LicencaTaxa.count({
      where: {
        data_vencimento: {
          [Op.lt]: dataAtual
        },
        status: {
          [Op.notIn]: ['Expirada', 'Renovada']
        }
      }
    });
    
    // Total de pagamentos pendentes
    const pagamentosPendentes = await Pagamento.count({
      where: {
        status_pagamento: 'Em aberto'
      }
    });
    
    // Valor total de pagamentos pendentes
    const valorTotalPendente = await Pagamento.sum('valor', {
      where: {
        status_pagamento: 'Em aberto'
      }
    });
    
    // Licenças/taxas por tipo
    const licencasPorTipo = await LicencaTaxa.findAll({
      attributes: [
        [col('tipoLicenca.nome'), 'tipo'],
        [fn('COUNT', col('LicencaTaxa.id')), 'total']
      ],
      include: [
        { 
          model: TipoLicencaTaxa, 
          as: 'tipoLicenca',
          attributes: []
        }
      ],
      group: [col('tipoLicenca.nome')],
      raw: true
    });
    
    // Projeção de licenciamentos para os próximos meses
    const projecaoLicenciamentos = [
      { mes: 1, total: licencasAVencer30Dias },
      { mes: 2, total: licencasAVencer60Dias },
      { mes: 3, total: licencasAVencer90Dias }
    ];
    
    const metricas = {
      totalLicencasTaxas,
      licencasPorStatus,
      licencasAVencer30Dias,
      licencasExpiradas,
      pagamentosPendentes,
      valorTotalPendente: valorTotalPendente || 0,
      licencasPorTipo,
      projecaoLicenciamentos
    };
    
    return res.status(200).json(metricas);
  } catch (error) {
    console.error('Erro ao obter métricas do dashboard:', error);
    return res.status(500).json({ mensagem: 'Erro ao obter métricas do dashboard', erro: error.message });
  }
};

// Obter dados para relatórios
exports.obterDadosRelatorios = async (req, res) => {
  try {
    const { 
      cliente_id, 
      tipo_licenca_id, 
      status, 
      data_inicio, 
      data_fim 
    } = req.query;
    
    const filtros = {};
    
    if (cliente_id) {
      filtros.cliente_id = cliente_id;
    }
    
    if (tipo_licenca_id) {
      filtros.tipo_licenca_id = tipo_licenca_id;
    }
    
    if (status) {
      filtros.status = status;
    }
    
    if (data_inicio && data_fim) {
      filtros.data_vencimento = {
        [Op.between]: [new Date(data_inicio), new Date(data_fim)]
      };
    } else if (data_inicio) {
      filtros.data_vencimento = {
        [Op.gte]: new Date(data_inicio)
      };
    } else if (data_fim) {
      filtros.data_vencimento = {
        [Op.lte]: new Date(data_fim)
      };
    }
    
    const licencasTaxas = await LicencaTaxa.findAll({
      where: filtros,
      include: [
        { model: Cliente, as: 'cliente' },
        { model: TipoLicencaTaxa, as: 'tipoLicenca' },
        { model: Pagamento, as: 'pagamentos' }
      ],
      order: [['data_vencimento', 'ASC']]
    });
    
    return res.status(200).json(licencasTaxas);
  } catch (error) {
    console.error('Erro ao obter dados para relatórios:', error);
    return res.status(500).json({ mensagem: 'Erro ao obter dados para relatórios', erro: error.message });
  }
};

