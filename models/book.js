import mongoose from 'mongoose';
import validator from 'validator';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  authors: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
  },
  categories: {
    type: [String],
    default: [],
  },
  thumbnail: {
    type: String,
    validate: {
      validator: validator.isURL,
      message: 'Link inválido',
    },
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

const book = mongoose.model('book', bookSchema);

export default book;
