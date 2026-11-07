import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import usersRouter from './routes/users.js';
import booksRouter from './routes/books.js';
import { createUser, login } from './controllers/users.js';
import limiter from './middlewares/limiter.js';
import authenticateToken from './middlewares/auth.js';
import handleError from './middlewares/error.js';
import { requestLogger, errorLogger } from './middlewares/logger.js';

const corsOptions = {
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

process.loadEnvFile();
const { PORT = 3000 } = process.env;
const app = express();

const { MONGODB_URL = 'mongodb://localhost:27017/somaisumlivro' } = process.env;
mongoose.connect(MONGODB_URL).catch((err) => {
  console.error(`Erro ao conectar com o banco de dados: ${err}`);
});

app.use(helmet());
app.use(limiter);
app.use(cors(corsOptions));
app.use(express.json());
app.use(requestLogger);
app.post('/signup', createUser);
app.post('/signin', login);
app.use(authenticateToken);
app.use('/users', usersRouter);
app.use('/books', booksRouter);
app.use(errorLogger);
app.use(handleError);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {});
}

export default app;
