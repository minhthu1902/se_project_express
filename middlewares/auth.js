const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { HttpError } = require("./error-handler");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(HttpError.unauthorized("Authorization required"));
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return next(HttpError.unauthorized("Invalid token"));
  }
};

module.exports = auth;
