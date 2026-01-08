'use client';

import React from 'react';
import { MapPin, Phone, ExternalLink, Building2, Shield, Heart, FileText } from 'lucide-react';
import { CityLocalResources, LocalResource } from '@/data/local-resources';

interface LocalSeniorResourcesProps {
  cityName: string;
  resources: CityLocalResources;
}

function ResourceCard({ resource, icon: Icon }: { resource: LocalResource; icon: React.ElementType }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm mb-1">{resource.name}</h4>
          
          <div className="space-y-1 text-sm text-gray-600">
            <p className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <span>
                {resource.address}<br />
                {resource.city}, {resource.state} {resource.zip}
              </span>
            </p>
            
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <a href={`tel:${resource.phone.replace(/[^0-9]/g, '')}`} className="text-primary hover:underline">
                {resource.phone}
              </a>
            </p>
          </div>
          
          {resource.description && (
            <p className="text-xs text-gray-500 mt-2">{resource.description}</p>
          )}
          
          {resource.website && (
            <a 
              href={resource.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
            >
              Visit Website <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
      
      {/* Schema.org LocalBusiness markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': resource.type === 'hospital' ? 'Hospital' : 
                     resource.type === 'social-security' ? 'GovernmentOffice' : 
                     resource.type === 'area-agency' ? 'GovernmentOrganization' : 'LocalBusiness',
            name: resource.name,
            address: {
              '@type': 'PostalAddress',
              streetAddress: resource.address,
              addressLocality: resource.city,
              addressRegion: resource.state,
              postalCode: resource.zip,
              addressCountry: 'US'
            },
            telephone: resource.phone,
            ...(resource.website && { url: resource.website }),
            ...(resource.description && { description: resource.description })
          })
        }}
      />
    </div>
  );
}

export default function LocalSeniorResources({ cityName, resources }: LocalSeniorResourcesProps) {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-12 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Local Senior Resources in {cityName}
            </h2>
            <p className="text-gray-600">
              Important contacts for families navigating senior care in the {cityName} area
            </p>
          </div>
          
          <div className="grid gap-6">
            {/* Social Security Office */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Social Security Office
              </h3>
              <ResourceCard resource={resources.socialSecurity} icon={Building2} />
            </div>
            
            {/* Area Agency on Aging */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Heart className="h-5 w-5 text-rose-500" />
                Area Agency on Aging (Free Help with Medicaid & PASSPORT)
              </h3>
              <ResourceCard resource={resources.areaAgency} icon={Heart} />
            </div>
            
            {/* Medicaid Office */}
            {resources.medicaidOffice && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  Medicaid & Assisted Living Waiver
                </h3>
                <ResourceCard resource={resources.medicaidOffice} icon={FileText} />
              </div>
            )}
            
            {/* Nearby Hospitals */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-red-500" />
                Major Hospitals Near {cityName}
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resources.hospitals.map((hospital, index) => (
                  <ResourceCard key={index} resource={hospital} icon={Building2} />
                ))}
              </div>
            </div>
          </div>
          
          {/* CTA */}
          <div className="mt-8 text-center bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <p className="text-gray-700 mb-4">
              <strong>Need help applying for Medicaid or finding assisted living in {cityName}?</strong>
              <br />
              Our local advisors provide free, personalized guidance for Cleveland families.
            </p>
            <a 
              href="/contact"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Get Free Local Help
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}







