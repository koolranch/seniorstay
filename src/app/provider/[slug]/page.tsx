"use client";

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiArrowLeft,
  FiStar,
  FiMap,
  FiHeart,
  FiShare2,
  FiPhoneCall,
  FiCheck,
  FiCalendar,
  FiMessageCircle,
  FiClock,
  FiX
} from "react-icons/fi";
import ReferralCTA from "@/components/ReferralCTA";
import TestimonialSlider from "@/components/TestimonialSlider";
import TourScheduler from '@/components/TourScheduler';

// This would typically come from a database or API
const sampleCommunity = {
  id: 1,
  slug: "sunshine-meadows",
  name: "Sunshine Meadows Senior Living",
  description: "Sunshine Meadows offers a vibrant senior living community with independent living, assisted living, and memory care services. Our beautifully landscaped campus provides a warm, welcoming environment where residents can enjoy an active and fulfilling lifestyle.",
  city: "Cleveland",
  state: "OH",
  address: "123 Sunshine Way, Cleveland, OH 44101",
  type: "Independent Living",
  careTypes: ["Independent Living", "Assisted Living", "Memory Care"],
  images: [
    "https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=2074&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551516594-56cb78394645?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1582719471384-894fbb07a271?q=80&w=2187&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1568939571043-88fceafce24f?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600607687126-8a3414349a51?q=80&w=2070&auto=format&fit=crop"
  ],
  rating: 4.8,
  reviewCount: 142,
  amenities: [
    "Restaurant-style dining",
    "Fitness center",
    "Swimming pool",
    "Library",
    "Game room",
    "Beauty salon/barbershop",
    "Community garden",
    "Transportation services",
    "Housekeeping",
    "Laundry services",
    "24-hour security",
    "Emergency response system",
    "Pet friendly"
  ],
  services: [
    "Daily activities and events",
    "Wellness programs",
    "Medication management",
    "Physical therapy",
    "Memory care programs",
    "Assistance with daily living",
    "On-site medical care",
    "Social activities",
    "Religious services"
  ],
  testimonials: [
    {
      id: 1,
      quote: "Moving my mom to Sunshine Meadows was the best decision we made. The staff is caring and attentive, and she has made so many new friends.",
      author: "Jennifer H.",
      relation: "Daughter of resident",
      communityName: "Sunshine Meadows"
    },
    {
      id: 2,
      quote: "The care my father receives is exceptional. From the well-designed living spaces to the engaging activities, everything is thoughtfully planned.",
      author: "Michael T.",
      relation: "Son of resident",
      communityName: "Sunshine Meadows"
    }
  ],
  lat: 41.4993,
  lng: -81.6944,
  phoneNumber: "1-800-555-CARE",
};

export default function ProviderPage() {
  const params = useParams();
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("about");
  const [showTourScheduler, setShowTourScheduler] = useState(false);

  // This would normally fetch data based on the slug
  const community = sampleCommunity;

  // Navigate back if community not found
  if (!community) {
    router.push("/");
    return null;
  }

  const handleSaveToggle = () => {
    setIsSaved(!isSaved);
    // Here you would handle saving to user's favorites
  };

  const openTourScheduler = () => {
    setShowTourScheduler(true);
  };

  const closeTourScheduler = () => {
    setShowTourScheduler(false);
  };

  const tabs = [
    { id: "about", label: "About" },
    { id: "amenities", label: "Amenities & Services" },
    { id: "reviews", label: "Reviews" },
    { id: "location", label: "Location" },
  ];

  return (
    <div className="bg-[#FAFAF5] min-h-screen pb-16">
      {/* Back button and actions */}
      <div className="sticky top-[73px] bg-white z-20 border-b border-[#A7C4A0]">
        <div className="container mx-auto px-6 md:px-10 lg:px-20 py-4 flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center text-[#1b4d70] hover:text-[#2F5061]"
          >
            <FiArrowLeft className="mr-2" />
            <span>Back to search</span>
          </button>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSaveToggle}
              className="flex items-center text-[#1b4d70] hover:text-[#2F5061]"
            >
              <FiHeart
                className={isSaved ? "fill-[#F5A623] text-[#F5A623]" : ""}
                size={18}
              />
              <span className="ml-2 hidden sm:inline">
                {isSaved ? "Saved" : "Save"}
              </span>
            </button>
            <button className="flex items-center text-[#1b4d70] hover:text-[#2F5061]">
              <FiShare2 size={18} />
              <span className="ml-2 hidden sm:inline">Share</span>
            </button>
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="container mx-auto px-6 md:px-10 lg:px-20">
          <div className="flex overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 whitespace-nowrap font-medium text-sm ${
                  activeTab === tab.id
                    ? "text-[#1b4d70] border-b-2 border-[#1b4d70]"
                    : "text-[#666666] hover:text-[#1b4d70]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="container mx-auto px-6 md:px-10 lg:px-20 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative h-72 md:h-96 rounded-xl overflow-hidden">
            <Image
              src={community.images[activeImageIndex]}
              alt={`${community.name} - Main Image`}
              fill
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {community.images.slice(1, 5).map((image, index) => (
              <div
                key={image}
                className="relative h-32 md:h-44 rounded-xl overflow-hidden cursor-pointer"
                onClick={() => setActiveImageIndex(index + 1)}
              >
                <Image
                  src={image}
                  alt={`${community.name} - Image ${index + 2}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-6 md:px-10 lg:px-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column - Main content */}
          <div className="lg:w-2/3">
            {/* Community header */}
            <div className="mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-[#1b4d70]">{community.name}</h1>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center text-[#333333]">
                      <FiStar className="text-[#F5A623] fill-[#F5A623]" />
                      <span className="ml-1">{community.rating}</span>
                      <span className="ml-1">({community.reviewCount} reviews)</span>
                    </div>
                    <span className="mx-2">•</span>
                    <div className="flex items-center text-[#333333]">
                      <FiMap className="text-[#1b4d70]" />
                      <span className="ml-1">{community.city}, {community.state}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center text-[#1b4d70] font-semibold">
                    <FiPhoneCall className="mr-2" />
                    <span>{community.phoneNumber}</span>
                  </div>
                  <span className="text-sm text-[#666666] mt-1">Available 24/7</span>
                </div>
              </div>
            </div>

            {/* Care types */}
            <div className="flex flex-wrap gap-2 mb-6">
              {community.careTypes.map((careType) => (
                <span
                  key={careType}
                  className="inline-block bg-[#f1f6f0] rounded-full px-3 py-1 text-sm font-medium text-[#1b4d70]"
                >
                  {careType}
                </span>
              ))}
            </div>

            {/* Tab content */}
            <div className="mb-8">
              {activeTab === "about" && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-[#1b4d70]">About {community.name}</h2>
                  <p className="text-[#333333] mb-6">{community.description}</p>

                  <div className="bg-[#f1f6f0] rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4 text-[#1b4d70]">Community Highlights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {community.amenities.slice(0, 6).map((amenity) => (
                        <div key={amenity} className="flex items-center">
                          <FiCheck className="text-[#A7C4A0] mr-2" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "amenities" && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-[#1b4d70]">Amenities</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {community.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center p-3 bg-[#f1f6f0] rounded-lg">
                        <div className="w-8 h-8 bg-[#A7C4A0] text-[#1b4d70] rounded-full flex items-center justify-center mr-3">
                          <FiCheck />
                        </div>
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>

                  <h2 className="text-xl font-semibold mb-4 text-[#1b4d70]">Services</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {community.services.map((service) => (
                      <div key={service} className="flex items-center p-3 bg-[#f1f6f0] rounded-lg">
                        <div className="w-8 h-8 bg-[#A7C4A0] text-[#1b4d70] rounded-full flex items-center justify-center mr-3">
                          <FiCheck />
                        </div>
                        <span>{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-[#1b4d70]">Reviews</h2>
                    <div className="flex items-center bg-[#f1f6f0] px-4 py-2 rounded-lg">
                      <FiStar className="text-[#F5A623] fill-[#F5A623]" />
                      <span className="ml-1 font-medium">{community.rating}</span>
                      <span className="ml-1 text-[#666666]">({community.reviewCount} reviews)</span>
                    </div>
                  </div>

                  <TestimonialSlider testimonials={community.testimonials} />
                </div>
              )}

              {activeTab === "location" && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-[#1b4d70]">Location</h2>
                  <div className="mb-4">
                    <p className="text-[#333333]">{community.address}</p>
                  </div>

                  <div className="relative h-80 rounded-lg overflow-hidden border border-[#A7C4A0] mb-6">
                    {/* This would be a real map in production */}
                    <div className="absolute inset-0 bg-[#f1f6f0] flex items-center justify-center">
                      <p className="text-[#1b4d70]">Map would be displayed here</p>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-3 text-[#1b4d70]">Nearby Attractions</h3>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center text-[#333333]">
                      <FiMap className="text-[#A7C4A0] mr-2" />
                      <span>Cleveland Clinic - 1.2 miles</span>
                    </li>
                    <li className="flex items-center text-[#333333]">
                      <FiMap className="text-[#A7C4A0] mr-2" />
                      <span>Riverside Shopping Center - 0.8 miles</span>
                    </li>
                    <li className="flex items-center text-[#333333]">
                      <FiMap className="text-[#A7C4A0] mr-2" />
                      <span>City Park - 0.5 miles</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Right column - Contact form */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl border border-[#A7C4A0] shadow-md p-6 sticky top-[150px]">
              <h2 className="text-xl font-semibold mb-4 text-[#1b4d70]">Contact {community.name}</h2>

              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <FiPhoneCall className="text-[#1b4d70] mr-2" />
                  <span className="font-medium">Call directly: {community.phoneNumber}</span>
                </div>
                <span className="text-sm text-[#666666] block ml-6">Available 24/7</span>
              </div>

              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-[#1b4d70] font-medium mb-1">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full p-3 border border-[#A7C4A0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4d70] focus:border-transparent"
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-[#1b4d70] font-medium mb-1">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full p-3 border border-[#A7C4A0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4d70] focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-[#1b4d70] font-medium mb-1">Your Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full p-3 border border-[#A7C4A0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4d70] focus:border-transparent"
                    placeholder="(555) 555-5555"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-[#1b4d70] font-medium mb-1">Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full p-3 border border-[#A7C4A0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4d70] focus:border-transparent"
                    placeholder="I'm interested in learning more about your community..."
                  />
                </div>

                <div className="flex flex-col space-y-3">
                  <button type="submit" className="w-full bg-[#1b4d70] text-white py-3 px-4 rounded-md hover:bg-[#2F5061] transition">
                    Send Message
                  </button>

                  <button
                    type="button"
                    onClick={openTourScheduler}
                    className="w-full flex items-center justify-center bg-[#F5A623] text-[#1b4d70] py-3 px-4 rounded-md hover:bg-[#FFC65C] transition"
                  >
                    <FiCalendar className="mr-2" />
                    Schedule a Tour
                  </button>

                  <Link
                    href={`/compare?add=${community.id}`}
                    className="w-full flex items-center justify-center bg-white border border-[#1b4d70] text-[#1b4d70] py-3 px-4 rounded-md hover:bg-[#f1f6f0] transition"
                  >
                    Add to Comparison
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Referral CTA at bottom */}
      <div className="container mx-auto px-6 md:px-10 lg:px-20 mt-16">
        <ReferralCTA variant="compact" />
      </div>

      {/* Mobile actions bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#A7C4A0] p-4 flex justify-between md:hidden">
        <a
          href={`tel:${community.phoneNumber.replace(/[^0-9]/g, '')}`}
          className="flex-1 flex items-center justify-center bg-[#1b4d70] text-white py-2 px-4 rounded-md mr-2"
        >
          <FiPhoneCall className="mr-2" />
          <span>Call</span>
        </a>
        <button
          onClick={openTourScheduler}
          className="flex-1 flex items-center justify-center bg-[#F5A623] text-[#1b4d70] py-2 px-4 rounded-md ml-2"
        >
          <FiCalendar className="mr-2" />
          <span>Schedule Tour</span>
        </button>
      </div>

      {/* Tour Scheduler Modal */}
      {showTourScheduler && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b border-[#A7C4A0] flex justify-between items-center">
              <h3 className="font-semibold text-[#1b4d70]">Schedule a Tour</h3>
              <button
                onClick={closeTourScheduler}
                className="text-[#666666] hover:text-[#1b4d70] p-2"
                aria-label="Close modal"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="p-4">
              <TourScheduler
                communityName={community.name}
                communityId={community.id}
                onClose={closeTourScheduler}
              />
            </div>
          </div>
        </div>
      )}

      {/* Custom styles for the scrollbar */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
