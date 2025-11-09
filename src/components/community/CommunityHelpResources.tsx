"use client";

import * as React from 'react';
import { Phone, Mail, ExternalLink, AlertCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CommunityHelpResources() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-white py-12 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Your Rights & Resources
          </h2>
        </div>

        <p className="text-gray-700 mb-8 max-w-3xl">
          Ohio residents have rights and resources to ensure quality care. If you have concerns about 
          care quality, safety, or resident rights, these organizations can help.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ohio Department of Health - Complaints */}
          <div className="bg-white border border-blue-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Report a Concern or Complaint
                </h3>
                <p className="text-sm text-gray-700 mb-4">
                  File a complaint about care quality, safety issues, or suspected abuse or neglect 
                  with the Ohio Department of Health.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-600" />
                    <a href="tel:1-800-342-0553" className="text-blue-600 hover:underline font-medium">
                      1-800-342-0553
                    </a>
                  </div>

                  <a
                    href="https://odh.ohio.gov/know-our-programs/health-care-facilities/reporting-a-concern"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    File Online Complaint
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-600">
                    <strong>When to report:</strong> Safety concerns, inadequate care, medication errors, 
                    abuse or neglect, unsanitary conditions, or rights violations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Long-Term Care Ombudsman */}
          <div className="bg-white border border-green-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-green-600 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Talk to the Ombudsman
                </h3>
                <p className="text-sm text-gray-700 mb-4">
                  Free, confidential advocacy service to help resolve concerns and protect resident rights 
                  in nursing homes and assisted living facilities.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-600" />
                    <a href="tel:1-800-282-1206" className="text-green-600 hover:underline font-medium">
                      1-800-282-1206
                    </a>
                  </div>

                  <a
                    href="https://aging.ohio.gov/about-us/contact-us/long-term-care-ombudsman"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    Contact Local Ombudsman
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-600">
                    <strong>What they do:</strong> Investigate complaints, mediate issues, educate about 
                    rights, and advocate for residents and families.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Resources */}
          <div className="bg-white border border-purple-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Additional Resources
            </h3>

            <div className="space-y-4">
              <div>
                <a
                  href="https://www.medicare.gov/care-compare/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                >
                  Medicare Care Compare
                  <ExternalLink className="w-4 h-4" />
                </a>
                <p className="text-sm text-gray-600 mt-1">
                  Compare nursing homes nationwide with official CMS data
                </p>
              </div>

              <div>
                <a
                  href="https://projects.propublica.org/nursing-homes/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                >
                  ProPublica Nursing Home Inspect
                  <ExternalLink className="w-4 h-4" />
                </a>
                <p className="text-sm text-gray-600 mt-1">
                  Independent analysis and inspection history
                </p>
              </div>

              <div>
                <a
                  href="https://odh.ohio.gov/know-our-programs/health-care-facilities/nursing-homes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                >
                  Ohio Health Facilities
                  <ExternalLink className="w-4 h-4" />
                </a>
                <p className="text-sm text-gray-600 mt-1">
                  Ohio Department of Health facility information
                </p>
              </div>
            </div>
          </div>

          {/* Resident Rights */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Resident Rights
            </h3>

            <p className="text-sm text-gray-700 mb-3">
              Federal law guarantees nursing home residents have the right to:
            </p>

            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Be treated with dignity and respect</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Participate in care planning decisions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Voice grievances without retaliation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Privacy in care and communications</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Be free from abuse and restraints</span>
              </li>
            </ul>

            <a
              href="https://www.medicare.gov/what-medicare-covers/your-medicare-coverage-choices/getting-long-term-care/nursing-home-care/your-rights-in-a-nursing-home"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mt-4"
            >
              Read Full Resident Rights
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

