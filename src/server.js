const app = require('./app');
const connectDB = require('./config/database');

// Variáveis de ambiente
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Função principal para inicializar o servidor
async function startServer() {
    try {
        console.log('🚀 Iniciando Microserviço de Pagamentos...');
        console.log(`Environment: ${NODE_ENV}`);
        
        // Conectar ao banco de dados
        await connectDB();
        
        // Iniciar o servidor
        const server = app.listen(PORT, () => {
            console.log('\n Microserviço de Pagamentos iniciado com sucesso!');
            console.log(`Porta: ${PORT}`);
            console.log(` URL: http://localhost:${PORT}`);
            console.log(` Health check: http://localhost:${PORT}/health`);
            console.log(` API base: http://localhost:${PORT}/api/pagamentos`);
            console.log(` Timestamp: ${new Date().toISOString()}`);
            
            // Endpoints disponíveis
            console.log('\n📋 Endpoints disponíveis:');
            console.log('  GET  / - Documentação da API');
            console.log('  GET  /health - Health check');
            console.log('  GET  /api/pagamentos - Listar pagamentos');
            console.log('  POST /api/pagamentos/pix - Criar pagamento PIX');
            console.log('  POST /api/pagamentos/cartao-credito - Criar pagamento cartão crédito');
            console.log('  POST /api/pagamentos/cartao-debito - Criar pagamento cartão débito');
            console.log('  GET  /api/pagamentos/:id - Consultar pagamento');
            console.log('  POST /api/pagamentos/:id/efetuar - Efetuar pagamento');
            console.log('  POST /api/pagamentos/:id/cancelar - Cancelar pagamento');
            console.log('\n Servidor pronto para receber requisições!\n');
        });

        // Configurar timeouts
        server.keepAliveTimeout = 120000; // 2 minutos
        server.headersTimeout = 120000; // 2 minutos

        // Graceful shutdown
        const gracefulShutdown = (signal) => {
            console.log(`\nSinal ${signal} recebido. Iniciando shutdown graceful...`);
            
            server.close(() => {
                console.log('🔌 Servidor HTTP fechado.');
                
                // Fechar conexão com MongoDB
                require('mongoose').connection.close(false, () => {
                    console.log('🗄️ Conexão MongoDB fechada.');
                    process.exit(0);
                });
            });

            // Forçar saída após 30 segundos
            setTimeout(() => {
                console.error('Forçando saída após timeout.');
                process.exit(1);
            }, 30000);
        };

        // Listeners para shutdown graceful
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

        // Tratar erros não capturados
        process.on('unhandledRejection', (reason, promise) => {
            console.error(' Unhandled Rejection at:', promise, 'reason:', reason);
        });

        process.on('uncaughtException', (error) => {
            console.error(' Uncaught Exception:', error);
            process.exit(1);
        });

    } catch (error) {
        console.error(' Falha ao iniciar o servidor:', error);
        process.exit(1);
    }
}

// Iniciar o servidor
startServer();