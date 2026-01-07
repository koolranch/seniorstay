'use client';

import React, { useState } from 'react';
import { Download, CheckCircle2, AlertCircle, FileText, Phone } from 'lucide-react';
import { submitLead } from '@/app/actions/leads';

interface CityLeadMagnetProps {
  cityName: string;
  citySlug: string;
  isHospitalDischarge?: boolean;
}

/**
 * CityLeadMagnet - High-conversion lead capture for city pages
 * Positioned immediately below hero for maximum visibility
 */
const CityLeadMagnet: React.FC<CityLeadMagnetProps> = ({ 
  cityName, 
  citySlug,
  isHospitalDischarge = false 
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const currentYear = new Date().getFullYear();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const result = await submitLead({
        fullName: name,
        email: email,
        notes: isHospitalDischarge 
          ? `Requested ${currentYear} ${cityName} Cost Guide + Hospital Discharge Checklist`
          : `Requested ${currentYear} ${cityName} Senior Care Cost Guide`,
        pageType: 'city_lead_magnet',
        sourceSlug: `location-${citySlug}`,
      });

      if (result.success) {
        setIsSuccess(true);
        setName('');
        setEmail('');
      } else {
        setError(result.message || 'Failed to send request. Please try again.');
      }
    } catch (err) {
      console.error('Lead magnet submission error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-5">
              {/* Left Content */}
              <div className="md:col-span-3 p-8 md:p-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-teal-100 p-2 rounded-lg">
                    <FileText className="h-6 w-6 text-teal-600" />
                  </div>
                  <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-semibold">
                    Free Download
                  </span>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                  {currentYear} {cityName} Senior Care Cost Guide
                </h2>
                
                {isHospitalDischarge ? (
                  <p className="text-slate-600 mb-6">
                    Moving from a hospital to senior care? Get our <strong className="text-slate-800">48-hour {cityName} discharge checklist</strong> and comprehensive local cost breakdown—completely free.
                  </p>
                ) : (
                  <p className="text-slate-600 mb-6">
                    Download our comprehensive breakdown of assisted living, memory care, and independent living costs in {cityName}—updated for {currentYear}.
                  </p>
                )}

                <ul className="space-y-2 mb-6">
                  {[
                    `${cityName} community pricing comparison`,
                    'Care level cost differences explained',
                    'Financial assistance options in Ohio',
                    isHospitalDischarge ? '48-hour discharge planning timeline' : 'Hidden costs to watch for'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-slate-700">
                      <CheckCircle2 className="h-5 w-5 text-teal-500 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right Form */}
              <div className="md:col-span-2 bg-slate-50 p-8 md:p-10 flex flex-col justify-center">
                {isSuccess ? (
                  <div className="text-center">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Guide Sent!</h3>
                    <p className="text-slate-600 mb-4">Check your inbox for your free {cityName} cost guide.</p>
                    <a
                      href="tel:+12166774630"
                      className="inline-flex items-center gap-2 text-teal-600 font-semibold hover:text-teal-700"
                    >
                      <Phone className="h-4 w-4" />
                      Need help now? Call (216) 677-4630
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="lead-name" className="block text-sm font-semibold text-slate-700 mb-1">
                        Your Name
                      </label>
                      <input
                        id="lead-name"
                        type="text"
                        required
                        placeholder="Full name"
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="lead-email" className="block text-sm font-semibold text-slate-700 mb-1">
                        Email Address
                      </label>
                      <input
                        id="lead-email"
                        type="email"
                        required
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    {error && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{error}</span>
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white font-bold py-4 px-6 rounded-xl transition-colors min-h-[56px] shadow-lg flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        'Sending...'
                      ) : (
                        <>
                          <Download className="h-5 w-5" />
                          Get My Free Guide
                        </>
                      )}
                    </button>
                    <p className="text-xs text-slate-500 text-center">
                      100% free • No spam • Your info is confidential
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CityLeadMagnet;

