const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  getItems,
  createItem,
  deleteItem,
  addLike,
  removeLike,
} = require("../controllers/clothingItems");

// get all clothing items
router.get("/", getItems);

// get single clothing item by ID
router.get("/:itemId", getItems);

// Post create a new clothing item
router.post("/", auth, createItem);
router.delete("/:itemId/likes", auth, removeLike);
router.put("/:itemId/likes", auth, addLike);
router.delete("/:itemId", auth, deleteItem);
module.exports = router;
