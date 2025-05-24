const Joi = require('joi');

const groupSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  discipline_id: Joi.number().integer().min(1).required()
});

module.exports = { groupSchema };