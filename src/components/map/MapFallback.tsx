import React from 'react';
import { MapPin, AlertCircle } from 'lucide-react';

interface MapFallbackProps {
  height?: string;
  width?: string;
  error?: string;
  onRetry?: () => void;
}

export default function MapFallback({
  height = '450px',
  width = '100%',
  error,
  onRetry
}: MapFallbackProps) {
  return (
    <div
      className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-6 border border-gray-200"
      style={{ height, width }}
    >
      <MapPin size={48} className="text-primary mb-4" />

      {error ? (
        <>
          <AlertCircle className="h-6 w-6 text-red-500 mb-2" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Map unavailable</h3>
          <p className="text-red-500 text-sm mb-4 text-center max-w-md">{error}</p>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Map information</h3>
          <p className="text-gray-600 text-sm mb-4 text-center max-w-md">
            The map is currently unavailable. You can still view all community details below.
          </p>
        </>
      )}

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 text-sm transition-colors"
        >
          Reload Map
        </button>
      )}
    </div>
  );
}
