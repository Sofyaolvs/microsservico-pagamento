const app = require('./app');

const PORT = process.env.PORT || 3000;

// Removido HOST para compatibilidade com Render
// O Render gerencia automaticamente o binding de host
app.listen(PORT, () => {
    console.log(`🚀 Microserviço de Pagamentos iniciado com sucesso!`);
    console.log(`📍 Porta: ${PORT}`);
    console.log(`🏥 Health check: /health`);
    console.log(`🔌 API base: /api/pagamentos`);
    console.log(`📅 Timestamp: ${new Date().toISOString()}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    
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
    console.log('\n✅ Servidor pronto para receber requisições!');
});