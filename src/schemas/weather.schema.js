import joi from 'joi';

export const getCityNameSchema = joi
  .object({
    cityname: joi
      .string()
      .min(3)
      .max(20)
      .pattern(/^[a-zA-Z\s]*$/)
      .required()
      .messages({
        'string.empty': 'City name cannot be empty',
        'string.min': 'City name should be at least 3 characters',
        'string.max': 'City name should be no longer than 20 characters',
        'any.required': 'City name is required',
      }),
  })
  .required();
