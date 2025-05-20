const router = require("express").Router();
const { getUsers, getUser, createUser } = require("../controllers/users");

router.get("/", getUsers);
router.get("/:userId", getUser);
router.post("/", createUser);
// const auth = require("../middlewares/auth");

// router.get("/me", auth, getCurrentUser);
// router.patch("/me", auth, updateUser);

module.exports = router;
