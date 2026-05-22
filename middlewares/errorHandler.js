const errorHandler = (err, req, res, next) => {
    console.error(`Erro detectado: ${err.message}`);
    res.status(500).json({ 
        sucesso: false,
        mensagem: 'Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde.',
        detalhe: err.message
    });
};

module.exports = errorHandler;