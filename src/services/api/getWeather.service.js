import axios from 'axios';
import { WEATHER_KEY } from '../../config/appConfig.config.js';

export const getCurrentWeatherAPI = async (lat, lng) => {
  const url = 'https://api.openweathermap.org/data/2.5/weather';

  const params = {
    lat,
    lon: lng,
    appid: WEATHER_KEY,
  };

  try {
    const response = await axios.get(url, { params });

    if (response.status !== 200) {
      throw new Error(
        `Failed to fetch weather data (Status: ${response.status})`,
        {
          cause: response.status,
        },
      );
    }

    const { data } = response;

    if (!data) {
      throw new Error('Data not found', { cause: response.status });
    }

    const cityName = data.name || 'Unknown City';
    const temperature = data.main.temp || 'N/A';
    const humidity = data.main.humidity || 'N/A';
    const weatherArray = data.weather;
    const windSpeed = data.wind.speed || 'N/A';

    const weatherDescription =
      weatherArray.length > 0 && weatherArray[0].description
        ? weatherArray[0].description
        : 'No description available';

    return {
      cityName,
      temperature,
      weatherDescription,
      humidity,
      windSpeed,
    };
  } catch (error) {
    throw new Error(error.message || 'Error fetching current weather', {
      cause: error.cause || 500,
    });
  }
};
export default getCurrentWeatherAPI;
