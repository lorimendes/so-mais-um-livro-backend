import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import usersRouter from './routes/users';
import booksRouter from './routes/books';
import { createUser, login } from './controllers/users';
import authenticateToken from './middlewares/auth';

const corsOptions = {
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

process.loadEnvFile();
const { PORT = 3000 } = process.env;
const app = express();

try {
  mongoose.connect('mongodb://localhost:27017');
} catch (err) {
  console.error(`Erro ao conectar com o banco de dados: ${err}`);
}

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
  console.error(err);
  return res.status(500).send({ message: 'Ocorreu um erro no servidor' });
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/signup', createUser);
app.use('/signin', login);
app.use(authenticateToken);
app.use('/users', usersRouter);
app.use('/books', booksRouter);
app.use(handleError);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log('Conectado');
  });
}

export default app;
