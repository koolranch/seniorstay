"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiMapPin, FiMail, FiStar, FiCheck, FiPhone, FiCalendar } from "react-icons/fi";
import { Calendar } from 'lucide-react';
import { sendGAEvent } from '@/lib/utils/gtag'; // Import GA event function
// Import Community type from Prisma Client
import type { Community } from '@prisma/client';
// Remove old import
// import { Community } from '../../../../../lib/data/communities'; 

// Update props interface
interface CommunityClientProps {
  community: Community | null; // Expect a single community object, potentially null if not found
  // Remove old props
  // params: {
  //   state: string;
  //   city: string;
  //   slug: string;
  // };
  // communities: Community[]; 
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1519974719765-e6559eac2575?q=80&w=2070&auto=format&fit=crop";

// Update component signature to use the new props
export default function CommunityClient({ community }: CommunityClientProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [imageError, setImageError] = useState(false);

  try {
    // Log the received community prop
    console.log('CommunityClient: Rendering with community:', 
      community ? JSON.stringify({ id: community.id, name: community.name }, null, 2) : 'community is null');
    
    // Check if the community prop is valid
    if (!community) {
      console.error('CommunityClient: Community prop is null or undefined.');
      // Render a not found state consistent with the server component
      return (
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">Community Not Found</h1>
              <p className="mt-4 text-lg text-gray-600">
                The requested senior living community could not be found.
              </p>
              <Link
                href="/community" // Link to a general community listing page
                className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm md:text-base py-2 px-4 rounded-lg shadow-sm transition-all duration-200 w-full sm:w-auto inline-flex items-center justify-center mt-8"
              >
                Back to Communities
              </Link>
            </div>
          </div>
        </div>
      );
    }
    
    // Remove the .find() logic as the community is passed directly
    // const community = communities.find(
    //   (c) =>
    //     c.state.toLowerCase() === params.state.toLowerCase() &&
    //     c.city.toLowerCase() === params.city.toLowerCase() &&
    //     c.slug === params.slug
    // );
    
    // Use the community prop directly
    // Verify community has all required properties - adapt checks based on schema
    const requiredProps = {
      name: !!community.name,
      city: !!community.city,
      state: !!community.state,
      // amenities: Array.isArray(community.amenities), // Remove if amenities isn't a required array
      imageUrl: !!community.imageUrl, // Check imageUrl
      description: !!community.description
    };
    
    console.log('CommunityClient: Community prop validated with properties:', requiredProps);

    // Safe property access with fallbacks
    const name = community.name || 'Senior Living Community';
    const description = community.description || 'Information about this community is currently being updated.';
    // const amenities = Array.isArray(community.amenities) ? community.amenities : []; // Remove or adapt based on schema
    const imageSrc = imageError ? FALLBACK_IMAGE : (community.imageUrl || FALLBACK_IMAGE); // Use imageUrl
    const address = community.address || 'Address information coming soon';
    // const rating = community.rating || 'N/A'; // Remove or adapt based on schema

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative h-96">
          <Image
            src={imageSrc}
            alt={`Front exterior of ${name} senior living community in ${community.city || ''}, ${community.state || ''}`}
            fill
            sizes="100vw"
            className="object-cover"
            priority
            onError={(e) => {
              console.log('CommunityClient: Image failed to load, using fallback');
              setImageError(true);
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-4">{name}</h1>
              <p className="text-xl">
                {community.city || ''}{community.city && community.state ? ', ' : ''}{community.state || ''}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="bg-white shadow" aria-label="Community information tabs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {["overview", /*"amenities",*/ "contact"].map((tab) => ( // Remove amenities tab if not used
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  aria-selected={activeTab === tab}
                  aria-controls={`${tab}-panel`}
                  role="tab"
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Content Sections */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <section id="overview-panel" role="tabpanel" aria-labelledby="overview-tab" hidden={activeTab !== "overview"}>
            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-600">{description}</p>
              {/* Remove rating section if not applicable */}
              {/* <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <FiStar className="h-6 w-6 text-yellow-400 mr-2 drop-shadow-sm" />
                  <span className="text-gray-700 font-semibold" aria-label={`Rated ${rating} out of 5`}>Rating: {rating}/5</span>
                </div>
              </div> */}
            </div>
          </section>

          {/* Remove amenities section if not applicable */}
          {/* <section id="amenities-panel" role="tabpanel" aria-labelledby="amenities-tab" hidden={activeTab !== "amenities"}>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
            {amenities.length > 0 ? (
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {amenities.map((amenity, index) => (
                  <li
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center"
                  >
                    <FiCheck className="text-green-500 mr-2" />
                    <span className={text-gray-700}>{amenity}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Amenity information is being updated.</p>
            )}
          </section> */}

          <section id="contact-panel" role="tabpanel" aria-labelledby="contact-tab" hidden={activeTab !== "contact"}>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <FiMapPin className="h-6 w-6 text-gray-400 mr-2" />
                <span className="text-gray-700">{address}</span>
              </div>
              <div className="flex items-center mb-4">
                <FiPhone className="h-6 w-6 text-gray-400 mr-2" />
                {/* Use phone number from community data if available */}
                <a href={`tel:${community.phone || '2162323354'}`} className="text-gray-700 hover:text-[#1b4d70]">
                  {community.phone || '(216) 232-3354'}
                </a>
              </div>
              <div className="flex items-center">
                <FiMail className="h-6 w-6 text-gray-400 mr-2" />
                {/* Use email from community data if available */}
                <span className="text-gray-700">
                  {community.email || `info@${community.name ? community.name.toLowerCase().replace(/\s+/g, '') : 'seniorstay'}.com`}
                </span>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Schedule a Tour</h3>
              <p className="text-gray-600 mb-4">
                We'd love to show you around our community. Schedule a tour today to see all that {name} has to offer.
              </p>
              <button
                onClick={() => {
                  // Add original button logic here if any (e.g., open modal)
                  sendGAEvent('schedule_tour_click', name);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-full shadow-sm transition inline-flex items-center justify-center"
                aria-label={`Schedule a tour at ${name}`}
              >
                <Calendar className="w-4 h-4 inline-block mr-1 -mt-0.5" />
                Schedule a Tour
              </button>
            </div>
          </section>
        </main>
      </div>
    );
  } catch (error) {
    console.error('CommunityClient Fatal Error:', error);
    
    // Return fallback UI for any unexpected errors
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Something Went Wrong</h1>
            <p className="mt-4 text-lg text-gray-600">
              We encountered an error while displaying this community.
            </p>
            <Link
              href="/community" // Link to a general community listing page
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-full shadow-sm transition inline-flex items-center justify-center mt-8"
            >
              Back to Communities
            </Link>
          </div>
        </div>
      </div>
    );
  }
} 