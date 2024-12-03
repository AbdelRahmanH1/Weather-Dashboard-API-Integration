import { expect, jest } from '@jest/globals';
import mockAxios from 'jest-mock-axios';
import getCurrentWeatherAPI from './getWeather.service.js';

jest.mock('axios');

describe('getCurrentWeatherAPI', () => {
  test('should return weather data for valid coordinates', async () => {
    const mockData = {
      name: 'London',
      main: {
        temp: 273.15,
        humidity: 60,
      },
      weather: [{ description: 'Light rain' }],
      wind: { speed: 3.1 },
    };

    mockAxios.get.mockResolvedValueOnce({ data: mockData });

    const response = await getCurrentWeatherAPI(51.505, -0.09);

    expect(response).toEqual({
      cityName: expect.any(String),
      temperature: expect.any(Number),
      weatherDescription: expect.any(String),
      humidity: expect.any(Number),
      windSpeed: expect.any(Number),
    });
  });

  test('should throw error for non-200 status code', async () => {
    mockAxios.get.mockRejectedValueOnce({
      status: 404,
      statusText: 'Not Found',
    });

    await expect(getCurrentWeatherAPI(100, 100)).rejects.toThrowError(
      'Request failed with status code 400',
    );
  });
});
