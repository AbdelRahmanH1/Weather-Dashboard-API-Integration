import axios from 'axios';
import { WEATHER_KEY } from '../../config/appConfig.config.js';

const fetchForecastAPI = async (lat, lng) => {
  const url = 'https://api.openweathermap.org/data/2.5/forecast';
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
    const forecast = [];
    for (let i = 0; i < 5; i++) {
      const dayData = data.list[i];

      forecast.push({
        date: dayData.dt_txt.split(' ')[0],
        avgTemp: dayData.main.temp,
        description: dayData.weather[0].description,
      });
    }

    return forecast;
  } catch (error) {
    throw new Error(error.message || 'Error fetching current weather', {
      cause: error.cause || 500,
    });
  }
};

export default fetchForecastAPI;
