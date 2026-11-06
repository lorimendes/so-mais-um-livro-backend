import supertest from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import app from '../app';
import User from '../models/user';
import Book from '../models/book';

const request = supertest(app);

const fakeUser = {
  name: 'Book Test',
  email: 'book@test.com',
  password: 'paswordtest',
};

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Verifica rotas /books', () => {
  let token;
  let hackerToken;
  let userId;
  let bookId;

  beforeAll(async () => {
    const signupResponse = await request.post('/signup').send(fakeUser);
    token = signupResponse.body.token;
    userId = jwt.decode(token);

    const hackerResponse = await request.post('/signup').send({
      email: 'hacker@test.com',
      password: 'paswordtest',
    });
    hackerToken = hackerResponse.body.token;

    const postBookResponse = await request
      .post('/books')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Book to test',
      });
    bookId = postBookResponse.body._id;
  });

  afterAll(async () => {
    await Book.deleteMany({ owner: userId });
    await User.deleteOne({ email: fakeUser.email });
    await User.deleteOne({ email: 'hacker@test.com' });
  });

  describe('Verifica solicitação POST /books', () => {
    it('deve retornar status 201 e o livro criado', async () => {
      const response = await request
        .post('/books')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Book to test post' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('title', 'Book to test post');
    });

    it('deve retornar status 400 se os dados forem inválidos', async () => {
      const response = await request
        .post('/books')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: '' });

      expect(response.status).toBe(400);
    });
  });

  describe('Verifica solicitação GET /books', () => {
    it('deve retornar status 200 e um array de books', async () => {
      const response = await request
        .get('/books')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
    });

    it('deve retornar status 401, sem envio do token', async () => {
      const response = await request
        .get('/books')
        .set('Authorization', 'Bearer ');

      expect(response.status).toBe(401);
    });
  });

  describe('Verifica solicitação PATCH /:bookId', () => {
    it('deve retornar status 200 e o objeto book alterado', async () => {
      const response = await request
        .patch(`/books/${bookId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ isRead: true });

      expect(response.status).toBe(200);
      expect(response.body.isRead).toBeTruthy();
    });

    it('deve retornar status 401, se o token for de usuário não autorizado', async () => {
      const response = await request
        .patch(`/books/${bookId}`)
        .set('Authorization', `Bearer ${hackerToken}`)
        .send({ isRead: true });

      expect(response.status).toBe(403);
      expect(response.body.isRead).toBeFalsy();
    });
  });

  describe('Verifica solicitação DELETE /:bookId', () => {
    it('deve retornar status 403, se o token for de usuário não autorizado', async () => {
      const response = await request
        .delete(`/books/${bookId}`)
        .set('Authorization', `Bearer ${hackerToken}`);

      expect(response.status).toBe(403);
    });

    it('deve retornar status 200 e o objeto book que foi deletado', async () => {
      const response = await request
        .delete(`/books/${bookId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body._id).toBe(bookId);
    });
  });
});
