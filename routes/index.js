const router = require("express").Router();
const userRouter = require("./users");
const { NOT_FOUND } = require("../utils/errors");
const { createUser, login } = require("../controllers/users"); // Only once!

console.log("Routes index.js loaded"); // Add this line

// Test route to see if routes are working
router.get("/test", (req, res) => {
  console.log("Test route hit");
  res.send({ message: "Test route working" });
});

// Signup route with debug log
router.post("/signup", (req, res, next) => {
  console.log("Signup route hit");
  next();
}, createUser);

// Signin route with debug log
router.post("/signin", (req, res, next) => {
  console.log("Signin route hit");
  next();
}, login);
// User routes
router.use("/users", userRouter);
// Catch-all route for undefined routes (404)
router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Route not found" });
});

module.exports = router;
