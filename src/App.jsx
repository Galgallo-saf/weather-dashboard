import { useState, useEffect } from 'react';
import { Cloud, Sun, Moon, RefreshCw, MapPin, Wind, Droplets, Gauge, Eye } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { WeatherCard } from './components/WeatherCard';
import { ForecastCard } from './components/ForecastCard';
import { ErrorMessage } from './components/ErrorMessage';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useWeather } from './hooks/useWeather';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [unit, setUnit] = useState('celsius');
  const [darkMode, setDarkMode] = useState(false);
  const [recentSearches, setRecentSearches] = useLocalStorage('weatherRecentSearches', []);
  
  const { 
    weather, 
    forecast, 
    loading, 
    error, 
    currentCity,
    searchCity, 
    refreshWeather, 
    getWeatherByLocation,
    setError 
  } = useWeather();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handle search - WORKS WITH ANY CITY WORLDWIDE
  const handleSearch = async (city) => {
    const result = await searchCity(city);
    if (result.success) {
      setRecentSearches(prev => {
        const updated = [city, ...prev.filter(c => c.toLowerCase() !== city.toLowerCase())].slice(0, 5);
        return updated;
      });
    }
  };

  // Dynamic background based on weather
  const getBackgroundClass = () => {
    if (!weather) return 'from-blue-400 to-purple-600';
    
    const condition = weather.weather[0].main.toLowerCase();
    const isDay = weather.dt > weather.sys.sunrise && weather.dt < weather.sys.sunset;
    
    if (condition.includes('clear') || condition.includes('sun')) {
      return isDay ? 'from-blue-400 to-blue-600' : 'from-indigo-900 to-purple-900';
    } else if (condition.includes('cloud')) {
      return 'from-gray-400 to-gray-600';
    } else if (condition.includes('rain') || condition.includes('drizzle')) {
      return 'from-gray-700 to-blue-800';
    } else if (condition.includes('snow')) {
      return 'from-blue-100 to-blue-300';
    } else if (condition.includes('thunder')) {
      return 'from-gray-900 to-purple-900';
    }
    return 'from-blue-400 to-purple-600';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundClass()} transition-all duration-1000`}>
      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <Cloud className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Weather Dashboard</h1>
              <p className="text-white/70 text-sm">Search any city worldwide</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setUnit(unit === 'celsius' ? 'fahrenheit' : 'celsius')}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-white font-semibold transition-all backdrop-blur-md"
            >
              °{unit === 'celsius' ? 'C' : 'F'}
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-xl text-white transition-all backdrop-blur-md"
            >
              {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
          </div>
        </header>

        {/* Search - ANY CITY WORKS HERE */}
        <div className="mb-8">
          <SearchBar 
            onSearch={handleSearch}
            recentSearches={recentSearches}
            onRecentClick={handleSearch}
            loading={loading}
            onGetLocation={getWeatherByLocation}
          />
        </div>

        {/* Error Message */}
        {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

        {/* Loading */}
        {loading && !weather && <LoadingSpinner />}

        {/* Weather Content */}
        {weather && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
            <div className="lg:col-span-2 space-y-6">
              <WeatherCard 
                data={weather} 
                unit={unit} 
                onRefresh={refreshWeather}
                refreshing={loading}
              />

              {/* Extra Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass rounded-2xl p-4 text-white text-center">
                  <Eye className="w-6 h-6 mx-auto mb-2 text-blue-300" />
                  <p className="text-white/60 text-sm">Visibility</p>
                  <p className="text-xl font-bold">{(weather.visibility / 1000).toFixed(1)} km</p>
                </div>
                <div className="glass rounded-2xl p-4 text-white text-center">
                  <Droplets className="w-6 h-6 mx-auto mb-2 text-blue-300" />
                  <p className="text-white/60 text-sm">Humidity</p>
                  <p className="text-xl font-bold">{weather.main.humidity}%</p>
                </div>
                <div className="glass rounded-2xl p-4 text-white text-center">
                  <Wind className="w-6 h-6 mx-auto mb-2 text-blue-300" />
                  <p className="text-white/60 text-sm">Wind</p>
                  <p className="text-xl font-bold">{Math.round(weather.wind.speed)} m/s</p>
                </div>
                <div className="glass rounded-2xl p-4 text-white text-center">
                  <Gauge className="w-6 h-6 mx-auto mb-2 text-blue-300" />
                  <p className="text-white/60 text-sm">Pressure</p>
                  <p className="text-xl font-bold">{weather.main.pressure} hPa</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <ForecastCard forecast={forecast} unit={unit} />
            </div>
          </div>
        )}

        {/* Empty State */}
        {!weather && !loading && !error && (
          <div className="flex-grow flex items-center justify-center">
            <div className="text-center text-white">
              <Cloud className="w-32 h-32 mx-auto mb-6 text-white/80" />
              <h2 className="text-3xl font-bold mb-2">Global Weather Search</h2>
              <p className="text-white/70 text-lg mb-8">Type any city name above and press Enter</p>
              
              <p className="text-white/50 text-sm mb-4">Try these or any other city:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['London', 'Tokyo', 'New York', 'Paris', 'Sydney', 'Dubai', 'Mumbai', 'Cairo', 'Rio', 'Moscow'].map(city => (
                  <button
                    key={city}
                    onClick={() => handleSearch(city)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm transition-all backdrop-blur-md border border-white/20"
                  >
                    {city}
                  </button>
                ))}
              </div>
              
              <button
                onClick={getWeatherByLocation}
                className="mt-6 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-all backdrop-blur-md border border-white/20 flex items-center gap-2 mx-auto"
              >
                <MapPin className="w-5 h-5" />
                Use My Location
              </button>
            </div>
          </div>
        )}

        <footer className="mt-8 text-center text-white/50 text-sm">
          <p>Powered by OpenWeatherMap • Global Coverage • 200,000+ Cities</p>
        </footer>
      </div>
    </div>
  );
}

export default App;