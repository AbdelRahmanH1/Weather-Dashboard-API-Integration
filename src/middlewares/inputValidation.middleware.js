const inputValidation = (schema) => {
  return (req, res, next) => {
    const data = { ...req.body, ...req.params, ...req.query };

    const result = schema.validate(data, { AbortEarly: false });

    if (result.error) {
      const messages = result.error.details.map((errorObj) => {
        return errorObj.message;
      });
      const err = new Error(messages, { cause: 400 });
      return next(err);
    }
    return next();
  };
};

export default inputValidation;
