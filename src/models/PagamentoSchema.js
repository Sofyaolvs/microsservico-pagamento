const mongoose = require('mongoose');

const pagamentoSchema = new mongoose.Schema({
    valor: { type: Number, required: true },
    status: { type: String, default: 'Pendente' },
    dataPagamento: { type: Date, default: null },
    tipo: { type: String, required: true },
    numeroCartao: String,
    nomeTitular: String,
    parcelas: Number,
    banco: String,
    chavePix: String,
    comprovante: String
}, { timestamps: true });

module.exports = mongoose.model('Pagamento', pagamentoSchema);