const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const pagamentoRoutes = require('./routes/PagamentoRoutes');
const { validarRequisicao } = require('./middlewares/Validacao');

const app = express();

// Middlewares de segurança e logging
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));

// Middleware para parsing JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware de validação
app.use(validarRequisicao);

// Rota de health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'pagamento-microservice'
    });
});

// Rotas da API
app.use('/api/pagamentos', pagamentoRoutes);

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        erro: 'Rota não encontrada',
        metodo: req.method,
        url: req.originalUrl
    });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro não tratado:', err);
    res.status(500).json({
        erro: 'Erro interno do servidor',
        timestamp: new Date().toISOString()
    });
});

module.exports = app;
