import { client } from '../../config/redisConfig.config.js';

export const setForecastToRedis = async (cityName, forecastData) => {
  try {
    const key = `forecast:${cityName}`;
    for (let i = 0; i < forecastData.length; i++) {
      await client.rPush(key, JSON.stringify(forecastData[0]));
      await client.expire(key, 10800);
    }
  } catch (error) {
    throw new Error('Error saving forecast data to Redis', { cause: 500 });
  }
};

export const getForecastFromRedis = async (cityName) => {
  try {
    const key = `forecast:${cityName}`;
    const forecastData = await client.lRange(key, 0, -1);
    return forecastData.map((item) => JSON.parse(item));
  } catch (error) {
    throw new Error('Error retrieving forecast data from Redis', {
      cause: 500,
    });
  }
};
