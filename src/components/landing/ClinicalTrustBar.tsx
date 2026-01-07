'use client';

import React from 'react';
import { Shield, Building2, Heart, Stethoscope } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Clinical Trust Bar - Establishes credibility by showing partnership
 * with Cleveland's major medical anchors.
 */
const ClinicalTrustBar: React.FC = () => {
  const medicalPartners = [
    {
      name: 'Cleveland Clinic Network',
      icon: Building2,
      color: 'text-blue-600',
    },
    {
      name: 'University Hospitals',
      icon: Heart,
      color: 'text-red-600',
    },
    {
      name: 'Southwest General',
      icon: Stethoscope,
      color: 'text-teal-600',
    },
  ];

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-5 border-b border-slate-700">
      <div className="container mx-auto px-4">
        <motion.div 
          className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Trust Icon */}
          <div className="flex items-center gap-2 text-slate-300">
            <Shield className="h-5 w-5 text-emerald-400" />
            <span className="text-sm font-semibold uppercase tracking-wider">
              Expertly Navigating
            </span>
          </div>

          {/* Medical Partners */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6">
            {medicalPartners.map((partner, index) => (
              <React.Fragment key={partner.name}>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                  <partner.icon className={`h-4 w-4 ${partner.color}`} />
                  <span className="text-sm font-medium text-white whitespace-nowrap">
                    {partner.name}
                  </span>
                </div>
                {index < medicalPartners.length - 1 && (
                  <span className="hidden md:inline text-slate-500">•</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ClinicalTrustBar;

