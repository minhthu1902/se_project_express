class HttpError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace?.(this, this.constructor);
  }

  static badRequest(message = "Bad Request") {
    return new HttpError(message, 400);
  }

  static unauthorized(message = "Unauthorized") {
    return new HttpError(message, 401);
  }

  static forbidden(message = "Forbidden") {
    return new HttpError(message, 403);
  }

  static notFound(message = "Not Found") {
    return new HttpError(message, 404);
  }

  static conflict(message = "Conflict") {
    return new HttpError(message, 409);
  }
}

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID";
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    message = err.message;
  }

  res.status(statusCode).json({
    message,
  });
};

module.exports = { HttpError, errorHandler };
