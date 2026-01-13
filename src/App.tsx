import { useState } from 'react';
import { CloudSun } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { WeatherCard } from './components/WeatherCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorCard } from './components/ErrorCard';
import { HistoryTable } from './components/HistoryTable';

interface WeatherData {
  city_name: string;
  country: string;
  description: string;
  temperature: number;
  humidity: number;
  timezone: number;
}

interface HistoryRecord {
  id: string;
  city_name: string;
  country: string;
  temperature: number;
  humidity: number;
  created_at: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [timestamp, setTimestamp] = useState<string>('');
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (city: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/weather?city=${encodeURIComponent(city)}`);
      const result = await response.json();

      // console.log("result >>>>>>", result)

      // console.log("result >>>>>>", result.weather)

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch weather data');
      }

      setWeather(result.weather);
      setTimestamp(result.weather.created_at);

      fetchHistory(result.weather.city_name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async (city: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/history?city=${encodeURIComponent(city)}`);
      const result = await response.json();

      console.log("result >>>>>>", result.history)

      if (response.ok) {
        setHistory(result.history);
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-3">
            <CloudSun className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Weather Finder
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <SearchBar onSearch={fetchWeather} loading={loading} />

        {loading && <LoadingSpinner />}

        {error && !loading && <ErrorCard message={error} />}

        {weather && !loading && !error && (
          <>
            <WeatherCard weather={weather} timestamp={timestamp} />
             <HistoryTable history={history} /> 
          </>
        )}

        {!weather && !loading && !error && (
          <div className="w-full max-w-4xl mx-auto mt-16 text-center">
            <CloudSun className="w-24 h-24 text-blue-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Search for a city to get started
            </h2>
            <p className="text-gray-500">
              Enter any city name to see current weather conditions
            </p>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600">
          <p>Weather data provided by OpenWeatherMap</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
