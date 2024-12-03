import asyncHandler from '../utils/asyncHandler.util.js';
import fetchCoordinatesAPI from '../services/api/getCoordinates.service.js';
import successResponse from '../utils/successResponse.util.js';
import formatCityName from '../utils/formatName.util.js';
import {
  getCurrentWeatherInRedis,
  setCurrentWeatherInRedis,
} from '../services/redis/currWeatherRedis.service.js';

import fetchWeatherFromAPI from '../services/api/getWeather.service.js';
import {
  getCoordinatesFromRedis,
  setCoordinatesInRedis,
} from '../services/redis/coordinatesRedis.service.js';
import {
  getForecastFromRedis,
  setForecastToRedis,
} from '../services/redis/forecastRedis.service.js';
import fetchForecastAPI from '../services/api/getForecast.service.js';

export const getCurrentWeather = asyncHandler(async (req, res, next) => {
  const { cityname } = req.query;

  // step 1: start to format the city name
  const formattedInputCityName = formatCityName(cityname);

  // step2: Check if the weather in redis or not
  let weatherData = await getCurrentWeatherInRedis(formattedInputCityName);
  if (weatherData) {
    return successResponse(res, {
      status: 200,
      message: 'Weather data retrieved ',
      data: { weatherData },
    });
  }

  // Step3: if no current Weather from Redis check the corrdination

  let cityCoordinates = await getCoordinatesFromRedis(formattedInputCityName);
  if (cityCoordinates) {
    weatherData = await fetchWeatherFromAPI(
      cityCoordinates.latitude,
      cityCoordinates.longitude,
    );
    // Cache the weather in Redis
    const formatName = formatCityName(weatherData.cityName);
    await setCurrentWeatherInRedis(formatName, weatherData);
    return successResponse(res, {
      status: 200,
      message: 'Weather data retrieved',
      data: { weatherData },
    });
  }

  //step4: if no corrdination and  current Weather from redis start to get the corrdination and current Weather from External API
  const coordinatesFromApi = await fetchCoordinatesAPI(cityname);

  if (coordinatesFromApi) {
    const formatedName = formatCityName(coordinatesFromApi.cityName);

    //save corrdination in redis
    await setCoordinatesInRedis(
      formatedName,
      coordinatesFromApi.latitude,
      coordinatesFromApi.longitude,
    );

    const currentWeather = await fetchWeatherFromAPI(
      coordinatesFromApi.latitude,
      coordinatesFromApi.longitude,
    );

    await setCurrentWeatherInRedis(formatedName, currentWeather);
    return successResponse(res, {
      status: 200,
      message: 'Weather data retrieved',
      data: { currentWeather },
    });
  }
});

export const getForecastWeather = asyncHandler(async (req, res, next) => {
  const { cityname } = req.query;

  //step 1: start to format the city name
  const formattedInputCityName = formatCityName(cityname);

  // step2: Check if the forecast in redis or not
  let forecastData = await getForecastFromRedis(formattedInputCityName);

  if (forecastData.length > 0) {
    return successResponse(res, {
      status: 200,
      message: 'Forecast data retrieved',
      data: { forecastData },
    });
  }

  // step3: If the forecast data found in redis check the coordination in redis
  let cityCoordinates = await getCoordinatesFromRedis(formattedInputCityName);

  if (cityCoordinates) {
    forecastData = await fetchForecastAPI(
      cityCoordinates.latitude,
      cityCoordinates.longitude,
    );

    await setForecastToRedis(formattedInputCityName, forecastData);
    return successResponse(res, {
      status: 200,
      message: 'Forecast data retrieved',
      data: { forecastData },
    });
  }

  //step4: if no corrdination and  forecast  from redis start to get the corrdination and current Weather from External API
  const coordinatesFromApi = await fetchCoordinatesAPI(cityname);
  if (coordinatesFromApi) {
    const formatedName = formatCityName(coordinatesFromApi.cityName);
    await setCoordinatesInRedis(
      formatedName,
      coordinatesFromApi.latitude,
      coordinatesFromApi.longitude,
    );
    const forecast = await fetchForecastAPI(
      coordinatesFromApi.latitude,
      coordinatesFromApi.longitude,
    );

    await setForecastToRedis(formatedName, forecast);
    return successResponse(res, {
      status: 200,
      message: 'Forecast data retrieved',
      data: { forecast },
    });
  }
});
