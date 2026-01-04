'use client';

import React from 'react';
import { MapPin, Hospital, ShoppingCart, Trees, Pill, UtensilsCrossed } from 'lucide-react';
import { getNeighborhoodData, NearbyPlace } from '@/data/neighborhood-data';

interface NeighborhoodSectionProps {
  communityName: string;
  location: string;
}

const placeIcons: Record<string, React.ElementType> = {
  hospital: Hospital,
  grocery: ShoppingCart,
  park: Trees,
  pharmacy: Pill,
  restaurant: UtensilsCrossed,
};

export default function NeighborhoodSection({ communityName, location }: NeighborhoodSectionProps) {
  const neighborhoodData = getNeighborhoodData(location);
  
  if (!neighborhoodData) {
    return null;
  }

  const { nearestHospital, nearbyPlaces, localDescription } = neighborhoodData;
  const cityName = location.split(',')[0].trim();

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-gray-900">Neighborhood & Location</h2>
      </div>

      {/* Local Description */}
      <p className="text-gray-700 mb-6 leading-relaxed">
        {localDescription}
      </p>

      {/* Hospital Highlight */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Hospital className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              Conveniently located just {nearestHospital.distance} from {nearestHospital.name}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {nearestHospital.address}
            </p>
            {nearestHospital.phone && (
              <a 
                href={`tel:${nearestHospital.phone.replace(/[^0-9]/g, '')}`}
                className="text-sm text-primary hover:underline mt-1 inline-block"
              >
                {nearestHospital.phone}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Nearby Places Grid */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Nearby Conveniences</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {nearbyPlaces.slice(0, 4).map((place, index) => {
            const Icon = placeIcons[place.type] || MapPin;
            return (
              <div 
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <Icon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-medium text-gray-800 truncate">{place.name}</p>
                  <p className="text-xs text-gray-500">{place.distance}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Schema.org LocalBusiness markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Place",
            "name": `${communityName} Neighborhood`,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": cityName,
              "addressRegion": "OH",
              "addressCountry": "US"
            },
            "geo": {
              "@type": "GeoCoordinates"
            },
            "amenityFeature": nearbyPlaces.map(place => ({
              "@type": "LocationFeatureSpecification",
              "name": place.name,
              "value": place.distance
            }))
          })
        }}
      />
    </section>
  );
}



