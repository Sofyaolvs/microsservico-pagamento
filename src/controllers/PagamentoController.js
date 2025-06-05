const { v4: uuidv4 } = require('uuid');
const PagamentoCartaoCredito = require('../models/PagamentoCredito');
const PagamentoCartaoDebito = require('../models/PagamentoDebito');
const PagamentoPix = require('../models/PagamentoPix');


const PagamentoSchema = require('../models/PagamentoSchema');

class PagamentoController {
    static async criarPagamentoCartaoCredito(req, res) {
    try {
        const { valor, numeroCartao, nomeTitular, codigoSeguranca, validade, parcelas } = req.body;
        
        if (!valor || !numeroCartao || !nomeTitular || !codigoSeguranca || !validade) {
            return res.status(400).json({
                erro: "Dados obrigatórios não fornecidos",
                camposObrigatorios: ["valor", "numeroCartao", "nomeTitular", "codigoSeguranca", "validade"]
            });
        }

        const pagamento = new PagamentoSchema({
            valor: parseFloat(valor),
            numeroCartao,
            nomeTitular,
            parcelas: parseInt(parcelas) || 1,
            tipo: 'CartaoCredito'
        });

        await pagamento.save();

        res.status(201).json({
            mensagem: "Pagamento criado com sucesso",
            pagamento
        });
    } catch (error) {
        console.error("Erro ao criar pagamento:", error);
        res.status(500).json({ erro: "Erro interno do servidor" });
    }
}

    static async criarPagamentoCartaoDebito(req, res) {
        try {
            const { valor, numeroCartao, nomeTitular, codigoSeguranca, banco } = req.body;
            
            if (!valor || !numeroCartao || !nomeTitular || !codigoSeguranca || !banco) {
                return res.status(400).json({
                    erro: "Dados obrigatórios não fornecidos",
                    camposObrigatorios: ["valor", "numeroCartao", "nomeTitular", "codigoSeguranca", "banco"]
                });
            }

            const id = uuidv4();
            const pagamento = new PagamentoCartaoDebito(
                id, 
                parseFloat(valor), 
                numeroCartao, 
                nomeTitular, 
                codigoSeguranca, 
                banco
            );

            pagamentos.set(id, pagamento);

            res.status(201).json({
                mensagem: "Pagamento criado com sucesso",
                pagamento: pagamento.toJSON()
            });
        } catch (error) {
            console.error("Erro ao criar pagamento com cartão de débito:", error);
            res.status(500).json({ erro: "Erro interno do servidor" });
        }
    }

    static async criarPagamentoPix(req, res) {
        try {
            const { valor, chavePix } = req.body;
            
            if (!valor || !chavePix) {
                return res.status(400).json({
                    erro: "Dados obrigatórios não fornecidos",
                    camposObrigatorios: ["valor", "chavePix"]
                });
            }

            const id = uuidv4();
            const pagamento = new PagamentoPix(id, parseFloat(valor), chavePix);

            pagamentos.set(id, pagamento);

            res.status(201).json({
                mensagem: "Pagamento criado com sucesso",
                pagamento: pagamento.toJSON()
            });
        } catch (error) {
            console.error("Erro ao criar pagamento PIX:", error);
            res.status(500).json({ erro: "Erro interno do servidor" });
        }
    }

    static async efetuarPagamento(req, res) {
        try {
            const { id } = req.params;
            const pagamento = pagamentos.get(id);

            if (!pagamento) {
                return res.status(404).json({ erro: "Pagamento não encontrado" });
            }

            const resultado = await pagamento.efetuarPagamento();
            
            res.status(200).json(resultado);
        } catch (error) {
            console.error("Erro ao efetuar pagamento:", error);
            res.status(500).json({ erro: "Erro interno do servidor" });
        }
    }

    static async consultarPagamento(req, res) {
        try {
            const { id } = req.params;
            const pagamento = pagamentos.get(id);

            if (!pagamento) {
                return res.status(404).json({ erro: "Pagamento não encontrado" });
            }

            res.status(200).json({
                pagamento: pagamento.toJSON()
            });
        } catch (error) {
            console.error("Erro ao consultar pagamento:", error);
            res.status(500).json({ erro: "Erro interno do servidor" });
        }
    }

    static async cancelarPagamento(req, res) {
        try {
            const { id } = req.params;
            const pagamento = pagamentos.get(id);

            if (!pagamento) {
                return res.status(404).json({ erro: "Pagamento não encontrado" });
            }

            const resultado = pagamento.cancelarPagamento();
            
            res.status(200).json(resultado);
        } catch (error) {
            console.error("Erro ao cancelar pagamento:", error);
            res.status(500).json({ erro: "Erro interno do servidor" });
        }
    }

    static async listarPagamentos(req, res) {
        try {
            const todosPagamentos = Array.from(pagamentos.values()).map(p => p.toJSON());
            
            res.status(200).json({
                total: todosPagamentos.length,
                pagamentos: todosPagamentos
            });
        } catch (error) {
            console.error("Erro ao listar pagamentos:", error);
            res.status(500).json({ erro: "Erro interno do servidor" });
        }
    }
}

module.exports = PagamentoController;