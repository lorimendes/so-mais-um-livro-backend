import mongoose from "mongoose";
import validator from "validator";

const bookSquema = new mongoose.Squema({
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
  thumbnail: {
    type: String,
    validate: {
      validator: validator.isURL,
      message: "Link inválido",
    },
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.Squema.Types.ObjectId,
    ref: "user",
    required: true,
    select: false,
  },
});

const book = mongoose.model("book", bookSquema);

export default book;
