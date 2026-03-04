import { Calendar } from 'lucide-react';
import { WeatherIcon } from './WeatherIcon';

export const ForecastCard = ({ forecast, unit }) => {
  if (!forecast || !forecast.list) return null;

  // Group by day (API returns 3-hour intervals, we want daily)
  const dailyData = forecast.list.reduce((acc, item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  const convertTemp = (temp) => {
    if (unit === 'fahrenheit') {
      return (temp * 9/5) + 32;
    }
    return temp;
  };

  // Get next 7 days (changed from 5 to 7)
  const days = Object.keys(dailyData).slice(0, 7);

  return (
    <div className="glass rounded-3xl p-6 text-white shadow-xl">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5" />
        7-Day Forecast
      </h3>
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        {days.map((day, index) => {
          const dayData = dailyData[day];
          const maxTemp = Math.max(...dayData.map(item => item.main.temp_max));
          const minTemp = Math.min(...dayData.map(item => item.main.temp_min));
          const mainWeather = dayData[Math.floor(dayData.length / 2)].weather[0];

          return (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3 w-1/3">
                <span className="font-medium text-sm">
                  {index === 0 ? 'Today' : new Date(day).toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
              </div>
              <div className="flex items-center justify-center w-1/3">
                <WeatherIcon condition={mainWeather.main} size="small" />
              </div>
              <div className="flex items-center justify-end gap-2 w-1/3 text-sm">
                <span className="font-bold">{Math.round(convertTemp(maxTemp))}°</span>
                <span className="text-white/50">{Math.round(convertTemp(minTemp))}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};