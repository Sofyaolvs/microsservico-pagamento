const validarRequisicao = (req, res, next) => {
    const contentType = req.get('Content-Type');
    
    if (req.method === 'POST' && !contentType?.includes('application/json')) {
        return res.status(400).json({
            erro: "Content-Type deve ser application/json"
        });
    }
    
    next();
};

module.exports = { validarRequisicao };