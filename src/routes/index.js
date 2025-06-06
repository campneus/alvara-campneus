const express = require('express');
const router = express.Router();

const clienteRoutes = require('./clienteRoutes');
const localidadeRoutes = require('./localidadeRoutes');
const tipoLicencaTaxaRoutes = require('./tipoLicencaTaxaRoutes');
const licencaTaxaRoutes = require('./licencaTaxaRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const alertaRoutes = require('./alertaRoutes');

// Definindo as rotas principais
router.use('/api/clientes', clienteRoutes);
router.use('/api/localidades', localidadeRoutes);
router.use('/api/tipos-licencas-taxas', tipoLicencaTaxaRoutes);
router.use('/api/licencas-taxas', licencaTaxaRoutes);
router.use('/api/dashboard', dashboardRoutes);
router.use('/api/alertas', alertaRoutes);

// Rota de teste para verificar se a API está funcionando
router.get('/api/status', (req, res) => {
  res.status(200).json({ 
    status: 'online',
    message: 'API do Sistema de Controle de Taxas e Alvarás está funcionando corretamente',
    timestamp: new Date()
  });
});

module.exports = router;

