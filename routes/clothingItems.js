const router = require("express").Router();
const { celebrate, Joi, Segments } = require("celebrate");
const auth = require("../middlewares/auth");

const {
  getItems,
  createItem,
  deleteItem,
  addLike,
  removeLike,
} = require("../controllers/clothingItems");

const itemIdSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required(),
  }),
};

const createItemSchema = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    imageUrl: Joi.string().uri().required(),
    weather: Joi.string().valid("hot", "warm", "cold").required(),
  }),
};

// get all clothing items
router.get("/", getItems);

// Post create a new clothing item
router.post("/", auth, celebrate(createItemSchema), createItem);
router.delete("/:itemId/likes", auth, celebrate(itemIdSchema), removeLike);
router.put("/:itemId/likes", auth, celebrate(itemIdSchema), addLike);
router.delete("/:itemId", auth, celebrate(itemIdSchema), deleteItem);
module.exports = router;
