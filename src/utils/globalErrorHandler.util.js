const globaErrorHandler = (err, req, res, next) => {
  const statusCode = err.cause || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json({ success: false, message });
};
export default globaErrorHandler;
