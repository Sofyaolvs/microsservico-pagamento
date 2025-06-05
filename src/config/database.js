const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(`mongodb+srv://sofyaoliveira100:7GHGdm9WhlO43piT@cluster.mongodb.net/pagamentos?retryWrites=true&w=majority`);
        console.log(`MongoDB conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error('Erro ao conectar MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDB;