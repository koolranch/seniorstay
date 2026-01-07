'use client';

import React from 'react';
import { MapPin, Hospital, Shield, Clock } from 'lucide-react';
import { CityInfo } from '@/data/cleveland-cities';

interface LocalAuthorityProseProps {
  cityName: string;
  citySlug: string;
  cityData?: CityInfo;
  communityCount: number;
  isHospitalDischarge?: boolean;
}

/**
 * LocalAuthorityProse - SEO-rich local authority content
 * Establishes local expertise with hospital/landmark mentions
 */
const LocalAuthorityProse: React.FC<LocalAuthorityProseProps> = ({
  cityName,
  citySlug,
  cityData,
  communityCount,
  isHospitalDischarge = false,
}) => {
  const currentYear = new Date().getFullYear();
  const nearestHospital = cityData?.nearbyHospitals?.[0] || 'Cleveland Clinic';
  const secondHospital = cityData?.nearbyHospitals?.[1];
  const costRange = cityData?.averageCost?.assistedLiving || '$3,500 - $6,500';

  // City-specific content variations
  const getAuthorityContent = () => {
    if (citySlug === 'westlake') {
      return {
        intro: `Westlake, Ohio is one of Greater Cleveland's premier destinations for senior living, offering ${communityCount} communities with convenient access to St. John Medical Center and Cleveland Clinic Avon. Families transitioning loved ones from hospital stays benefit from Westlake's network of communities experienced in post-acute care and rehabilitation.`,
        highlight: `For families navigating hospital discharge, Westlake's proximity to major medical centers—combined with communities offering short-term rehabilitation—makes it an ideal choice for post-surgical recovery and ongoing care.`,
      };
    }
    
    if (citySlug === 'beachwood') {
      return {
        intro: `Beachwood stands as Northeast Ohio's premier destination for memory care and specialized dementia services. Located just minutes from UH Ahuja Medical Center's Neurological Institute, the city's ${communityCount} senior living communities offer unmatched access to dementia specialists, clinical trials, and cutting-edge cognitive therapies.`,
        highlight: `The combination of upscale amenities, proximity to Legacy Village shopping, and world-class neurology services makes Beachwood particularly attractive for families seeking memory care near top medical resources.`,
      };
    }
    
    if (citySlug === 'shaker-heights') {
      return {
        intro: `Historic Shaker Heights offers ${communityCount} distinguished senior living communities in one of Cleveland's most prestigious neighborhoods. With RTA Rapid Transit access to Cleveland Clinic and University Hospitals, residents enjoy seamless healthcare connectivity while living amid tree-lined streets and architectural beauty.`,
        highlight: `The Woodlands by Heritage Retirement Communities and StoryPoint Shaker Heights represent the area's commitment to quality care in elegant surroundings with a full continuum of services.`,
      };
    }
    
    if (citySlug === 'rocky-river') {
      return {
        intro: `Rocky River combines lakefront living with exceptional senior care options. This affluent western suburb offers ${communityCount} communities near the Rocky River Reservation Metroparks, Lake Erie shores, and convenient access to Fairview Hospital and St. John Medical Center.`,
        highlight: `Seniors and families seeking a balance of natural beauty, upscale amenities, and quality healthcare find Rocky River's communities—like Bickford of Rocky River and Sunrise Senior Living—ideal for active retirement and assisted living needs.`,
      };
    }
    
    // Default content for other cities
    return {
      intro: `${cityName} offers ${communityCount} senior living communities serving families throughout Greater Cleveland. With convenient access to ${nearestHospital}${secondHospital ? ` and ${secondHospital}` : ''}, residents enjoy both quality care and proximity to world-class healthcare.`,
      highlight: `Our local advisors have personally visited every community in ${cityName}, allowing us to provide detailed, firsthand recommendations based on your specific care needs, budget, and preferences.`,
    };
  };

  const content = getAuthorityContent();

  return (
    <section className="py-12 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-teal-100 p-2 rounded-lg">
              <MapPin className="h-6 w-6 text-teal-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Navigating Senior Care in {cityName}
            </h2>
          </div>

          {/* Authority Prose */}
          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-slate-700 leading-relaxed">
              {content.intro}
            </p>
            <p className="text-slate-700 leading-relaxed">
              {content.highlight}
            </p>
          </div>

          {/* Trust Signals */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5 border border-slate-200">
              <Hospital className="h-6 w-6 text-teal-600 mb-3" />
              <h3 className="font-semibold text-slate-900 mb-1">Near {nearestHospital.split(' ').slice(0, 3).join(' ')}</h3>
              <p className="text-sm text-slate-600">
                Convenient access to emergency and specialist care
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-slate-200">
              <Shield className="h-6 w-6 text-teal-600 mb-3" />
              <h3 className="font-semibold text-slate-900 mb-1">{currentYear} Verified Data</h3>
              <p className="text-sm text-slate-600">
                Pricing and availability updated regularly
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-slate-200">
              <Clock className="h-6 w-6 text-teal-600 mb-3" />
              <h3 className="font-semibold text-slate-900 mb-1">Local Advisors Available</h3>
              <p className="text-sm text-slate-600">
                Free consultations M-F, 9am-5pm EST
              </p>
            </div>
          </div>

          {/* Cost Preview */}
          {cityData?.averageCost && (
            <div className="mt-8 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">
                    {cityName} Assisted Living: {costRange}/month
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Costs vary by care level, room type, and amenities
                  </p>
                </div>
                <a
                  href="#affordability-calculator"
                  className="inline-flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors min-h-[48px]"
                >
                  Calculate Your Costs
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LocalAuthorityProse;

