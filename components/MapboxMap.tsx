"use client"

interface MapboxMapProps {
  className?: string
}

export default function MapboxMap({ className = "" }: MapboxMapProps) {
  // Placeholder for actual Mapbox implementation
  // Assume Mapbox GL JS is already configured with access token

  return (
    <div className={`flex-1 bg-gray-100 relative ${className}`}>
      {/* Placeholder for Mapbox map */}
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">🗺️</div>
          <h2 className="text-2xl font-semibold mb-2">Mapbox Map</h2>
          <p className="text-sm">Map component will be rendered here</p>
          <p className="text-xs mt-2 text-gray-400">
            Assumes Mapbox GL JS is configured with access token
          </p>
        </div>
      </div>

      {/* This is where you would initialize Mapbox */}
      {/* 
      <div 
        ref={mapContainer} 
        className="w-full h-full"
        id="mapbox-map"
      />
      */}
    </div>
  )
}
