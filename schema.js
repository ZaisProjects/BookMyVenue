const Joi = require('joi');

module.exports.listingSchema = Joi.object({
  listing : Joi.object({
    title : Joi.string().required(),
    image: Joi.object({
      url: Joi.string().allow('', null),
      filename: Joi.string().allow('', null)
    }).optional(),
    price : Joi.number().min(0).required(),
    location : Joi.string().required(),
    country : Joi.string().required(),
    description : Joi.string().required()
  }).required()
});
module.exports.reviewSchema = Joi.object({
  review : Joi.object({
    rating : Joi.number().max(5).min(0).required(),
    comment : Joi.string().required()
  }).required()
})

