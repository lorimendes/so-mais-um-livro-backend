import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const createUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const { _id } = await User.create({ name, email, password: hash });

    const token = jwt.sign(
      { _id },
      process.env.NODE_ENV === 'production'
        ? process.env.JWT_SECRET
        : 'dev-secret',
      {
        expiresIn: '7d',
      },
    );

    res.status(201).send({ token });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const { _id } = await User.findUserByCredentials(email, password);
    const token = jwt.sign(
      { _id },
      process.env.NODE_ENV === 'production'
        ? process.env.JWT_SECRET
        : 'dev-secret',
      {
        expiresIn: '7d',
      },
    );

    res.status(200).send({ token });
  } catch (err) {
    next(err);
  }
};

const getLoggedUser = async (req, res, next) => {
  const { _id } = req.user;
  try {
    const user = await User.findById(_id).orFail();
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

export { createUser, login, getLoggedUser };
