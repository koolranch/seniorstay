"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiMapPin, FiMail, FiStar, FiCheck, FiPhone, FiCalendar } from "react-icons/fi";
import { Community } from '../../../../../lib/data/communities';

interface CommunityClientProps {
  params: {
    state: string;
    city: string;
    slug: string;
  };
  communities: Community[];
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1519974719765-e6559eac2575?q=80&w=2070&auto=format&fit=crop";

export default function CommunityClient({ params, communities }: CommunityClientProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [imageError, setImageError] = useState(false);

  try {
    console.log('CommunityClient: Rendering with params:', 
      params ? JSON.stringify(params, null, 2) : 'params is undefined');
    
    // Safety check for props
    if (!params || !communities || !Array.isArray(communities)) {
      console.error('CommunityClient: Invalid props received:', { params, communitiesValid: Array.isArray(communities) });
      return (
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">Invalid Data</h1>
              <p className="mt-4 text-lg text-gray-600">
                We couldn't load the community information due to a data error.
              </p>
              <Link
                href="/community"
                className="mt-8 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Back to Communities
              </Link>
            </div>
          </div>
        </div>
      );
    }
    
    const community = communities.find(
      (c) =>
        c.state.toLowerCase() === params.state.toLowerCase() &&
        c.city.toLowerCase() === params.city.toLowerCase() &&
        c.slug === params.slug
    );

    if (!community) {
      console.error('CommunityClient: Community not found for params:', JSON.stringify(params, null, 2));
      return (
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">Community Not Found</h1>
              <p className="mt-4 text-lg text-gray-600">
                The requested senior living community could not be found.
              </p>
              <Link
                href="/community"
                className="mt-8 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Back to Communities
              </Link>
            </div>
          </div>
        </div>
      );
    }

    // Verify community has all required properties
    const requiredProps = {
      name: !!community.name,
      city: !!community.city,
      state: !!community.state,
      amenities: Array.isArray(community.amenities),
      image: !!community.image,
      description: !!community.description
    };
    
    console.log('CommunityClient: Community found with properties:', requiredProps);

    // Safe property access with fallbacks
    const name = community.name || 'Senior Living Community';
    const description = community.description || 'Information about this community is currently being updated.';
    const amenities = Array.isArray(community.amenities) ? community.amenities : [];
    const imageSrc = imageError ? FALLBACK_IMAGE : (community.image || FALLBACK_IMAGE);
    const address = community.address || 'Address information coming soon';
    const rating = community.rating || 'N/A';

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
              {["overview", "amenities", "contact"].map((tab) => (
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
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <FiStar className="h-6 w-6 text-yellow-400 mr-2" />
                  <span className="text-gray-700">Rating: {rating}/5</span>
                </div>
              </div>
            </div>
          </section>

          <section id="amenities-panel" role="tabpanel" aria-labelledby="amenities-tab" hidden={activeTab !== "amenities"}>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
            {amenities.length > 0 ? (
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {amenities.map((amenity, index) => (
                  <li
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center"
                  >
                    <FiCheck className="text-green-500 mr-2" />
                    <span className="text-gray-700">{amenity}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Amenity information is being updated.</p>
            )}
          </section>

          <section id="contact-panel" role="tabpanel" aria-labelledby="contact-tab" hidden={activeTab !== "contact"}>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <FiMapPin className="h-6 w-6 text-gray-400 mr-2" />
                <span className="text-gray-700">{address}</span>
              </div>
              <div className="flex items-center mb-4">
                <FiPhone className="h-6 w-6 text-gray-400 mr-2" />
                <a href="tel:2162323354" className="text-gray-700 hover:text-[#1b4d70]">(216) 232-3354</a>
              </div>
              <div className="flex items-center">
                <FiMail className="h-6 w-6 text-gray-400 mr-2" />
                <span className="text-gray-700">
                  info@{community.name ? community.name.toLowerCase().replace(/\s+/g, '') : 'seniorstay'}.com
                </span>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Schedule a Tour</h3>
              <p className="text-gray-600 mb-4">
                We'd love to show you around our community. Schedule a tour today to see all that {name} has to offer.
              </p>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center"
                aria-label={`Schedule a tour at ${name}`}
              >
                <FiCalendar className="mr-2" />
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
              href="/community"
              className="mt-8 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Back to Communities
            </Link>
          </div>
        </div>
      </div>
    );
  }
} 