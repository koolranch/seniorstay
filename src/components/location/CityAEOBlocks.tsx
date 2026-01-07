'use client';

import React from 'react';
import Script from 'next/script';
import { HelpCircle, MapPin, DollarSign, Clock, Heart, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { CityInfo } from '@/data/cleveland-cities';
import { getCityHospitals, getNearestHospitalForCity, HospitalData } from '@/lib/hospital-proximity';

interface CityAEOBlocksProps {
  cityName: string;
  citySlug: string;
  communityCount: number;
  cityData?: CityInfo;
  memoryCareCount?: number;
  assistedLivingCount?: number;
}

interface FAQItem {
  question: string;
  answer: string;
}

/**
 * CityAEOBlocks - Answer Engine Optimization component
 * Generates localized FAQs with JSON-LD schema for AI rich results
 * Targets both 'Stressed Adult Child' and 'Solo Ager' personas
 */
const CityAEOBlocks: React.FC<CityAEOBlocksProps> = ({
  cityName,
  citySlug,
  communityCount,
  cityData,
  memoryCareCount = 0,
  assistedLivingCount = 0,
}) => {
  const [openFAQ, setOpenFAQ] = React.useState<number | null>(0);
  const currentYear = new Date().getFullYear();
  
  // Get hospital data for this city
  const cityHospitals = getCityHospitals(citySlug);
  const primaryHospital = cityHospitals[0];
  const nearestHospitalName = getNearestHospitalForCity(citySlug);
  
  // Get cost data
  const costData = cityData?.averageCost || {
    independentLiving: '$2,500 - $4,500',
    assistedLiving: '$3,500 - $6,500',
    memoryCare: '$5,000 - $8,500'
  };

  // Generate 3 localized FAQs based on city data and nearest hospital
  const generateLocalizedFAQs = (): FAQItem[] => {
    const hospitalContext = primaryHospital 
      ? `near ${primaryHospital.name} (${primaryHospital.medicalSystem} network)`
      : `in the Greater Cleveland healthcare network`;
    
    const hospitalDistance = primaryHospital ? 'within 5 miles' : 'with easy access to';
    
    return [
      {
        question: `What is the average cost of assisted living in ${cityName}, OH in ${currentYear}?`,
        answer: `The average cost of assisted living in ${cityName}, Ohio in ${currentYear} is ${costData.assistedLiving} per month. ` +
          `This typically includes a private or semi-private room, three daily meals, medication management, housekeeping, and 24-hour staff assistance. ` +
          `Memory care in ${cityName} ranges from ${costData.memoryCare} monthly. ` +
          `${cityName} offers ${communityCount > 0 ? communityCount : 'several'} senior living communities ${hospitalContext}, ` +
          `ensuring residents have quick access to emergency and specialist care. ` +
          `Guide for Seniors provides free cost comparisons—call (216) 677-4630 for personalized pricing.`
      },
      {
        question: `What hospitals are near ${cityName} senior living communities?`,
        answer: `${cityName} senior living communities are ${hospitalDistance} ${cityHospitals.slice(0, 3).map(h => h.name).join(', ')}. ` +
          `${primaryHospital ? `${primaryHospital.name}, part of the ${primaryHospital.medicalSystem} system, offers emergency services, specialist consultations, and rehabilitation facilities. ` : ''}` +
          `This proximity to world-class Cleveland healthcare is a major advantage for ${cityName} seniors, especially those managing chronic conditions or recovering from hospital stays. ` +
          `Many ${cityName} communities offer direct hospital discharge transitions with same-week move-ins available.`
      },
      {
        question: `How do I choose between assisted living and memory care in ${cityName}?`,
        answer: `Choosing between assisted living and memory care in ${cityName} depends on your loved one's cognitive status and daily care needs. ` +
          `Assisted living (${costData.assistedLiving}/mo in ${cityName}) is ideal for seniors who need help with daily activities but remain cognitively alert. ` +
          `Memory care (${costData.memoryCare}/mo) provides specialized dementia programming, secured environments, and trained staff for Alzheimer's and dementia residents. ` +
          `${memoryCareCount > 0 ? `${cityName} has ${memoryCareCount} memory care communities` : `Several ${cityName} communities`} offer both care levels, allowing residents to transition without relocating. ` +
          `Guide for Seniors offers free assessments to help ${cityName} families determine the right level of care—schedule yours at (216) 677-4630.`
      }
    ];
  };

  const faqs = generateLocalizedFAQs();

  // Generate FAQPage JSON-LD schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <>
      {/* JSON-LD Schema for FAQPage - eligibility for AI rich results */}
      <Script
        id={`faq-schema-${citySlug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="py-12 bg-gradient-to-br from-slate-50 to-white border-y border-slate-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <HelpCircle className="h-4 w-4" />
                <span>Frequently Asked Questions</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                {cityName} Senior Living: Your Questions Answered
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Expert answers for families exploring assisted living and memory care options in {cityName}, OH—backed by {currentYear} data.
              </p>
            </div>

            {/* FAQ Accordion */}
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                    aria-expanded={openFAQ === index}
                  >
                    <span className="font-semibold text-gray-900 text-lg pr-4">
                      {faq.question}
                    </span>
                    {openFAQ === index ? (
                      <ChevronUp className="h-5 w-5 text-primary-600 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  
                  {openFAQ === index && (
                    <div className="px-6 pb-5 pt-0">
                      <div className="prose prose-slate max-w-none">
                        <p className="text-gray-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Stats Bar */}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                <div className="text-2xl font-bold text-primary-600">{communityCount || '10+'}</div>
                <div className="text-sm text-gray-600">Communities</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                <div className="text-2xl font-bold text-primary-600">{costData.assistedLiving.split('-')[0]}</div>
                <div className="text-sm text-gray-600">Starting Cost</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                <div className="text-2xl font-bold text-primary-600">{cityHospitals.length}+</div>
                <div className="text-sm text-gray-600">Nearby Hospitals</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                <div className="text-2xl font-bold text-primary-600">Free</div>
                <div className="text-sm text-gray-600">Consultation</div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 text-center">
              <a 
                href="tel:+12166774630"
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-4 rounded-xl transition-colors text-lg shadow-lg"
              >
                Get Your Free {cityName} Senior Living Guide
              </a>
              <p className="mt-3 text-sm text-gray-500">
                No obligation • Personalized recommendations • {currentYear} pricing
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CityAEOBlocks;

