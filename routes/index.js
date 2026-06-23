const router = require("express").Router();
const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");
const { HttpError } = require("../middlewares/error-handler");
const { createUser, login } = require("../controllers/users"); // Only once!

router.post("/signup", createUser);

router.post("/signin", login);
// User routes
router.use("/users", userRouter);
router.use("/items", clothingItemsRouter);
// Catch-all route for undefined routes (404)
router.use((req, res, next) => {
  next(HttpError.notFound("Route not found"));
});

module.exports = router;
