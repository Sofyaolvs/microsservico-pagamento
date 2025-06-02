const Pagamento = require('./Pagamento');

class PagamentoCredito extends Pagamento {
    constructor(id, valor, numeroCartao, nomeTitular, codigoSeguranca, validade, parcelas) {
        super(id, valor);
        this.numeroCartao = numeroCartao;
        this.nomeTitular = nomeTitular;
        this.codigoSeguranca = codigoSeguranca;
        this.validade = validade;
        this.parcelas = parcelas > 0 ? parcelas : 1;
    }

    async executarTransacao() {
        const ultimosDigitos = this.numeroCartao.slice(-4);
        console.log(`Processando pagamento via cartão de crédito: **** ${ultimosDigitos} em ${this.parcelas} parcela(s)`);
        
        // Simula processamento assíncrono
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simula 95% de sucesso (5% de falha)
        return Math.random() > 0.05;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            tipo: 'CartaoCredito',
            numeroCartao: `**** **** **** ${this.numeroCartao.slice(-4)}`,
            nomeTitular: this.nomeTitular,
            parcelas: this.parcelas
        };
    }
}

module.exports = PagamentoCredito;