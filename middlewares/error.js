const handleError = (err, req, res, _next) => {
  if (err.name === 'CastError') {
    return res.status(400).send({ message: 'ID inválido' });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).send({ message: 'Dados incompletos ou inválidos' });
  }
  if (err.name === 'AuthenticationError') {
    return res.status(401).send({ message: 'Email e/ou senha incorretos' });
  }
  if (err.name === 'InvalidToken') {
    return res.status(401).send({ message: 'Token inválido ou expirado' });
  }
  if (err.name === 'AuthorizationError') {
    return res.status(403).send({ message: 'Usuário não autorizado' });
  }
  if (err.name === 'DocumentNotFoundError') {
    return res.status(404).send({ message: 'ID não encontrado' });
  }
  if (err.code === 11000) {
    return res.status(409).send({ message: 'Esse e-mail já está cadastrado' });
  }
  return res.status(500).send({ message: 'Ocorreu um erro no servidor' });
};

export default handleError;
