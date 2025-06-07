const express = require('express');
const router = express.Router();

class PaymentMenuController {
    static async mostrarMenu(req, res) {
        try {
            res.status(200).json({
                titulo: "Sistema de Pagamentos",
                descricao: "Selecione o método de pagamento desejado",
                metodosPagamento: [
                    {
                        id: 1,
                        tipo: "cartao-credito",
                        nome: "Cartão de Crédito",
                        descricao: "Pagamento parcelado com cartão de crédito",
                        endpoint: "/api/pagamentos/cartao-credito",
                        metodo: "POST",
                        camposObrigatorios: [
                            "valor",
                            "numeroCartao", 
                            "nomeTitular",
                            "codigoSeguranca",
                            "validade",
                            "parcelas"
                        ],
                        exemplo: {
                            valor: 100.00,
                            numeroCartao: "1234567812345678",
                            nomeTitular: "João Silva",
                            codigoSeguranca: "123",
                            validade: "12/25",
                            parcelas: 3
                        }
                    },
                    {
                        id: 2,
                        tipo: "cartao-debito",
                        nome: "Cartão de Débito",
                        descricao: "Pagamento à vista com cartão de débito",
                        endpoint: "/api/pagamentos/cartao-debito",
                        metodo: "POST",
                        camposObrigatorios: [
                            "valor",
                            "numeroCartao",
                            "nomeTitular", 
                            "codigoSeguranca",
                            "banco"
                        ],
                        exemplo: {
                            valor: 50.00,
                            numeroCartao: "9876543298765432",
                            nomeTitular: "Maria Santos",
                            codigoSeguranca: "456",
                            banco: "Banco do Brasil"
                        }
                    },
                    {
                        id: 3,
                        tipo: "pix",
                        nome: "PIX",
                        descricao: "Pagamento instantâneo via PIX",
                        endpoint: "/api/pagamentos/pix",
                        metodo: "POST",
                        camposObrigatorios: [
                            "valor",
                            "chavePix"
                        ],
                        exemplo: {
                            valor: 25.00,
                            chavePix: "usuario@email.com"
                        }
                    }
                ],
                instrucoesUso: {
                    passo1: "Escolha um método de pagamento",
                    passo2: "Faça POST no endpoint correspondente com os dados",
                    passo3: "Anote o ID do pagamento retornado",
                    passo4: "Use POST /api/pagamentos/:id/efetuar para processar"
                }
            });
        } catch (error) {
            console.error("Erro ao mostrar menu:", error);
            res.status(500).json({ erro: "Erro interno do servidor" });
        }
    }

    static async processarEscolha(req, res) {
        try {
            const { metodoPagamento, dadosPagamento } = req.body;

            if (!metodoPagamento || !dadosPagamento) {
                return res.status(400).json({
                    erro: "Método de pagamento e dados são obrigatórios",
                    formatoEsperado: {
                        metodoPagamento: "cartao-credito | cartao-debito | pix",
                        dadosPagamento: "objeto com os dados do pagamento"
                    }
                });
            }

            let endpoint;
            let camposObrigatorios;

            switch (metodoPagamento) {
                case 'cartao-credito':
                    endpoint = '/api/pagamentos/cartao-credito';
                    camposObrigatorios = ['valor', 'numeroCartao', 'nomeTitular', 'codigoSeguranca', 'validade'];
                    break;
                case 'cartao-debito':
                    endpoint = '/api/pagamentos/cartao-debito';
                    camposObrigatorios = ['valor', 'numeroCartao', 'nomeTitular', 'codigoSeguranca', 'banco'];
                    break;
                case 'pix':
                    endpoint = '/api/pagamentos/pix';
                    camposObrigatorios = ['valor', 'chavePix'];
                    break;
                default:
                    return res.status(400).json({
                        erro: "Método de pagamento inválido",
                        metodosValidos: ['cartao-credito', 'cartao-debito', 'pix']
                    });
            }

            // Validar campos obrigatórios
            const camposFaltando = camposObrigatorios.filter(campo => !dadosPagamento[campo]);
            if (camposFaltando.length > 0) {
                return res.status(400).json({
                    erro: "Campos obrigatórios não fornecidos",
                    camposFaltando: camposFaltando,
                    camposObrigatorios: camposObrigatorios
                });
            }

            // Redirecionar para o endpoint apropriado
            res.status(200).json({
                sucesso: true,
                mensagem: `Método ${metodoPagamento} selecionado com sucesso`,
                proximoPasso: `Fazer POST para ${endpoint}`,
                dados: dadosPagamento,
                instrucao: "Use os dados validados para criar o pagamento no endpoint indicado"
            });

        } catch (error) {
            console.error("Erro ao processar escolha:", error);
            res.status(500).json({ erro: "Erro interno do servidor" });
        }
    }
}

module.exports = PaymentMenuController;