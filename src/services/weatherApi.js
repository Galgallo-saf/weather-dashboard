import axios from 'axios';

const API_KEY = 'efa467e0bfa50a27819f3914318fea49';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const weatherClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

const handleApiError = (error) => {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        return 'Invalid API key. Please check your OpenWeatherMap API key.';
      case 404:
        return 'City not found. Please check the spelling or try adding country code (e.g., "Paris,FR").';
      case 429:
        return 'Too many requests. Please wait a moment.';
      default:
        return `Error: ${error.response.data?.message || 'Something went wrong'}`;
    }
  } else if (error.request) {
    return 'Network error. Check your internet connection.';
  }
  return 'An unexpected error occurred.';
};

// SEARCH ANY CITY WORLDWIDE
export const fetchWeatherData = async (city) => {
  try {
    const response = await weatherClient.get('/weather', {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const fetchForecastData = async (city) => {
  try {
    const response = await weatherClient.get('/forecast', {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Get weather by GPS coordinates
export const fetchWeatherByCoords = async (lat, lon) => {
  try {
    const response = await weatherClient.get('/weather', {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};