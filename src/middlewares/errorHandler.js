// Middleware para tratamento de erros
const errorHandler = (err, req, res, next) => {
  console.error('Erro na aplicação:', err);
  
  // Verificar se é um erro de validação do Sequelize
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      mensagem: 'Erro de validação',
      erros: err.errors.map(e => e.message)
    });
  }
  
  // Verificar se é um erro de chave estrangeira do Sequelize
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      mensagem: 'Erro de referência',
      erro: 'A operação não pode ser concluída porque o registro está sendo referenciado por outros registros'
    });
  }
  
  // Erro genérico
  return res.status(500).json({
    mensagem: 'Erro interno do servidor',
    erro: process.env.NODE_ENV === 'development' ? err.message : 'Ocorreu um erro inesperado'
  });
};

module.exports = errorHandler;

