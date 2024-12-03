const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((e) => {
      const err = new Error(
        e.message || 'Something went wrong in async handler',
        { cause: e.cause || 500 },
      );
      return next(err);
    });
  };
};

export default asyncHandler;
