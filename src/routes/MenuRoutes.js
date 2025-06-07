const express = require('express');
const PagamentoMenuController = require('../controllers/PagamentoMenu');

const router = express.Router();

// Rotas do menu
router.get('/', PagamentoMenuController.mostrarMenu);
router.post('/escolher', PagamentoMenuController.processarEscolha);

module.exports = router;