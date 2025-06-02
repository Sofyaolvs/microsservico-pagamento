const Pagamento = require('./Pagamento');

class PagamentoDebito extends Pagamento {
    constructor(id, valor, numeroCartao, nomeTitular, codigoSeguranca, banco) {
        super(id, valor);
        this.numeroCartao = numeroCartao;
        this.nomeTitular = nomeTitular;
        this.codigoSeguranca = codigoSeguranca;
        this.banco = banco;
    }

    async executarTransacao() {
        const ultimosDigitos = this.numeroCartao.slice(-4);
        console.log(`Processando pagamento via débito: **** ${ultimosDigitos}`);
        
        // Simula processamento assíncrono
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Simula 90% de sucesso (10% de falha)
        return Math.random() > 0.1;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            tipo: 'CartaoDebito',
            numeroCartao: `**** **** **** ${this.numeroCartao.slice(-4)}`,
            nomeTitular: this.nomeTitular,
            banco: this.banco
        };
    }
}

module.exports = PagamentoDebito;

