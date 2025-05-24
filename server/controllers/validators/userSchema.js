const Joi = require('joi');

const userSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).when('$isCreate', {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  role: Joi.string().valid('admin', 'teacher', 'student').required()
});

module.exports = { userSchema };