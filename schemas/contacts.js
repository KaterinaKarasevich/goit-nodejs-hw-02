const Joi = require("joi");

const addSchema = Joi.object({
  name: Joi
    .string()
    .min(2)
    .max(10)
    .messages({ "any.required": `missing required name field` })
    .required(),
  email: Joi
    .string()
    .messages({ "any.required": `missing required email field` })
    .required(),
  phone: Joi
    .string()
    .min(5)
    .max(18)
    .messages({ "any.required": `missing required phone field` })
    .required(),
});

module.exports = {
    addSchema,
}