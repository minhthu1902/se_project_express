const router = require("express").Router();
const clothingItem = require("./clothingItems");

const userRouter = require("./users");

router.use("/users", userRouter);
router.use("/items", clothingItem);

router.use((req, res) => {
  res.status(500).send({ message: "Router not found" });
});

// const { login, createUser } = require("../controllers/users");

// router.post("/signup", createUser);
// router.post("/signin", login);

module.exports = router;
