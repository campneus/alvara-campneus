const alertasUtil = require('../utils/alertas');

// Obter alertas de licenças/taxas a vencer
exports.obterAlertasVencimento = async (req, res) => {
  try {
    const { dias = 30 } = req.query;
    const alertas = await alertasUtil.verificarLicencasTaxasAVencer(parseInt(dias));
    return res.status(200).json(alertas);
  } catch (error) {
    console.error('Erro ao obter alertas de vencimento:', error);
    return res.status(500).json({ mensagem: 'Erro ao obter alertas de vencimento', erro: error.message });
  }
};

// Obter alertas de licenças/taxas vencidas
exports.obterAlertasVencidas = async (req, res) => {
  try {
    const alertas = await alertasUtil.verificarLicencasTaxasVencidas();
    return res.status(200).json(alertas);
  } catch (error) {
    console.error('Erro ao obter alertas de licenças/taxas vencidas:', error);
    return res.status(500).json({ mensagem: 'Erro ao obter alertas de licenças/taxas vencidas', erro: error.message });
  }
};

// Atualizar status de licenças/taxas vencidas
exports.atualizarStatusVencidas = async (req, res) => {
  try {
    const registrosAtualizados = await alertasUtil.atualizarStatusLicencasVencidas();
    return res.status(200).json({ 
      mensagem: 'Status de licenças/taxas vencidas atualizado com sucesso',
      registrosAtualizados
    });
  } catch (error) {
    console.error('Erro ao atualizar status de licenças/taxas vencidas:', error);
    return res.status(500).json({ mensagem: 'Erro ao atualizar status de licenças/taxas vencidas', erro: error.message });
  }
};

