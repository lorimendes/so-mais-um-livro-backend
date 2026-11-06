import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import User from '../models/user';

const request = supertest(app);

const fakeUser = {
  name: 'User Test',
  email: 'user@test.com',
  password: 'paswordtest',
};

const invalidUser = {
  name: 'u',
  email: 'user@',
  password: '123',
};

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Verifica solicitação POST /signup', () => {
  it('deve retornar status 201 e o token', async () => {
    const response = await request.post('/signup').send(fakeUser);

    expect(response.status).toBe(201);
    expect(response.header['content-type']).toMatch('application/json');
    expect(response.body).toHaveProperty('token');
  });

  it('deve retornar status 409 ao enviar mesmo e-mail pela segunda vez', async () => {
    const response = await request.post('/signup').send(fakeUser);

    expect(response.status).toBe(409);
  });

  it('deve retornar status 400 ao enviar dados inválidos', async () => {
    const { email, password } = invalidUser;

    const response = await request.post('/signup').send({ email, password });

    expect(response.status).toBe(400);
  });

  afterAll(async () => {
    await User.deleteOne({ email: fakeUser.email });
  });
});

describe('Verifica solicitação POST /signin', () => {
  beforeAll(async () => {
    await request.post('/signup').send(fakeUser);
  });

  it('deve retornar status 200 e o token', async () => {
    const { email, password } = fakeUser;
    const response = await request.post('/signin').send({ email, password });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('deve retornar status 401 ao enviar dados incorretos', async () => {
    const response = await request
      .post('/signin')
      .send({ email: 'user@err.com', password: '123213123' });

    expect(response.status).toBe(401);
  });

  afterAll(async () => {
    await User.deleteOne({ email: fakeUser.email });
  });
});

describe('Verifica as rotas /users', () => {
  let token;

  beforeAll(async () => {
    const signinResponse = await request.post('/signup').send(fakeUser);
    token = signinResponse.body.token;
  });

  afterAll(async () => {
    await User.deleteOne({ email: fakeUser.email });
  });

  describe('Verifica solicitação GET /users/me', () => {
    it('deve retornar status 200 e os dados de usuário, sem senha', async () => {
      const response = await request
        .get('/users/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name');
      expect(response.body).not.toHaveProperty('password');
    });

    it('deve retornar status 401 se estiver sem token', async () => {
      const response = await request.get('/users/me');

      expect(response.status).toBe(401);
    });
  });
});
