// src/models/PagamentoPix.js
const Pagamento = require('./Pagamento');

class PagamentoPix extends Pagamento {
    constructor(id, valor, chavePix) {
        super(id, valor);
        this.chavePix = chavePix;
        this.comprovante = null;
    }

    async executarTransacao() {
        console.log(`Processando pagamento via PIX para a chave: ${this.chavePix}`);
        
        // Simula processamento assíncrono
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // PIX normalmente não falha (99% de sucesso)
        const sucesso = Math.random() > 0.01;
        
        if (sucesso) {
            this.comprovante = `PIX-${Date.now()}-${this.id}`;
        }
        
        return sucesso;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            tipo: 'PIX',
            chavePix: this.chavePix,
            comprovante: this.comprovante
        };
    }
}

module.exports = PagamentoPix;