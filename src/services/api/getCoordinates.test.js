import { jest } from '@jest/globals';
import fetchCoordinatesAPI from './getCoordinates.service.js';
import mockAxios from 'jest-mock-axios';

jest.mock('axios');

describe.skip('fetchCoordinatesAPI', () => {
  test('should return coordinates for a valid city', async () => {
    const mockData = {
      data: [
        {
          lat: 51.505,
          lon: -0.09,
          name: 'London',
        },
      ],
    };

    mockAxios.get.mockResolvedValueOnce(mockData);

    const response = await fetchCoordinatesAPI('London');

    expect(response).toEqual(
      expect.objectContaining({
        cityName: 'London',
        latitude: expect.any(Number),
        longitude: expect.any(Number),
      }),
    );
  });

  test('should throw error for non-200 status code', async () => {
    mockAxios.get.mockRejectedValueOnce({
      status: 404,
      statusText: 'Not Found',
    });

    await expect(fetchCoordinatesAPI('InvalidCity')).rejects.toThrowError(
      'No results found for the specified city: InvalidCity',
    );
  });

  test('should throw error for empty response data', async () => {
    mockAxios.get.mockResolvedValueOnce({
      data: [],
    });

    await expect(fetchCoordinatesAPI('EmptyCity')).rejects.toThrowError(
      'No results found for the specified city: EmptyCity',
    );
  });

  test('should throw error for incomplete coordinate data', async () => {
    mockAxios.get.mockResolvedValueOnce({
      data: [{ name: 'Unknown City' }],
    });

    await expect(
      fetchCoordinatesAPI('IncompleteDataCity'),
    ).rejects.toThrowError(
      'No results found for the specified city: IncompleteDataCity',
    );
  });

  test('should handle unexpected errors', async () => {
    const mockError = new Error('Network Error');
    mockAxios.get.mockRejectedValueOnce(mockError);

    await expect(fetchCoordinatesAPI('AnyCity')).rejects.toThrowError(
      'No results found for the specified city: AnyCity',
    );
  });
});
