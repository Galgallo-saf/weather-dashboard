import { RefreshCw, Navigation, Droplets, Wind, Gauge, Sunrise, Sunset } from 'lucide-react';
import { WeatherIcon } from './WeatherIcon';

export const WeatherCard = ({ data, unit, onRefresh, refreshing }) => {
  if (!data) return null;

  const convertTemp = (temp) => {
    if (unit === 'fahrenheit') {
      return (temp * 9/5) + 32;
    }
    return temp;
  };

  const convertSpeed = (speed) => {
    if (unit === 'fahrenheit') {
      return speed * 2.23694; // m/s to mph
    }
    return speed; // keep as m/s or convert to km/h if needed
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="glass rounded-3xl p-8 text-white shadow-2xl transform transition-all hover:scale-[1.02]">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-4xl font-bold mb-1">{data.name}</h2>
          <p className="text-white/80 text-lg">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <p className="text-white/60 text-sm mt-1">{data.sys.country}</p>
        </div>
        <button 
          onClick={onRefresh}
          disabled={refreshing}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all disabled:opacity-50"
          title="Refresh weather data"
        >
          <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-4">
          <WeatherIcon condition={data.weather[0].main} size="large" />
          <div>
            <div className="text-7xl font-bold tracking-tighter">
              {Math.round(convertTemp(data.main.temp))}°
            </div>
            <div className="text-xl text-white/80 capitalize">
              {data.weather[0].description}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
          <div className="glass rounded-2xl p-4 text-center">
            <Navigation className="w-6 h-6 mx-auto mb-1 text-blue-300" />
            <p className="text-sm text-white/60">Feels Like</p>
            <p className="text-xl font-semibold">
              {Math.round(convertTemp(data.main.feels_like))}°
            </p>
          </div>

          <div className="glass rounded-2xl p-4 text-center">
            <Droplets className="w-6 h-6 mx-auto mb-1 text-blue-300" />
            <p className="text-sm text-white/60">Humidity</p>
            <p className="text-xl font-semibold">{data.main.humidity}%</p>
          </div>

          <div className="glass rounded-2xl p-4 text-center">
            <Wind className="w-6 h-6 mx-auto mb-1 text-blue-300" />
            <p className="text-sm text-white/60">Wind Speed</p>
            <p className="text-xl font-semibold">
              {Math.round(convertSpeed(data.wind.speed))} {unit === 'celsius' ? 'm/s' : 'mph'}
            </p>
          </div>

          <div className="glass rounded-2xl p-4 text-center">
            <Gauge className="w-6 h-6 mx-auto mb-1 text-blue-300" />
            <p className="text-sm text-white/60">Pressure</p>
            <p className="text-xl font-semibold">{data.main.pressure} hPa</p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-white/20 flex justify-between items-center text-sm text-white/60">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Sunrise className="w-4 h-4" />
            Sunrise: {formatTime(data.sys.sunrise)}
          </span>
          <span className="flex items-center gap-1">
            <Sunset className="w-4 h-4" />
            Sunset: {formatTime(data.sys.sunset)}
          </span>
        </div>
        <span>Updated: {new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
};