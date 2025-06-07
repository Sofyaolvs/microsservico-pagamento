const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Configurações mais robustas para conexão com MongoDB
        const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://sofyaoliveira100:7GHGdm9WhlO43piT@cluster.t9hpgm5.mongodb.net/pagamentos?retryWrites=true&w=majority&appName=Cluster';
        
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout após 5s
            socketTimeoutMS: 45000, // Timeout do socket
            maxPoolSize: 10,
            minPoolSize: 5,
            maxIdleTimeMS: 30000,
            heartbeatFrequencyMS: 10000,
            retryWrites: true,
        };

        console.log('Tentando conectar ao MongoDB...');
        const conn = await mongoose.connect(mongoURI, options);
        
        console.log(`✅ MongoDB conectado com sucesso: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
        
        // Event listeners para monitorar a conexão
        mongoose.connection.on('connected', () => {
            console.log('✅ Mongoose conectado ao MongoDB');
        });

        mongoose.connection.on('error', (err) => {
            console.error('❌ Erro na conexão MongoDB:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ Mongoose desconectado do MongoDB');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            console.log('Fechando conexão MongoDB...');
            await mongoose.connection.close();
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ Erro ao conectar MongoDB:', error);
        console.error('Stack trace:', error.stack);
        
        // Não sair imediatamente, tentar reconectar
        console.log('Tentando reconectar em 5 segundos...');
        setTimeout(connectDB, 5000);
    }
};

module.exports = connectDB;