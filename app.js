const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { errors: celebrateErrors } = require("celebrate");
const mainRouter = require("./routes/index");
const { errorHandler } = require("./middlewares/error-handler");
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

// Crash test route (must be registered before auth routes like /signin and /signup)
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

// Main router for all routes
app.use(mainRouter);

// Celebrate validation errors must be converted before the general logger/handler
app.use(celebrateErrors());

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

// Global error handlers for errors that escape Express middleware
process.on("uncaughtException", (err) => {
  console.error(
    new Date().toISOString(),
    "UNCAUGHT EXCEPTION",
    err.stack || err
  );
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
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
