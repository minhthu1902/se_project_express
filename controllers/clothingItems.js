const mongoose = require("mongoose");
const { HttpError } = require("../middlewares/error-handler");
const ClothingItem = require("../models/clothingItem");

// NOTE: Always validate ObjectId before querying DB to avoid 400/500 errors and return 404 if invalid
// NOTE: Must return 404 (NOT_FOUND) if itemId is invalid or not found, not 400
// NOTE: Must return 403 (FORBIDDEN) if user is not the owner when deleting

// GET /items
const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch(() => next(new HttpError("An error occurred on the server", 500)));
};

// POST /items
const createItem = (req, res, next) => {
  const { name, imageUrl, weather } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, imageUrl, weather, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(HttpError.badRequest(err.message));
      }
      return next(new HttpError("An error occurred on the server", 500));
    });
};

// DELETE /items/:itemId
const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  // NOTE: Validate ObjectId, return 404 if invalid (postman test requires this)
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(HttpError.badRequest("Invalid item ID"));
  }

  return ClothingItem.findById(itemId) // <- add return here, if-statement does not run there is no return for the rest of the function
    .orFail()
    .then((item) => {
      // NOTE: If user is not the owner, return 403 (Forbidden)
      if (!item.owner.equals(req.user._id)) {
        return next(HttpError.forbidden("Forbidden"));
      }
      return item.deleteOne().then(() => {
        res.status(200).send({ message: "Item deleted successfully" });
      });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(HttpError.notFound("Item not found"));
      }
      return next(new HttpError("An error occurred on the server", 500));
    });
};

const addLike = (req, res, next) => {
  const { itemId } = req.params;

  // NOTE: Validate ObjectId, return 404 if invalid (postman test requires this)
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(HttpError.badRequest("Invalid item ID"));
  }

  return ClothingItem.findByIdAndUpdate(
    // <- add return here, if-statement does not run there is no return for the rest of the function
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return next(HttpError.notFound("Item not found"));
      }
      return res.send(item);
    })
    .catch(() => next(new HttpError("Error updating likes", 500)));
};

const removeLike = (req, res, next) => {
  const { itemId } = req.params;

  // NOTE: Validate ObjectId, return 404 if invalid (postman test requires this)
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(HttpError.badRequest("Invalid item ID"));
  }

  return ClothingItem.findByIdAndUpdate(
    // <- add return here, if-statement does not run there is no return for the rest of the function
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return next(HttpError.notFound("Item not found"));
      }
      return res.send(item);
    })
    .catch(() => next(new HttpError("Error updating likes", 500)));
};

module.exports = {
  getItems,
  createItem,
  addLike,
  removeLike,
  deleteItem,
};
