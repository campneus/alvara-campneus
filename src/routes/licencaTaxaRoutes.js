const express = require('express');
const router = express.Router();
const licencaTaxaController = require('../controllers/licencaTaxaController');

// Rotas para licenças/taxas
router.get('/', licencaTaxaController.listarLicencasTaxas);
router.get('/a-vencer', licencaTaxaController.listarLicencasTaxasAVencer);
router.get('/status/:status', licencaTaxaController.listarLicencasTaxasPorStatus);
router.get('/:id', licencaTaxaController.buscarLicencaTaxaPorId);
router.post('/', licencaTaxaController.criarLicencaTaxa);
router.put('/:id', licencaTaxaController.atualizarLicencaTaxa);
router.delete('/:id', licencaTaxaController.excluirLicencaTaxa);

module.exports = router;

