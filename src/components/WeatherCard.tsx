import { Cloud, Droplets, Globe, Thermometer } from 'lucide-react';

interface WeatherData {
  city_name: string;
  country: string;
  description: string;
  temperature: number;
  humidity: number;
  timezone: number;
}

interface WeatherCardProps {
  weather: WeatherData;
  timestamp: string;
}

export function WeatherCard({ weather, timestamp }: WeatherCardProps) {
  const formatTimezone = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const sign = hours >= 0 ? '+' : '';
    return `UTC${sign}${hours}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-4xl font-bold text-gray-800">
              {weather.city_name}, {weather.country}
            </h2>
            <p className="text-gray-500 mt-1 capitalize flex items-center gap-2">
              <Cloud className="w-5 h-5" />
              {weather.description}
            </p>
          </div>
          <div className="text-right">
            <p className="text-6xl font-bold text-blue-600">
              {Math.round(weather.temperature)}°C
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <Thermometer className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Temperature</p>
              <p className="text-xl font-semibold text-gray-800">
                {weather.temperature.toFixed(1)}°C
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-cyan-50 p-3 rounded-lg">
              <Droplets className="w-6 h-6 text-cyan-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Humidity</p>
              <p className="text-xl font-semibold text-gray-800">
                {weather.humidity}%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-green-50 p-3 rounded-lg">
              <Globe className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Timezone</p>
              <p className="text-xl font-semibold text-gray-800">
                {formatTimezone(weather.timezone)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Last updated: {new Date(timestamp).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
