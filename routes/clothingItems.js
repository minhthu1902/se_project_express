const router = require("express").Router();

const {
  getItems,
  createItem,
  getItem,
  deleteItem,
  addLike,
  removeLike,
} = require("../controllers/clothingItems");

//get all clothing items
router.get("/", getItems);

//get single clothing item by ID
router.get("/:itemId", getItem);

// delete a clothing item by ID
router.delete("/:itemId", deleteItem);

//Post create a new clothing item
router.post("/", createItem);
router.delete("/:itemId/likes", removeLike);
router.put("/:itemId/likes", addLike);

module.exports = router;
