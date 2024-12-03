import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export const PORT = process.env.PORT || 3000;
export const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
export const REDIS_PORT = process.env.REDIS_PORT || 6379;
export const RATE_LIMITER_LIMIT = process.env.RATE_LIMITER_LIMIT || 10;
export const RATE_LIMITER_WINDOW = process.env.RATE_LIMITER_WINDOW || 60;

export const WEATHER_KEY = process.env.WEATHER_KEY;
