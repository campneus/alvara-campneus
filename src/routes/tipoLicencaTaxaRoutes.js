const express = require('express');
const router = express.Router();
const tipoLicencaTaxaController = require('../controllers/tipoLicencaTaxaController');

// Rotas para tipos de licenças/taxas
router.get('/', tipoLicencaTaxaController.listarTiposLicencasTaxas);
router.get('/:id', tipoLicencaTaxaController.buscarTipoLicencaTaxaPorId);
router.post('/', tipoLicencaTaxaController.criarTipoLicencaTaxa);
router.put('/:id', tipoLicencaTaxaController.atualizarTipoLicencaTaxa);
router.delete('/:id', tipoLicencaTaxaController.excluirTipoLicencaTaxa);

module.exports = router;

