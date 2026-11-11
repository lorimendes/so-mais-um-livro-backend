import { celebrate, Joi, Segments } from 'celebrate';

const createBookValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().required(),
    authors: Joi.array().items(Joi.string()),
    description: Joi.string(),
    categories: Joi.array().items(Joi.string()),
    thumbnail: Joi.string().uri(),
    isRead: Joi.boolean(),
  }),
});

const updateIsReadBookValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    isRead: Joi.boolean(),
  }),
});

export { createBookValidator, updateIsReadBookValidator };
