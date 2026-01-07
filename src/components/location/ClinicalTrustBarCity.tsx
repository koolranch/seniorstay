'use client';

import React from 'react';
import { Hospital, Shield, MapPin, Phone, Clock } from 'lucide-react';
import { getCityHospitals, HospitalData } from '@/lib/hospital-proximity';

interface ClinicalTrustBarCityProps {
  cityName: string;
  citySlug: string;
  variant?: 'full' | 'compact';
}

/**
 * ClinicalTrustBarCity - Dynamic hospital trust bar based on city
 * Displays "Serving families near [Nearest Local Hospital]"
 * Builds E-E-A-T trust signals for GEO optimization
 */
const ClinicalTrustBarCity: React.FC<ClinicalTrustBarCityProps> = ({
  cityName,
  citySlug,
  variant = 'full',
}) => {
  // Get hospitals for this city
  const cityHospitals = getCityHospitals(citySlug);
  const primaryHospital = cityHospitals[0];
  
  // Get medical system colors
  const getSystemColor = (system: string): string => {
    const colors: Record<string, string> = {
      'Cleveland Clinic': 'bg-green-600',
      'University Hospitals': 'bg-blue-600',
      'MetroHealth': 'bg-purple-600',
      'Southwest General': 'bg-orange-600',
    };
    return colors[system] || 'bg-slate-600';
  };
  
  const systemColor = primaryHospital ? getSystemColor(primaryHospital.medicalSystem) : 'bg-slate-600';

  if (variant === 'compact') {
    return (
      <div className={`${systemColor} py-3 text-white`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <Hospital className="h-4 w-4" />
            <span>
              Serving families near {primaryHospital?.name || 'Cleveland Clinic'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${systemColor} py-4 text-white shadow-lg`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {/* Primary Message */}
          <div className="flex items-center gap-2 font-semibold">
            <Hospital className="h-5 w-5" />
            <span>Serving {cityName} Families Near {primaryHospital?.name || 'Cleveland Healthcare'}</span>
          </div>
          
          {/* Trust Badges */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-1.5 opacity-90">
              <Shield className="h-4 w-4" />
              <span>{primaryHospital?.medicalSystem || 'Cleveland'} Network</span>
            </div>
            <div className="flex items-center gap-1.5 opacity-90">
              <Clock className="h-4 w-4" />
              <span>24/7 Emergency Access</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 opacity-90">
              <Phone className="h-4 w-4" />
              <a href="tel:+12166774630" className="hover:underline">(216) 677-4630</a>
            </div>
          </div>
        </div>
        
        {/* Hospital List - Desktop only */}
        {cityHospitals.length > 1 && (
          <div className="hidden lg:flex items-center justify-center gap-6 mt-3 pt-3 border-t border-white/20 text-sm opacity-80">
            <span className="font-medium">Also near:</span>
            {cityHospitals.slice(1, 4).map((hospital, index) => (
              <span key={index} className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {hospital.shortName}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClinicalTrustBarCity;

