import express from 'express';
import {
  createBookValidator,
  updateIsReadBookValidator,
} from '../middlewares/bookValidator.js';
import {
  getBooks,
  createBook,
  updateIsReadBook,
  deleteBook,
} from '../controllers/books.js';

const booksRouter = express.Router();

booksRouter.get('/', getBooks);
booksRouter.post('/', createBookValidator, createBook);
booksRouter.patch('/:bookId', updateIsReadBookValidator, updateIsReadBook);
booksRouter.delete('/:bookId', deleteBook);

export default booksRouter;
