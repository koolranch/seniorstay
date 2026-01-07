'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Hospital, Building2, ArrowRight, Star, DollarSign, Home, Shield, Heart } from 'lucide-react';
import LocationCard from '@/components/property/LocationCard';
import { Community } from '@/data/facilities';
import { fetchFeaturedCommunities } from '@/lib/fetch-featured-communities';

/**
 * NeighborhoodSpotlight - Authority Hub Teasers for Premium Cities
 * Links to existing /location/[city] pages without duplicating SEO content
 */

interface NeighborhoodData {
  id: string;
  city: string;
  slug: string;
  headline: string;
  subheadline: string;
  body: string;
  keyStats: {
    avgCost: string;
    communityCount: string;
    zipCode?: string;
  };
  clinicalAnchor: {
    name: string;
    badge: string;
  };
  ctaText: string;
  ctaLink: string;
  gradient: string;
  accentColor: string;
  iconBg: string;
}

const NEIGHBORHOOD_DATA: NeighborhoodData[] = [
  {
    id: 'westlake',
    city: 'Westlake',
    slug: 'westlake',
    headline: 'Navigating Senior Living in Westlake, OH',
    subheadline: 'The Proactive Rightsizing Hub',
    body: "Westlake is more than just a beautiful lakeside suburb; it's a premier destination for seniors who value active longevity and clinical peace of mind. Families here prioritize proximity to top-tier medical care—like the Cleveland Clinic Richard E. Jacobs Health Center—and walkable access to local favorites like Crocker Park. Whether you are seeking a luxury independent villa or specialized memory care near St. John Medical Center, our Westlake advisors provide the local data you need to make a confident decision.",
    keyStats: {
      avgCost: '~$5,800/mo',
      communityCount: '12+ verified communities',
      zipCode: '44145',
    },
    clinicalAnchor: {
      name: 'Cleveland Clinic Jacobs Health Center',
      badge: 'Near Cleveland Clinic Jacobs Health Center',
    },
    ctaText: 'View All 12 Westlake Communities',
    ctaLink: '/location/westlake',
    gradient: 'from-teal-600 to-cyan-700',
    accentColor: 'teal',
    iconBg: 'bg-teal-100',
  },
  {
    id: 'beachwood',
    city: 'Beachwood',
    slug: 'beachwood',
    headline: 'Trusted Senior Care in Beachwood, OH',
    subheadline: 'Premium Care & Clinical Excellence',
    body: "Beachwood is the \"Medical Mile\" of Northeast Ohio, offering some of the most advanced memory care and rehabilitation services in the region. For families managing a hospital discharge from UH Ahuja Medical Center or Cleveland Clinic Beachwood, timing and clinical competence are everything. We help you navigate premium options that feature specialized nursing, diverse cultural amenities, and direct access to Beachwood's world-class shopping and synagogues.",
    keyStats: {
      avgCost: '~$6,800/mo',
      communityCount: '5-star rated clinical facilities',
      zipCode: undefined,
    },
    clinicalAnchor: {
      name: 'UH Ahuja Medical Center',
      badge: 'Direct Access to UH Ahuja Medical Center',
    },
    ctaText: 'View Beachwood Care Guide',
    ctaLink: '/location/beachwood',
    gradient: 'from-rose-600 to-orange-600',
    accentColor: 'rose',
    iconBg: 'bg-rose-100',
  },
];

interface NeighborhoodSpotlightProps {
  communities: Community[];
}

const NeighborhoodSpotlight: React.FC<NeighborhoodSpotlightProps> = ({ communities }) => {
  // Filter communities by city and ensure they have descriptions + real images
  const getTopCommunities = (cityName: string, limit: number = 3): Community[] => {
    return communities
      .filter((c) => {
        const isInCity = c.location.toLowerCase().includes(cityName.toLowerCase());
        const hasDescription = c.description && c.description.trim().length > 50;
        const hasRealImage = c.images?.[0] && !c.images[0].toLowerCase().includes('placeholder');
        return isInCity && hasDescription && hasRealImage;
      })
      .slice(0, limit);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  };

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span
            className="inline-block bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-bold mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            🏆 Neighborhood Authority Hubs
          </motion.span>
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Cleveland's Premier Senior Living Destinations
          </motion.h2>
          <motion.p
            className="text-lg text-slate-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Deep-dive guides to the most sought-after suburbs for senior care, curated by local experts who know every community personally.
          </motion.p>
        </div>

        {/* Neighborhood Hubs */}
        <motion.div
          className="space-y-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {NEIGHBORHOOD_DATA.map((neighborhood, idx) => {
            const topCommunities = getTopCommunities(neighborhood.city);
            const isReversed = idx % 2 === 1;

            return (
              <motion.div
                key={neighborhood.id}
                variants={itemVariants}
                className={`grid lg:grid-cols-2 gap-12 items-start ${isReversed ? 'lg:flex-row-reverse' : ''}`}
              >
                {/* Content Block */}
                <div className={`${isReversed ? 'lg:order-2' : 'lg:order-1'}`}>
                  {/* Clinical Anchor Badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`flex items-center gap-2 ${neighborhood.iconBg} px-4 py-2 rounded-full`}>
                      <Hospital className={`h-4 w-4 text-${neighborhood.accentColor}-600`} />
                      <span className={`text-sm font-semibold text-${neighborhood.accentColor}-700`}>
                        {neighborhood.clinicalAnchor.badge}
                      </span>
                    </div>
                  </div>

                  {/* Subheadline Tag */}
                  <span className={`inline-block bg-gradient-to-r ${neighborhood.gradient} text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3`}>
                    {neighborhood.subheadline}
                  </span>

                  {/* Headline */}
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                    {neighborhood.headline}
                  </h3>

                  {/* Body */}
                  <p className="text-lg text-slate-600 leading-relaxed mb-6">
                    {neighborhood.body}
                  </p>

                  {/* Key Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className={`h-5 w-5 text-${neighborhood.accentColor}-600`} />
                        <span className="text-sm font-medium text-slate-500">Avg. Assisted Living</span>
                      </div>
                      <span className="text-xl font-bold text-slate-900">{neighborhood.keyStats.avgCost}</span>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Home className={`h-5 w-5 text-${neighborhood.accentColor}-600`} />
                        <span className="text-sm font-medium text-slate-500">
                          {neighborhood.keyStats.zipCode ? `In ${neighborhood.keyStats.zipCode}` : 'Clinical Tier'}
                        </span>
                      </div>
                      <span className="text-xl font-bold text-slate-900">{neighborhood.keyStats.communityCount}</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={neighborhood.ctaLink}
                    className={`inline-flex items-center gap-3 bg-gradient-to-r ${neighborhood.gradient} hover:opacity-90 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all text-lg min-h-[56px]`}
                  >
                    <span>{neighborhood.ctaText}</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>

                {/* Communities Grid */}
                <div className={`${isReversed ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className={`h-5 w-5 text-${neighborhood.accentColor}-600`} />
                    <span className="text-sm font-semibold text-slate-700">
                      Top {neighborhood.city} Communities
                    </span>
                  </div>

                  {topCommunities.length > 0 ? (
                    <div className="grid gap-4">
                      {topCommunities.map((community, i) => (
                        <div key={community.id} className="relative">
                          {i === 0 && (
                            <div className={`absolute -top-2 -left-2 z-10 bg-gradient-to-r ${neighborhood.gradient} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1`}>
                              <Star className="h-3 w-3 fill-white" />
                              TOP PICK
                            </div>
                          )}
                          <LocationCard community={community} compact />
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* ADVISOR NOTE: Professional fallback for cities with zero complete communities */
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-8">
                      <div className="flex items-start gap-4">
                        <div className="bg-amber-100 rounded-full p-3 flex-shrink-0">
                          <Shield className="h-6 w-6 text-amber-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-slate-900 mb-2">
                            Advisor Note: {neighborhood.city} Vetting in Progress
                          </h4>
                          <p className="text-slate-700 mb-4 leading-relaxed">
                            We are currently vetting new communities in {neighborhood.city} to ensure they meet our quality standards. 
                            Contact our local advisors for an immediate <strong>off-market referral</strong> to pre-screened options.
                          </p>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <a
                              href="tel:+12166774630"
                              className={`inline-flex items-center justify-center gap-2 bg-gradient-to-r ${neighborhood.gradient} text-white font-bold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all min-h-[48px]`}
                            >
                              <Heart className="h-4 w-4" />
                              Call (216) 677-4630
                            </a>
                            <Link
                              href="/contact"
                              className="inline-flex items-center justify-center gap-2 bg-white border-2 border-slate-300 text-slate-700 font-semibold px-6 py-3 rounded-lg hover:border-slate-400 transition-all min-h-[48px]"
                            >
                              Request Off-Market Options
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {topCommunities.length > 0 && (
                    <Link
                      href={neighborhood.ctaLink}
                      className="mt-4 inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium text-base transition-colors min-h-[48px]"
                    >
                      <span>See all {neighborhood.city} options</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default NeighborhoodSpotlight;

