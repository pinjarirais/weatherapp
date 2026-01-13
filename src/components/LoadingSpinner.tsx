import { Loader2 } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="mt-4 text-gray-600 font-medium">Fetching weather data...</p>
      </div>
    </div>
  );
}
