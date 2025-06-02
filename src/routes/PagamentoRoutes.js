const express = require('express');
const PagamentoController = require('../controllers/PagamentoController');

const router = express.Router();

// Rotas para criar pagamentos
router.post('/cartao-credito', PagamentoController.criarPagamentoCartaoCredito);
router.post('/cartao-debito', PagamentoController.criarPagamentoCartaoDebito);
router.post('/pix', PagamentoController.criarPagamentoPix);

// Rotas para gerenciar pagamentos
router.post('/:id/efetuar', PagamentoController.efetuarPagamento);
router.post('/:id/cancelar', PagamentoController.cancelarPagamento);
router.get('/:id', PagamentoController.consultarPagamento);
router.get('/', PagamentoController.listarPagamentos);

module.exports = router;

