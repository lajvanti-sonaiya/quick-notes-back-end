import Joi from "joi";

export const taskAddValidation = Joi.object({
  title: Joi.string().required(),
  description: Joi.string(),
  columnId: Joi.string().required(),
});

export const taskUpdateValidation = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
});