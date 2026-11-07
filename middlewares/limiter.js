import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  statusCode: 429,
  message: {
    message:
      'Você atingiu o limite de requisições. Por favor, aguarde 15 minutos.',
  },
});

export default limiter;
