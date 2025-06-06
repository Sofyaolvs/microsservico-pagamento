const { v4: uuidv4 } = require('uuid');
const PagamentoCartaoCredito = require('../models/PagamentoCredito');
const PagamentoCartaoDebito = require('../models/PagamentoDebito');
const PagamentoPix = require('../models/PagamentoPix');
const PagamentoSchema = require('../models/PagamentoSchema');

const pagamentos = new Map();

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

            const pagamentoMongo = new PagamentoSchema({
                valor: parseFloat(valor),
                numeroCartao: numeroCartao,
                nomeTitular: nomeTitular,
                parcelas: parseInt(parcelas) || 1,
                tipo: 'CartaoCredito'
            });

            await pagamentoMongo.save();

            const id = pagamentoMongo._id.toString();
            const pagamento = new PagamentoCartaoCredito(
                id,
                parseFloat(valor),
                numeroCartao,
                nomeTitular,
                codigoSeguranca,
                validade,
                parseInt(parcelas) || 1
            );

            pagamentos.set(id, pagamento);

            res.status(201).json({
                mensagem: "Pagamento criado com sucesso",
                pagamento: pagamento.toJSON()
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

            const pagamentoMongo = new PagamentoSchema({
                valor: parseFloat(valor),
                numeroCartao: numeroCartao,
                nomeTitular: nomeTitular,
                banco: banco,
                tipo: 'CartaoDebito'
            });

            await pagamentoMongo.save();

            const id = pagamentoMongo._id.toString();
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

            const pagamentoMongo = new PagamentoSchema({
                valor: parseFloat(valor),
                chavePix: chavePix,
                tipo: 'PIX'
            });

            await pagamentoMongo.save();

            const id = pagamentoMongo._id.toString();
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
            let pagamento = pagamentos.get(id);

            if (!pagamento) {
                const pagamentoMongo = await PagamentoSchema.findById(id);
                if (!pagamentoMongo) {
                    return res.status(404).json({ erro: "Pagamento não encontrado" });
                }

                switch (pagamentoMongo.tipo) {
                    case 'CartaoCredito':
                        pagamento = new PagamentoCartaoCredito(
                            pagamentoMongo._id.toString(),
                            pagamentoMongo.valor,
                            pagamentoMongo.numeroCartao,
                            pagamentoMongo.nomeTitular,
                            '', 
                            '', 
                            pagamentoMongo.parcelas
                        );
                        break;
                    case 'CartaoDebito':
                        pagamento = new PagamentoCartaoDebito(
                            pagamentoMongo._id.toString(),
                            pagamentoMongo.valor,
                            pagamentoMongo.numeroCartao,
                            pagamentoMongo.nomeTitular,
                            '', 
                            pagamentoMongo.banco
                        );
                        break;
                    case 'PIX':
                        pagamento = new PagamentoPix(
                            pagamentoMongo._id.toString(),
                            pagamentoMongo.valor,
                            pagamentoMongo.chavePix
                        );
                        break;
                    default:
                        return res.status(400).json({ erro: "Tipo de pagamento inválido" });
                }

                pagamento.status = pagamentoMongo.status;
                pagamento.dataPagamento = pagamentoMongo.dataPagamento;
                pagamentos.set(id, pagamento);
            }

            const resultado = await pagamento.efetuarPagamento();
            
            await PagamentoSchema.findByIdAndUpdate(id, {
                status: pagamento.status,
                dataPagamento: pagamento.dataPagamento,
                comprovante: pagamento.comprovante
            });
            
            res.status(200).json(resultado);
        } catch (error) {
            console.error("Erro ao efetuar pagamento:", error);
            res.status(500).json({ erro: "Erro interno do servidor" });
        }
    }

    static async consultarPagamento(req, res) {
        try {
            const { id } = req.params;
            
            let pagamento = pagamentos.get(id);
            
            if (!pagamento) {
                const pagamentoMongo = await PagamentoSchema.findById(id);
                if (!pagamentoMongo) {
                    return res.status(404).json({ erro: "Pagamento não encontrado" });
                }
                
                return res.status(200).json({
                    pagamento: {
                        id: pagamentoMongo._id,
                        valor: pagamentoMongo.valor,
                        status: pagamentoMongo.status,
                        tipo: pagamentoMongo.tipo,
                        dataPagamento: pagamentoMongo.dataPagamento,
                        numeroCartao: pagamentoMongo.numeroCartao ? `**** **** **** ${pagamentoMongo.numeroCartao.slice(-4)}` : undefined,
                        nomeTitular: pagamentoMongo.nomeTitular,
                        parcelas: pagamentoMongo.parcelas,
                        banco: pagamentoMongo.banco,
                        chavePix: pagamentoMongo.chavePix,
                        comprovante: pagamentoMongo.comprovante
                    }
                });
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
            let pagamento = pagamentos.get(id);
            
            if (!pagamento) {
    
                const pagamentoMongo = await PagamentoSchema.findById(id);
                if (!pagamentoMongo) {
                    return res.status(404).json({ erro: "Pagamento não encontrado" });
                }

                if (pagamentoMongo.status === "Concluído") {
                    return res.status(400).json({
                        sucesso: false,
                        mensagem: "Pagamento já concluído, não pode ser cancelado!"
                    });
                }
                
                await PagamentoSchema.findByIdAndUpdate(id, { status: "Cancelado" });
                
                return res.status(200).json({
                    sucesso: true,
                    mensagem: "Pagamento cancelado!"
                });
            }

            const resultado = pagamento.cancelarPagamento();
       
            await PagamentoSchema.findByIdAndUpdate(id, { status: pagamento.status });
            
            res.status(200).json(resultado);
        } catch (error) {
            console.error("Erro ao cancelar pagamento:", error);
            res.status(500).json({ erro: "Erro interno do servidor" });
        }
    }

    static async listarPagamentos(req, res) {
        try {
            const pagamentosMongo = await PagamentoSchema.find({});
            
            const todosPagamentos = pagamentosMongo.map(p => ({
                id: p._id,
                valor: p.valor,
                status: p.status,
                tipo: p.tipo,
                dataPagamento: p.dataPagamento,
                numeroCartao: p.numeroCartao ? `**** **** **** ${p.numeroCartao.slice(-4)}` : undefined,
                nomeTitular: p.nomeTitular,
                parcelas: p.parcelas,
                banco: p.banco,
                chavePix: p.chavePix,
                comprovante: p.comprovante,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt
            }));
            
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