import Joi from "joi";

export const noteAddValidation = Joi.object({
  title: Joi.string().max(100).required(),
  content: Joi.string().max(500).required(),
  category: Joi.string().valid("personal", "work", "ideas").required(),
  isPinned: Joi.boolean(),
});


export const noteUpdateValidation = Joi.object({
  title: Joi.string().max(100).optional(),
  content: Joi.string().max(500).optional(),
  category: Joi.string().valid("personal", "work", "ideas").optional(),
  isPinned: Joi.boolean(),
});


