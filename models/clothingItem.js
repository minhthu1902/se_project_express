// const mongoose = require("mongoose");
// const validator = require("validator");

// const clothingItemSchema = new mongoose.Schema({
//   name: {
//     type: String, // Name of the clothing item
//     required: true,
//     minlength: 2,
//     maxlength: 30,
//     unique: true, // Name should be unique
//   },
//   weather: {
//     type: String, // URL of the clothing item image
//     required: true,
//     enum: ["hot", "warm", "cold"],
//   },
//   imageUrl: {
//     type: String, // URL of the clothing item image
//     required: true,
//     validate: {
//       validator: (v) => validator.isURL(v),
//       message: "Invalid URL",
//     },
//   },
//   owner: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "user", // Reference to the user who created the clothing item
//     required: true,
//   },
//   likes: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "user", // Reference to the user who likes the clothing item
//     },
//   ],
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model("item", clothingItemSchema);
