import { createClient } from 'redis';
import { REDIS_HOST, REDIS_PORT } from './appConfig.config.js';

export let client = createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
});

const maxRetries = 5;
const initialRetryDelay = 1000;

export const connectRedis = async (retryCount = 0) => {
  try {
    client = createClient({
      url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
    });

    await client.connect();
    console.log('Redis: Connected successfully');
  } catch (error) {
    if (retryCount < maxRetries) {
      const delay = initialRetryDelay * 2 ** retryCount;
      console.error(`Redis: Connection failed. Retrying in ${delay}ms...`);
      setTimeout(() => {
        connectRedis(retryCount + 1);
      }, delay);
    } else {
      console.error('Redis: Max retries reached. Connection failed.');
      throw error;
    }
  }
};
