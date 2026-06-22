const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const { errorHandler, HttpError } = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();
const { PORT = 3001, MONGO_URL = "mongodb://127.0.0.1:27017/wtwr_db" } =
  process.env;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Request logging (must come before routes)
app.use(requestLogger);

// Importing error codes
const { NOT_FOUND } = require("./utils/errors");

// Crash test route (must be registered before auth routes like /signin and /signup)
app.get("/crash-test", (req, res) => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

// Main router for all routes
app.use(mainRouter);

// 404 handler (must call next with an error so error middleware can handle it)
app.use((req, res, next) => {
  next(HttpError.notFound("Requested resource not found"));
});

// Error logging (logs errors before sending responses)
app.use(errorLogger);

// Error handler middleware (must be last)
app.use(errorHandler);

// Connect to MongoDB
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(console.error);

// NOTE: 404 handling is moved above to pass a NotFound error into the
// centralized error handler so it can be logged and formatted consistently.

// Global error handlers for errors that escape Express middleware
process.on("uncaughtException", (err) => {
  console.error(
    new Date().toISOString(),
    "UNCAUGHT EXCEPTION",
    err.stack || err
  );
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error(
    new Date().toISOString(),
    "UNHANDLED REJECTION",
    reason && reason.stack ? reason.stack : reason
  );
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
