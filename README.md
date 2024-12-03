# Weather Dashboard API

## Overview

The Weather Dashboard API is a backend service built with Express.js that integrates with the OpenWeatherMap API to provide weather information for a specified city. It includes caching, validation, rate-limiting, and testing features.

## Features

1. **Current Weather Data**: Fetch the current weather for a given city, including temperature, weather description, humidity, and wind speed.
2. **5-Day Weather Forecast**: Retrieve summarized daily forecasts, including Date, temperature and weather descriptions.
3. **Caching with Redis**: Reduces API calls for repeated requests to improve performance.
4. **Rate Limiting**: Protects the API from abuse by limiting the number of requests per client using Redis.
5. **Validation**: Ensures proper query parameters are provided using Joi.
6. **Unit Testing**: External API calls are tested using Jest and mock integrations.

## Tech Stack

- **Backend Framework**: Express.js
- **Caching**: Redis
- **Validation**: Joi
- **HTTP Client**: Axios
- **Testing**: Jest, jest-mock-axios
- **CORS**: Enabled for cross-origin requests.

## Setup Instructions

### Prerequisites

- Node.js (version 20+ recommended)
- Redis (Ensure it’s installed and running)
- An API key from [OpenWeatherMap](https://openweathermap.org/api)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AbdelRahmanH1/Weather-Dashboard-API-Integration.git
   cd Weather-Dashboard-API-Integration
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Set up the **.env** file: Create a **.env** file in the root directory with the following keys:

   ```bash
   PORT=4000  # Application port
   REDIS_HOST=localhost
   REDIS_PORT=6379
   RATE_LIMITER_LIMIT=3  # Maximum number of requests allowed per window
   RATE_LIMITER_WINDOW=60 # Time window in seconds
   WEATHER_KEY=<yourAPIKEY>
   ```

4. Start the application:
   ```bash
   npm start
   ```

## API ENDPOINTS

1. Get Current Weather by City

- Endpoint: **v1/weather**
- Method: **GET**
- Query Parameters: **cityname** (string) - Name of the city.
- Response:

```bash
  {
  "success": true,
  "message": "Weather data retrieved",
  "data": {
      "weatherData": {
          "cityName": "New York",
          "temperature": 277.29,
          "weatherDescription": "scattered clouds",
          "humidity": 59,
          "windSpeed": 4.63
      }
    }
  }

```

2. Get 5-Day Weather Forecast

- Endpoint: **v1/weather/forecast**
- Method: **GET**
- Query Parameters: **cityname** (string) - Name of the city.
- Response:

```bash
 {
  "success": true,
  "message": "Forecast data retrieved",
  "data": {
      "forecastData": [
          {
              "date": "2024-12-03",
              "avgTemp": 274.01,
              "description": "broken clouds"
          },
          {
              "date": "2024-12-03",
              "avgTemp": 274.01,
              "description": "broken clouds"
          },
          {
              "date": "2024-12-03",
              "avgTemp": 274.01,
              "description": "broken clouds"
          },
          {
              "date": "2024-12-03",
              "avgTemp": 274.01,
              "description": "broken clouds"
          },
          {
              "date": "2024-12-03",
              "avgTemp": 274.01,
              "description": "broken clouds"
          }
      ]
  }
}
```

## Validation

- City Query: Joi ensures the **cityname** parameter is a non-empty string.

## Rate Limiting

- Limits each client to **RATE_LIMITER_MAX** requests within the **RATE_LIMITER_WINDOW** seconds.
- Configurable via **.env**

## Caching

The API leverages Redis to cache data at multiple levels to reduce redundant API calls and improve performance. Below are the caching strategies used:

1. Coordinates Caching:

- When retrieving weather data for a city, the API first fetches the city’s latitude and longitude.
- These coordinates are cached for 7 days to avoid redundant lookups for the same city.

2. Current Weather Caching:

- After obtaining the weather data for a city, the current weather information is cached for 1 hour
- This reduces the number of requests made to the external weather API for frequently queried cities

3. 5-Day Forecast Caching:

- Forecast data for the next 5 days is cached for 6 hours, ensuring the most recent forecast while minimizing API calls.

### Benefits of Caching

- **Performance** Optimization: Reduces response times by serving data directly from the cache
- **Reduced API** Usage: Decreases dependency on external API calls, staying within rate limits and lowering costs.
- **Flexibility**: Separate expiration times for each type of cached data ensure that frequently accessed but rarely changed data remains fresh.

## Testing

- Unit tests for external API calls are implemented using Jest and jest-mock-axios.

```bash
   npm test
```

## Error Handling

All API errors are handled uniformly to provide a consistent response format.

### Error Response Structure

In case of an error, the API returns a JSON response with the following structure:

    ```bash
        {
            "success": false,
            "message": "Error description"
        }
    ```

### Types of Errors Handled

1. Validation Errors:

  - Occur when required query parameters or inputs are missing or invalid.
  - Example:

  ```bash
  {
  "success": false,
  "message": "\"city\" is required"
  }
  ```

2. External API Errors:

  - Handled when the weather API fails, returns an invalid response, or the requested city is not found.
  - Example:

  ```bash
  {
  "success": false,
  "message": "City not found"
  }
  ```

3. Rate Limiting Errors:

  - Triggered when a client exceeds the number of allowed requests within the specified time window.
  - Example:

  ```bash
  {
  "success": false,
  "message": "Too many requests. Please try again later."
  }
  ```

4. Server Errors:

  - For unexpected issues such as Redis connection failures or internal server errors.
  - Example:

  ```bash
  {
  "success": false,
  "message": "Internal Server Error"
  }
  ```

### Consistency in Responses

Every error, regardless of type, ensures the **success** field is **false**, and the **message** field provides a human-readable explanation of the issue.
