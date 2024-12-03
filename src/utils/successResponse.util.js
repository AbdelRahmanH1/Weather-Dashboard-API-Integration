const successResponse = (
  res,
  { status = 200, message = 'No message', data = null } = {},
) => {
  if (typeof status !== 'number' || status < 100 || status > 599) {
    status = 200;
  }

  if (message && typeof message !== 'string') {
    message = 'No message';
  }

  if (data !== null && typeof data !== 'object') {
    data = { data };
  }

  return res.status(status).json({ success: true, message, data });
};

export default successResponse;
