// Minimal console-based request and error logging middleware for local testing
const requestLogger = (req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.originalUrl, req.ip);
  next();
};

const errorLogger = (err, req, res, next) => {
  console.error(
    new Date().toISOString(),
    "ERROR",
    req.method,
    req.originalUrl,
    req.ip,
    err && err.stack ? err.stack : err
  );
  next(err);
};

module.exports = { requestLogger, errorLogger };
