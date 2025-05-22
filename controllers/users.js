const User = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  CONFLICT,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res.status(SERVER_ERROR).send({ message: "Something went wrong" });
    });
};

// getUser - returns a single user by id
const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid user id" });
      }
      return res.status(SERVER_ERROR).send({ message: "Something went wrong" });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      if (err.code === 11000) {
        return res.status(CONFLICT).send({ message: "User already exists" });
      }
      return res.status(SERVER_ERROR).send({ message: "Something went wrong" });
    });
};

// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const {
//   BAD_REQUEST,
//   NOT_FOUND,
//   SERVER_ERROR,
//   UNAUTHORIZED,
//   CONFLICT,
// } = require("../utils/errors");

// const User = require("../models/user");
// const { JWT_SECRET } = require("../utils/config");

// const createUser = (req, res) => {
//   const { name, avatar } = req.body;
//   bcrypt
//     .hash(password, 10)
//     .then((hash) => User.create({ name, avatar, email, password: hash }))
//     .then((user) => {
//       const { password: hashedPassword, ...userWithoutPassword } =
//         user.toObject();
//       res.status(201).send(userWithoutPassword);
//     })
//     .catch((err) => {
//       console.error(err);
//       if (err.name === "ValidationError") {
//         return res.status(BAD_REQUEST).send({ message: err.message });
//       }
//       if (err.code === 11000) {
//         return res.status(CONFLICT).send({ message: "User already exists" });
//       }
//       return res.status(SERVER_ERROR).send({ message: "Something went wrong" });
//     });
// };

// // Get users/me

// const getCurrentUser = (req, res) => {
//   User.findById(req.user._id)
//     .orFail()
//     .then((user) => {
//       const { password, ...userWithoutPassword } = user.toObject();
//       res.status(200).send(userWithoutPassword);
//     })
//     .catch((err) => {
//       console.error(err);
//       if (err.name === "DocumentNotFoundError") {
//         return res.status(NOT_FOUND).send({ message: "User not found" });
//       }
//       if (err.name === "CastError") {
//         return res.status(BAD_REQUEST).send({ message: "Invalid user id" });
//       }
//       return res
//         .status(SERVER_ERROR)
//         .send({ message: "An error occurred on the server" });
//     });
// };

// const login = (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res
//       .status(BAD_REQUEST)
//       .send({ message: "Email and password are required" });
//   }

//   return User.findUserCredentials(email, password)
//     .then((user) => {
//       const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
//         expiresIn: "7d",
//       });
//       res.send({ token });
//     })
//     .catch((err) => {
//       console.error(err);
//       if (err.message === "Incorrect email or password") {
//         return res
//           .status(UNAUTHORIZED)
//           .send({ message: "Invalid email or password" });
//       }
//       return res
//         .status(SERVER_ERROR)
//         .send({ message: "An error occurred on the server" });
//     });
// };
// //PATCH users me update profile

// const updateUser = (req, res) => {
//   const { name, avatar } = req.body;

//   User.findByIdAndUpdate(
//     req.user._id,
//     { name, avatar },
//     { new: true, runValidators: true }
//   )
//     .orFail()
//     .then((user) => {
//       const { password, ...userWithoutPassword } = user.toObject();
//       res.status(200).send(userWithoutPassword);
//     })
//     .catch((err) => {
//       console.error(err);
//       if (err.name === "ValidationError") {
//         return res.status(BAD_REQUEST).send({ message: err.message });
//       }
//       if (err.name === "DocumentNotFoundError") {
//         return res.status(NOT_FOUND).send({ message: "User not found" });
//       }
//       if (err.name === "CastError") {
//         return res.status(BAD_REQUEST).send({ message: "Invalid user id" });
//       }
//       return res.status(SERVER_ERROR).send({ message: "Something went wrong" });
//     });
// };
module.exports = {
  getUsers,
  getUser,
  createUser,
};
