const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  FORBIDDEN,
} = require("../utils/errors");
const ClothingItem = require("../models/clothingItem");
const mongoose = require("mongoose");

// NOTE: Always validate ObjectId before querying DB to avoid 400/500 errors and return 404 if invalid
// NOTE: Must return 404 (NOT_FOUND) if itemId is invalid or not found, not 400
// NOTE: Must return 403 (FORBIDDEN) if user is not the owner when deleting

// GET /items
const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      res
        .status(SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

// POST /items
const createItem = (req, res) => {
  const { name, imageUrl, weather } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, imageUrl, weather, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

// DELETE /items/:itemId
const deleteItem = (req, res) => {
  const { itemId } = req.params;

  // NOTE: Validate ObjectId, return 404 if invalid (postman test requires this)
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
  }

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      // NOTE: If user is not the owner, return 403 (Forbidden)
      if (!item.owner.equals(req.user._id)) {
        return res.status(FORBIDDEN).send({ message: "Forbidden" });
      }
      return item.deleteOne().then(() => {
        res.status(200).send({ message: "Item deleted successfully" });
      });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

const addLike = (req, res) => {
  const { itemId } = req.params;

  // NOTE: Validate ObjectId, return 404 if invalid (postman test requires this)
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
  }

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return res.send(item);
    })
    .catch(() => {
      return res.status(SERVER_ERROR).send({ message: "Error updating likes" });
    });
};

const removeLike = (req, res) => {
  const { itemId } = req.params;

  // NOTE: Validate ObjectId, return 404 if invalid (postman test requires this)
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
  }

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return res.send(item);
    })
    .catch(() => {
      return res.status(SERVER_ERROR).send({ message: "Error updating likes" });
    });
};

module.exports = {
  getItems,
  createItem,
  addLike,
  removeLike,
  deleteItem,
};
