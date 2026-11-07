import Book from '../models/book.js';

const authorizationError = new Error('Usuário não autorizado');
authorizationError.name = 'AuthorizationError';

const getBooks = async (req, res, next) => {
  const { _id } = req.user;

  try {
    const books = await Book.find({ owner: _id }).sort({ createdAt: -1 });

    res.status(200).send(books);
  } catch (err) {
    next(err);
  }
};

const createBook = async (req, res, next) => {
  const {
    title, //
    authors,
    description,
    categories,
    thumbnail,
  } = req.body;

  const bookData = {
    title,
    authors,
    description,
    categories,
    thumbnail,
    owner: req.user._id,
  };

  try {
    const book = await Book.create(bookData);
    res.status(201).send(book);
  } catch (err) {
    next(err);
  }
};

const updateIsReadBook = async (req, res, next) => {
  const { bookId } = req.params;
  const { isRead } = req.body;

  try {
    const bookToUpdate = await Book.findById(bookId);
    const bookOwnerId = bookToUpdate.owner.toString();

    if (bookOwnerId !== req.user._id) {
      throw authorizationError;
    }

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { isRead },
      { returnDocument: 'after', runValidators: true },
    );

    res.status(200).send(updatedBook);
  } catch (err) {
    next(err);
  }
};

const deleteBook = async (req, res, next) => {
  const { bookId } = req.params;

  try {
    const bookToDelete = await Book.findById(bookId);
    const bookOwnerId = bookToDelete.owner.toString();

    if (bookOwnerId !== req.user._id) {
      throw authorizationError;
    }

    const deletedBook = await Book.findByIdAndDelete(bookId);
    res.status(200).send(deletedBook);
  } catch (err) {
    next(err);
  }
};

export {
  getBooks, //
  createBook,
  updateIsReadBook,
  deleteBook,
};
