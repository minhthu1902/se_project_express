const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const { HttpError } = require("../middlewares/error-handler");

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(HttpError.badRequest("Email and password are required"));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      const { password: hashedPassword, ...userWithoutPassword } =
        user.toObject();
      res.send({ token, user: userWithoutPassword });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return next(HttpError.unauthorized("Invalid email or password"));
      }
      return next(new HttpError("An error occurred on the server", 500));
    });
};

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  if (!email || !password) {
    return next(HttpError.badRequest("Email and password are required"));
  }
  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const { password: hashedPassword, ...userWithoutPassword } =
        user.toObject();
      res.status(201).send(userWithoutPassword);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(HttpError.conflict("User already exists"));
      }
      if (err.name === "ValidationError") {
        return next(HttpError.badRequest(err.message));
      }
      return next(new HttpError("An error occurred on the server", 500));
    });
};

// Get users/me

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      const { password, ...userWithoutPassword } = user.toObject();
      res.status(200).send(userWithoutPassword);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(HttpError.notFound("User not found"));
      }
      if (err.name === "CastError") {
        return next(HttpError.badRequest("Invalid user id"));
      }
      return next(new HttpError("An error occurred on the server", 500));
    });
};

// //PATCH users me update profile

const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => {
      const { password, ...userWithoutPassword } = user.toObject();
      res.status(200).send(userWithoutPassword);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(HttpError.badRequest(err.message));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(HttpError.notFound("User not found"));
      }
      if (err.name === "CastError") {
        return next(HttpError.badRequest("Invalid user id"));
      }
      return next(new HttpError("Something went wrong", 500));
    });
};
module.exports = {
  getCurrentUser,
  createUser,
  updateUser,
  login,
};
