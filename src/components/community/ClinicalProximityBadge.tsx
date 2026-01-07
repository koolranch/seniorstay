'use client';

import React from 'react';
import { Hospital, MapPin, Shield, Clock } from 'lucide-react';
import { findNearestHospital, CLEVELAND_HOSPITALS, type HospitalData } from '@/lib/hospital-proximity';

interface ClinicalProximityBadgeProps {
  communityName: string;
  coordinates?: { lat: number; lng: number };
  citySlug?: string;
  variant?: 'inline' | 'card' | 'banner';
}

/**
 * ClinicalProximityBadge - Dynamic hospital distance display for E-E-A-T
 * Shows the nearest major hospital and distance to build clinical trust
 */
const ClinicalProximityBadge: React.FC<ClinicalProximityBadgeProps> = ({
  communityName,
  coordinates,
  citySlug,
  variant = 'card'
}) => {
  // Find nearest hospital based on coordinates or city
  let nearestHospitalData: { hospital: HospitalData; distance: number } | null = null;
  
  if (coordinates) {
    nearestHospitalData = findNearestHospital(coordinates.lat, coordinates.lng, 'major_system');
  }
  
  // Fallback to city-based hospital if no coordinates
  if (!nearestHospitalData && citySlug) {
    const cityHospitalMap: Record<string, string> = {
      'westlake': 'St. John Medical Center',
      'beachwood': 'University Hospitals Ahuja Medical Center',
      'shaker-heights': 'University Hospitals Cleveland Medical Center',
      'cleveland': 'Cleveland Clinic Main Campus',
      'parma': 'Southwest General Health Center',
      'lakewood': 'Cleveland Clinic Fairview Hospital',
      'rocky-river': 'Cleveland Clinic Fairview Hospital',
      'strongsville': 'Southwest General Health Center',
      'solon': 'University Hospitals Ahuja Medical Center',
    };
    
    const hospitalName = cityHospitalMap[citySlug] || 'Cleveland Clinic';
    const hospital = CLEVELAND_HOSPITALS.find(h => h.name === hospitalName);
    
    if (hospital) {
      nearestHospitalData = { hospital, distance: 5.0 }; // Default distance estimate
    }
  }
  
  if (!nearestHospitalData) {
    return null;
  }
  
  const { hospital, distance } = nearestHospitalData;
  
  // Get medical system color
  const systemColors: Record<string, string> = {
    'Cleveland Clinic': 'bg-green-50 border-green-200 text-green-800',
    'University Hospitals': 'bg-blue-50 border-blue-200 text-blue-800',
    'MetroHealth': 'bg-purple-50 border-purple-200 text-purple-800',
    'Southwest General': 'bg-orange-50 border-orange-200 text-orange-800',
    'Other': 'bg-gray-50 border-gray-200 text-gray-800',
  };
  
  const colorClass = systemColors[hospital.medicalSystem] || systemColors['Other'];
  
  if (variant === 'inline') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${colorClass} border`}>
        <Hospital className="h-4 w-4" />
        <span>{distance} mi to {hospital.shortName}</span>
      </span>
    );
  }
  
  if (variant === 'banner') {
    return (
      <div className={`${colorClass} border-y py-3 px-4`}>
        <div className="container mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Hospital className="h-5 w-5" />
            <span className="font-semibold">{hospital.medicalSystem} Network</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{distance} miles to {hospital.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>~{Math.round(distance * 2.5)} min drive</span>
          </div>
        </div>
      </div>
    );
  }
  
  // Default: card variant
  return (
    <div className={`${colorClass} border rounded-xl p-4 shadow-sm`}>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-white/60 rounded-lg">
          <Hospital className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-base mb-1">Clinical Proximity</h4>
          <p className="text-sm opacity-90 mb-2">
            {communityName} is located <strong>{distance} miles</strong> from {hospital.name}
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="flex items-center gap-1 bg-white/50 px-2 py-1 rounded-full">
              <Shield className="h-3 w-3" />
              {hospital.medicalSystem} Network
            </span>
            <span className="flex items-center gap-1 bg-white/50 px-2 py-1 rounded-full">
              <Clock className="h-3 w-3" />
              ~{Math.round(distance * 2.5)} min drive
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalProximityBadge;

