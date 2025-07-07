const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
// Importing necessary modules
const app = express();
const { PORT = 3001 } = process.env;
app.use((req, res, next) => {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133",
  };
  next();
});

app.use("/", mainRouter);
const itemsRouter = require("./routes/clothingItems");
const usersRouter = require("./routes/users");
// importing middlewares and controllers
const auth = require("./middlewares/auth");
const { createUser, login } = require("./controllers/users");
const { NOT_FOUND } = require("./utils/errors");

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Public routes
app.post("/signup", createUser);
app.post("/signin", login);

// Protected routes
app.use("/users", usersRouter);
app.use(
  "/items",
  (req, res, next) => {
    if (req.method === "GET") {
      return next();
    }
    return auth(req, res, next);
  },
  itemsRouter
);

// connect to mongoDB server
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(console.error);

// 404 middlewares for unhandle routes
app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

// Central error handling middleware
app.use((err, req, res) => {
  console.error(err);
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? "An error occurred on the server" : message,
  });
  // next(err);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
