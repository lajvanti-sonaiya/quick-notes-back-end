import Joi from "joi";

const imageSchema = Joi.object({
  url: Joi.string().uri().required(),
  public_id: Joi.string().required(),
});

export const noteAddValidation = Joi.object({
  title: Joi.string().max(100).required(),
  content: Joi.string().max(500).required(),
  category: Joi.string().valid("personal", "work", "ideas").required(),
  isPinned: Joi.boolean(),
  image: Joi.array().items(imageSchema).optional(),
});

export const noteUpdateValidation = Joi.object({
  title: Joi.string().max(100).optional(),
  content: Joi.string().max(500).optional(),
  category: Joi.string().valid("personal", "work", "ideas").optional(),
  isPinned: Joi.boolean(),
  order: Joi.number().integer().min(1).optional(),
  image: Joi.array().items(imageSchema).optional(),
});
