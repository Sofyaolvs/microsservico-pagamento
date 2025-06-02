const app = require('./app');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, HOST, () => {
    console.log(` Microserviço de Pagamentos rodando em http://${HOST}:${PORT}`);
    console.log(`Health check disponível em http://${HOST}:${PORT}/health`);
    console.log(`API disponível em http://${HOST}:${PORT}/api/pagamentos`);
});