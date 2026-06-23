const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`
    )
  ),
  transports: [new winston.transports.Console()],
});

const requestLogger = (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl} ${req.ip}`);
  next();
};

const errorLogger = (err, req, res, next) => {
  logger.error(
    `${req.method} ${req.originalUrl} ${req.ip} ${
      err && err.stack ? err.stack : err
    }`
  );
  next(err);
};

module.exports = { requestLogger, errorLogger };
