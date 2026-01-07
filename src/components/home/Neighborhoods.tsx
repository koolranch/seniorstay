'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Building2, Hospital } from 'lucide-react';

/**
 * Hyper-Local SEO Section - Cleveland Neighborhoods
 * Links to neighborhood-specific pages for local SEO authority
 */

interface Neighborhood {
  name: string;
  slug: string;
  communityCount: number;
  highlight?: string;
  clinicalAnchor?: string;
}

const NEIGHBORHOODS: Neighborhood[] = [
  { 
    name: 'Beachwood', 
    slug: 'beachwood', 
    communityCount: 8,
    highlight: 'Medical Mile',
    clinicalAnchor: 'UH Ahuja Medical Center',
  },
  { 
    name: 'Westlake', 
    slug: 'westlake', 
    communityCount: 12,
    highlight: 'Premium Care',
    clinicalAnchor: 'St. John Medical Center',
  },
  { 
    name: 'Solon', 
    slug: 'solon', 
    communityCount: 6,
    clinicalAnchor: 'Cleveland Clinic Hillcrest',
  },
  { 
    name: 'Strongsville', 
    slug: 'strongsville', 
    communityCount: 9,
    clinicalAnchor: 'Southwest General',
  },
  { 
    name: 'Cleveland Heights', 
    slug: 'cleveland-heights', 
    communityCount: 7,
  },
  { 
    name: 'Shaker Heights', 
    slug: 'shaker-heights', 
    communityCount: 5,
    highlight: 'Historic District',
  },
  { 
    name: 'Lakewood', 
    slug: 'lakewood', 
    communityCount: 8,
    clinicalAnchor: 'Fairview Hospital',
  },
  { 
    name: 'Parma', 
    slug: 'parma', 
    communityCount: 11,
    highlight: 'Value Options',
  },
  { 
    name: 'Rocky River', 
    slug: 'rocky-river', 
    communityCount: 5,
    clinicalAnchor: 'Fairview Hospital',
  },
  { 
    name: 'Independence', 
    slug: 'independence', 
    communityCount: 4,
  },
  { 
    name: 'Mentor', 
    slug: 'mentor', 
    communityCount: 7,
    highlight: 'Lake County',
  },
  { 
    name: 'Cleveland', 
    slug: 'cleveland', 
    communityCount: 25,
    clinicalAnchor: 'Cleveland Clinic Main Campus',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

const Neighborhoods: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-slate-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="inline-block bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Local Expertise
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Senior Living Options in Cleveland Neighborhoods
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explore senior care communities across Greater Cleveland. Each neighborhood offers unique benefits, from medical access to community atmosphere.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Neighborhood Links Grid */}
          <div className="lg:col-span-2">
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {NEIGHBORHOODS.map((neighborhood) => (
                <motion.div key={neighborhood.slug} variants={itemVariants}>
                  <Link
                    href={`/location/${neighborhood.slug}`}
                    className="group block bg-white border border-slate-200 hover:border-teal-300 rounded-xl p-4 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-teal-50 text-teal-600 p-2 rounded-lg group-hover:bg-teal-100 transition-colors">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors truncate">
                          {neighborhood.name}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {neighborhood.communityCount} communities
                        </p>
                        {neighborhood.highlight && (
                          <span className="inline-block mt-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                            {neighborhood.highlight}
                          </span>
                        )}
                      </div>
                    </div>
                    {neighborhood.clinicalAnchor && (
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                        <Hospital className="h-3.5 w-3.5" />
                        <span className="truncate">Near {neighborhood.clinicalAnchor}</span>
                      </div>
                    )}
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* View All Link */}
            <div className="mt-8 text-center lg:text-left">
              <Link
                href="/greater-cleveland"
                className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold transition-colors"
              >
                <span>View All Cleveland-Area Communities</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-24">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-teal-600" />
                Cleveland Area Coverage
              </h3>
              
              {/* Map Placeholder - Replace with actual map component */}
              <div 
                className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center relative overflow-hidden"
                role="img"
                aria-label="Interactive map of Cleveland senior living communities - placeholder"
              >
                {/* Decorative map-like pattern */}
                <div className="absolute inset-0 opacity-20">
                  <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
                    <circle cx="100" cy="100" r="60" stroke="#0D9488" strokeWidth="1" strokeDasharray="4 4" />
                    <circle cx="100" cy="100" r="40" stroke="#0D9488" strokeWidth="1" strokeDasharray="4 4" />
                    <circle cx="100" cy="100" r="20" stroke="#0D9488" strokeWidth="1" strokeDasharray="4 4" />
                    {/* Simulated location markers */}
                    <circle cx="80" cy="70" r="4" fill="#0D9488" />
                    <circle cx="120" cy="80" r="4" fill="#0D9488" />
                    <circle cx="90" cy="120" r="4" fill="#0D9488" />
                    <circle cx="130" cy="110" r="4" fill="#0D9488" />
                    <circle cx="70" cy="100" r="4" fill="#0D9488" />
                    <circle cx="100" cy="100" r="6" fill="#F59E0B" />
                  </svg>
                </div>
                <div className="text-center z-10">
                  <MapPin className="h-12 w-12 text-teal-500 mx-auto mb-2" />
                  <p className="text-slate-600 font-medium">Interactive Map</p>
                  <p className="text-sm text-slate-500">Coming Soon</p>
                </div>
              </div>

              {/* Quick stats */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-teal-600">150+</p>
                  <p className="text-xs text-slate-600">Communities</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-amber-600">12</p>
                  <p className="text-xs text-slate-600">Neighborhoods</p>
                </div>
              </div>

              <Link
                href="/contact"
                className="mt-6 block w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-xl text-center transition-colors"
              >
                Get Local Guidance
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Neighborhoods;

