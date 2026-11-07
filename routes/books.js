import express from 'express';
import {
  getBooks,
  createBook,
  updateIsReadBook,
  deleteBook,
} from '../controllers/books.js';

const booksRouter = express.Router();

booksRouter.get('/', getBooks);
booksRouter.post('/', createBook);
booksRouter.patch('/:bookId', updateIsReadBook);
booksRouter.delete('/:bookId', deleteBook);

export default booksRouter;
