import axios from 'axios';
import { WEATHER_KEY } from '../../config/appConfig.config.js';

const fetchCoordinatesAPI = async (cityName) => {
  const url = 'http://api.openweathermap.org/geo/1.0/direct';
  const params = {
    q: cityName,
    appid: WEATHER_KEY,
  };

  try {
    const response = await axios.get(url, { params });

    if (response.status !== 200) {
      throw new Error(
        `Failed to fetch coordinates (Status: ${response.status})`,
        {
          cause: response.status,
        },
      );
    }

    const { data } = response;

    if (!data || data.length === 0) {
      throw new Error(`No results found for the specified city: ${cityName}`, {
        cause: 404,
      });
    }

    const result = data[0];
    const latitude = result.lat;
    const longitude = result.lon;
    const city = result.name || 'Unknown City';

    if (!latitude || !longitude) {
      throw new Error('Incomplete coordinate data received from the API', {
        cause: 500,
      });
    }

    return {
      cityName: city,
      latitude,
      longitude,
    };
  } catch (error) {
    throw new Error(error.message || 'Error fetching coordinates', {
      cause: error.cause || 500,
    });
  }
};

export default fetchCoordinatesAPI;
