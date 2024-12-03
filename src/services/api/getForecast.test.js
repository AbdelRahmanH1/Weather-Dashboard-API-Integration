import { expect, jest } from '@jest/globals';
import mockAxios from 'jest-mock-axios';
import fetchForecastAPI from './getForecast.service.js';

jest.mock('axios');

describe('fetchForecastAPI', () => {
  test('should return a 5-day forecast for valid coordinates', async () => {
    const mockData = {
      list: [
        {
          dt_txt: '2024-12-04 12:00:00',
          main: { temp: 280 },
          weather: [{ description: 'Clear' }],
        },
        {
          dt_txt: '2024-12-05 12:00:00',
          main: { temp: 275 },
          weather: [{ description: 'Cloudy' }],
        },
        {
          dt_txt: '2024-12-06 12:00:00',
          main: { temp: 268 },
          weather: [{ description: 'Rainy' }],
        },
        {
          dt_txt: '2024-12-07 12:00:00',
          main: { temp: 272 },
          weather: [{ description: 'Partly Cloudy' }],
        },
        {
          dt_txt: '2024-12-08 12:00:00',
          main: { temp: 285 },
          weather: [{ description: 'Sunny' }],
        },
      ],
    };

    mockAxios.get.mockResolvedValueOnce({ data: mockData });

    const response = await fetchForecastAPI(51.505, -0.09);

    expect(response).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          date: expect.any(String),
          avgTemp: expect.any(Number),
          description: expect.any(String),
        }),
        expect.objectContaining({
          date: expect.any(String),
          avgTemp: expect.any(Number),
          description: expect.any(String),
        }),
      ]),
    );
  });

  test('should throw error for non-200 status code', async () => {
    mockAxios.get.mockRejectedValueOnce({
      status: 404,
      statusText: 'Not Found',
    });

    await expect(fetchForecastAPI(100, 100)).rejects.toThrowError(
      'Request failed with status code 400',
    );
  });
});
