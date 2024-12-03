import asyncHandler from '../utils/asyncHandler.util.js';
import { client } from '../config/redisConfig.config.js';

const rateLimiter = (limit, windowInSeconds) => {
  return asyncHandler(async (req, res, next) => {
    const ip = req.ip;
    const realIp =
      ip.startsWith('::1') || ip.startsWith('127.0.0.1') ? 'localhost' : ip;

    const redisKey = `rateLimit:${realIp}`;
    const currentCount = await client.get(redisKey);

    if (currentCount && parseInt(currentCount) >= limit) {
      const err = new Error('Too many requests. Please try again later.', {
        cause: 429,
      });
      return next(err);
    }

    if (!currentCount) {
      await client.set(redisKey, 1, { EX: windowInSeconds });
    } else {
      await client.incr(redisKey);
    }

    return next();
  });
};

export default rateLimiter;
