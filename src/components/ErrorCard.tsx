import { AlertCircle } from 'lucide-react';

interface ErrorCardProps {
  message: string;
}

export function ErrorCard({ message }: ErrorCardProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="bg-red-50 rounded-2xl shadow-xl p-8 border-2 border-red-200">
        <div className="flex items-center gap-4">
          <div className="bg-red-100 p-3 rounded-full">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-red-800">Error</h3>
            <p className="text-red-600 mt-1">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
