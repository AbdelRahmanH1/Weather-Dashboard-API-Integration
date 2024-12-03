import express from 'express';
import cors from 'cors';
import weatherRouter from './routes/weather.route.js';
import globaErrorHandler from './utils/globalErrorHandler.util.js';
import { connectRedis } from './config/redisConfig.config.js';
import rateLimiter from './middlewares/rateLimiter.middleware.js';
import {
  RATE_LIMITER_LIMIT,
  RATE_LIMITER_WINDOW,
} from './config/appConfig.config.js';

const app = express();

app.use(express.json());
await connectRedis();

app.use(rateLimiter(RATE_LIMITER_LIMIT, RATE_LIMITER_WINDOW));

app.use('/v1/weather', weatherRouter);

app.all('*', (req, res, next) => {
  const err = new Error('Page not found', { cause: 404 });
  return next(err);
});

app.use(globaErrorHandler);

export default app;
