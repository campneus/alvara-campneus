const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Rotas para o dashboard
router.get('/metricas', dashboardController.obterMetricas);
router.get('/relatorios', dashboardController.obterDadosRelatorios);

module.exports = router;

