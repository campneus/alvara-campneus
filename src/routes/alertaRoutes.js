const express = require('express');
const router = express.Router();
const alertaController = require('../controllers/alertaController');

// Rotas para alertas
router.get('/vencimento', alertaController.obterAlertasVencimento);
router.get('/vencidas', alertaController.obterAlertasVencidas);
router.post('/atualizar-status-vencidas', alertaController.atualizarStatusVencidas);

module.exports = router;

