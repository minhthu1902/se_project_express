const router = require("express").Router();
const { celebrate, Joi, Segments } = require("celebrate");
const auth = require("../middlewares/auth");
const { getCurrentUser, updateUser } = require("../controllers/users");

const updateUserSchema = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().uri().required(),
  }),
};

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, celebrate(updateUserSchema), updateUser);

module.exports = router;
