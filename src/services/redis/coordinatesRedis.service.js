import { client } from '../../config/redisConfig.config.js';

export const setCoordinatesInRedis = async (cityName, latitude, longitude) => {
  try {
    await client.setEx(
      `coordinates:${cityName}`,
      604800,
      JSON.stringify({ latitude, longitude }),
    );
  } catch (error) {
    throw new Error('Error adding city to Redis', { cause: 500 });
  }
};

export const getCoordinatesFromRedis = async (cityName) => {
  try {
    const coordinatesString = await client.get(`coordinates:${cityName}`);
    if (coordinatesString) {
      return JSON.parse(coordinatesString);
    } else {
      return null;
    }
  } catch (error) {
    throw new Error('Error retrieving city coordinates from Redis', {
      cause: 500,
    });
  }
};
