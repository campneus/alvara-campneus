const express = require('express');
const router = express.Router();
const localidadeController = require('../controllers/localidadeController');

// Rotas para localidades
router.get('/', localidadeController.listarLocalidades);
router.get('/:id', localidadeController.buscarLocalidadePorId);
router.post('/', localidadeController.criarLocalidade);
router.put('/:id', localidadeController.atualizarLocalidade);
router.delete('/:id', localidadeController.excluirLocalidade);

module.exports = router;

