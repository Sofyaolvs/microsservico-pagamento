class Pagamento {
    constructor(id, valor) {
        this.id = id;
        this.valor = valor;
        this.status = "Pendente";
        this.dataPagamento = null;
    }

    // Template Method
    async efetuarPagamento() {
        if (this.status !== "Pendente") {
            console.log("Pagamento não está pendente e não pode ser efetuado!");
            return {
                sucesso: false,
                mensagem: "Pagamento não está pendente e não pode ser efetuado!",
                pagamento: this.toJSON()
            };
        }

        this.status = "EmProcessamento";
        console.log("Iniciando processamento do pagamento...");

        try {
            const transacaoSucesso = await this.executarTransacao();
            
            if (transacaoSucesso) {
                return this.confirmarPagamento();
            } else {
                return this.cancelarPagamento();
            }
        } catch (error) {
            console.error("Erro durante execução da transação:", error);
            return this.cancelarPagamento();
        }
    }

    // Método abstrato - deve ser implementado pelas subclasses
    async executarTransacao() {
        throw new Error("Método executarTransacao deve ser implementado pela subclasse");
    }

    confirmarPagamento() {
        if (this.status !== "EmProcessamento") {
            console.log("Pagamento não está em processamento e não pode ser confirmado!");
            return {
                sucesso: false,
                mensagem: "Pagamento não está em processamento e não pode ser confirmado!",
                pagamento: this.toJSON()
            };
        }

        this.status = "Concluído";
        this.dataPagamento = new Date();
        console.log(`Pagamento confirmado com sucesso! ID: ${this.id}`);
        
        return {
            sucesso: true,
            mensagem: "Pagamento confirmado com sucesso!",
            pagamento: this.toJSON()
        };
    }

    cancelarPagamento() {
        if (this.status === "Concluído") {
            console.log("Pagamento já concluído, não pode ser cancelado!");
            return {
                sucesso: false,
                mensagem: "Pagamento já concluído, não pode ser cancelado!",
                pagamento: this.toJSON()
            };
        }

        this.status = "Cancelado";
        console.log(`Pagamento cancelado! ID: ${this.id}`);
        
        return {
            sucesso: true,
            mensagem: "Pagamento cancelado!",
            pagamento: this.toJSON()
        };
    }

    toJSON() {
        return {
            id: this.id,
            valor: this.valor,
            status: this.status,
            dataPagamento: this.dataPagamento
        };
    }
}

module.exports = Pagamento;