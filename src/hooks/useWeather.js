import { useState, useEffect, useCallback } from 'react';
import { fetchWeatherData, fetchForecastData, fetchWeatherByCoords } from '../services/weatherApi';

export const useWeather = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentCity, setCurrentCity] = useState(null);

  const searchCity = useCallback(async (city) => {
    setLoading(true);
    setError(null);
    
    try {
      const [weatherData, forecastData] = await Promise.all([
        fetchWeatherData(city),
        fetchForecastData(city)
      ]);
      
      setWeather(weatherData);
      setForecast(forecastData);
      setCurrentCity(city);
      return { success: true };
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setForecast(null);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshWeather = useCallback(async () => {
    if (!currentCity) return;
    
    setLoading(true);
    try {
      const [weatherData, forecastData] = await Promise.all([
        fetchWeatherData(currentCity),
        fetchForecastData(currentCity)
      ]);
      setWeather(weatherData);
      setForecast(forecastData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentCity]);

  // Get weather by geolocation
  const getWeatherByLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const weatherData = await fetchWeatherByCoords(latitude, longitude);
          const forecastData = await fetchForecastData(weatherData.name);
          
          setWeather(weatherData);
          setForecast(forecastData);
          setCurrentCity(weatherData.name);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setLoading(false);
        setError('Unable to retrieve your location. Please enable location permissions.');
      }
    );
  }, []);

  // Auto-refresh every 10 minutes
  useEffect(() => {
    if (!currentCity) return;
    
    const interval = setInterval(() => {
      refreshWeather();
    }, 600000); // 10 minutes
    
    return () => clearInterval(interval);
  }, [currentCity, refreshWeather]);

  return {
    weather,
    forecast,
    loading,
    error,
    currentCity,
    searchCity,
    refreshWeather,
    getWeatherByLocation,
    setError
  };
};