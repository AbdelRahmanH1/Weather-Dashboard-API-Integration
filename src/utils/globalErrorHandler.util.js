const globaErrorHandler = (err, req, res, next) => {
  const statusCode = err.cause || 500;
  const message = err.message || 'Something went wrong';

  return res
    .status(statusCode)
    .json({ success: false, message, stack: err.stack });
};
export default globaErrorHandler;
