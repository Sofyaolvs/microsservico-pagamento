const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(`mongodb+srv://sofyaoliveira100:7GHGdm9WhlO43piT@cluster.t9hpgm5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster`);
        console.log(`MongoDB conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error('Erro ao conectar MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDB;