import { client } from '../../config/redisConfig.config.js';

export const setCurrentWeatherInRedis = async (cityName, weatherData) => {
  try {
    await client.set(
      `currentWeather:${cityName}`,
      JSON.stringify(weatherData),
      { EX: 3600 },
    );
  } catch (error) {
    throw new Error('Error Saving in redis', { cause: 500 });
  }
};

export const getCurrentWeatherInRedis = async (cityName) => {
  try {
    const cachedWeather = await client.get(`currentWeather:${cityName}`);
    if (cachedWeather) {
      return JSON.parse(cachedWeather);
    } else {
      return null;
    }
  } catch (error) {
    throw new Error('Error retrieving weather data from Redis', { cause: 500 });
  }
};
