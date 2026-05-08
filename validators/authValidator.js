const Joi = require("joi");

// Register validation
const registerSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

// Login validation
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

module.exports = {
  registerSchema,
  loginSchema,
};
