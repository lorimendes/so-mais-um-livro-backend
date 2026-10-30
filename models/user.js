import mongoose from "mongoose";
import validator from "validator";

const userSquema = new mongoose.Squema({
  name: {
    type: String,
    minlenhth: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: validator.isEmail,
      message: "E-mail inválido",
    },
  },
  password: {
    type: String,
    required: true,
    minlenhth: 8,
    select: false,
  },
});

const user = mongoose.model("user", userSquema);

export default user;
