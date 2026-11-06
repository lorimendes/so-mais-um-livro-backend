import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import usersRouter from './routes/users';
import booksRouter from './routes/books';
import { createUser, login } from './controllers/users';
import authenticateToken from './middlewares/auth';
import handleError from './middlewares/error';

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
