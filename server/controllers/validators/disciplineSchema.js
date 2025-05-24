const Joi = require('joi');

const disciplineSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(500).required()
});

module.exports = { disciplineSchema };