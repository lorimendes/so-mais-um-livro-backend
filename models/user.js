import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
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

userSchema.statics.findUserByCredentials = async function findUserByCredentials(
  email,
  password,
) {
  const user = await this.findOne({ email }).select("+password");

  const error = new Error("E-mail ou senha incorretos");
  error.name = "AuthenticationError";

  if (!user) {
    throw error;
  }

  const matched = await bcrypt.compare(password, user.password);

  if (!matched) {
    throw error;
  }

  return user;
};

const user = mongoose.model("user", userSchema);

export default user;
