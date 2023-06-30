const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      required: true,
      
    },
    phone: {
      type: String,
      required: true,
      
    },
    favorite: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {versionKey:false, timestamps: true }
);

const Contact = model("contact", contactSchema);

contactSchema.post("save", handleMongooseError);

const addSchema = Joi.object({
  name: Joi
    .string()
    .min(3)
    .max(16)
    .messages({ "any.required": `missing required name field` })
    .required(),
  email: Joi
    .string()
    .email()
    .messages({
      "any.required": `missing required email field`,
    })
    .required(),
  phone: Joi
    .string()
    .min(3)
    .max(16)
    .messages({
      "any.required": `missing required phone field`,
    })
    .required(),
  favorite: Joi
    .boolean()
    .messages({
    "any.required": `missing field favorite`,
  }),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi
    .boolean()
    .required()
    .messages({
    "any.required": `missing field favorite`,
  }),
});

const schemas = {
  addSchema,
  updateFavoriteSchema,
};

module.exports = {
  Contact,
  schemas,
};