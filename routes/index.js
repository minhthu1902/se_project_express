const router = require("express").Router();
const clothingItem = require("./clothingItems");
const userRouter = require("./users");
const { NOT_FOUND } = require("../utils/errors");

router.use("/users", userRouter);
router.use("/items", clothingItem);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Route not found" });
});

const { login, createUser } = require("../controllers/users");

router.post("/signup", createUser);
router.post("/signin", login);

module.exports = router;
