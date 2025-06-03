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

// Rota raiz - documentação da API
app.get('/', (req, res) => {
    res.status(200).json({
        service: 'Microserviço de Pagamentos',
        version: '1.0.0',
        status: 'online',
        timestamp: new Date().toISOString(),
        endpoints: {
            health: 'GET /health',
            pagamentos: {
                base: '/api/pagamentos',
                criar: {
                    credito: 'POST /api/pagamentos/cartao-credito',
                    debito: 'POST /api/pagamentos/cartao-debito',
                    pix: 'POST /api/pagamentos/pix'
                },
                gerenciar: {
                    listar: 'GET /api/pagamentos',
                    consultar: 'GET /api/pagamentos/:id',
                    efetuar: 'POST /api/pagamentos/:id/efetuar',
                    cancelar: 'POST /api/pagamentos/:id/cancelar'
                }
            }
        },
        exemplos: {
            criarPix: {
                method: 'POST',
                url: '/api/pagamentos/pix',
                body: {
                    valor: 100.50,
                    chavePix: 'usuario@email.com'
                }
            },
            criarCredito: {
                method: 'POST',
                url: '/api/pagamentos/cartao-credito',
                body: {
                    valor: 250.00,
                    numeroCartao: '1234567812345678',
                    nomeTitular: 'João Silva',
                    codigoSeguranca: '123',
                    validade: '12/25',
                    parcelas: 3
                }
            }
        }
    });
});

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
        url: req.originalUrl,
        rotasDisponiveis: [
            'GET /',
            'GET /health',
            'GET /api/pagamentos',
            'POST /api/pagamentos/pix',
            'POST /api/pagamentos/cartao-credito',
            'POST /api/pagamentos/cartao-debito'
        ]
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