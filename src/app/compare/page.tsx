"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useComparison } from "@/context/ComparisonContext";
import type { Community } from "@/types/community";
import Image from "next/image";
import Link from "next/link";
import { FiCheck, FiX, FiArrowLeft, FiMapPin, FiPhone, FiTrash2, FiLoader } from "react-icons/fi";

// Define the structure for feature comparison
interface Feature {
  name: string;
  accessor?: keyof Community; // Direct property access
  key?: string; // For checking within arrays like amenities
}

interface FeatureCategory {
  name: string;
  features: Feature[];
}

const featureCategories: FeatureCategory[] = [
  {
    name: "Basic Information",
    features: [
      { name: "Location", accessor: "city" },
    ],
  },
  {
    name: "Care Services", // Define specific services to compare from the services string
    features: [
      { name: "Assisted Living", key: "Assisted Living" },
      { name: "Memory Care", key: "Memory Care" },
      { name: "Independent Living", key: "Independent Living" },
      { name: "Skilled Nursing", key: "Skilled Nursing" },
      { name: "Rehabilitation", key: "Rehabilitation" }, // Added example
    ],
  },
];

// Helper function to check if a service exists in the comma-separated string
const hasFeature = (community: Community, featureKey: string) => {
  if (!community.services || typeof community.services !== 'string') {
    return false;
  }
  // Split the string and check for the feature (case-insensitive)
  const servicesList = community.services.split(',').map(s => s.trim());
  return servicesList.some((item) =>
    item.toLowerCase().includes(featureKey.toLowerCase())
  );
};

// --- Compare Page Content Component ---
function ComparePageContent() {
  const { comparisonItems, removeFromComparison, clearComparison } = useComparison();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const ids = searchParams.get('ids');
    
    if (!ids) {
      // If URL has no IDs, rely on context (might be empty)
      console.log("ComparePage: No IDs in URL, checking context.");
      // Check if context has items (maybe navigated directly)
      if (comparisonItems.length > 0) {
        // Fetch based on context items if URL is empty
         fetchCommunities(comparisonItems);
      } else {
         setIsLoading(false);
         setCommunities([]); // Ensure communities array is empty
      }
      return; 
    }

    // Fetch communities based on IDs from URL
    const idArray = ids.split(',').map(id => id.trim()).filter(Boolean);
    if (idArray.length > 0) {
      fetchCommunities(idArray);
    } else {
       console.log("ComparePage: No valid IDs found after parsing URL.");
       setIsLoading(false);
       setCommunities([]);
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // Rerun when URL query params change
  
  // Fetch communities function
  const fetchCommunities = async (idsToFetch: string[]) => {
    setIsLoading(true);
    setError(null);
    console.log("ComparePage: Fetching communities for IDs:", idsToFetch);
    try {
      const response = await fetch(`/api/providers?ids=${idsToFetch.join(',')}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch communities: ${response.statusText}`);
      }
      const data = await response.json();
      if (data && Array.isArray(data.communities)) {
        console.log(`ComparePage: Received ${data.communities.length} communities.`);
        setCommunities(data.communities);
      } else {
        console.error("Invalid data format received from API:", data);
        throw new Error("Invalid data format received.");
      }
    } catch (err: any) {
      console.error("Error fetching comparison data:", err);
      setError(err.message || "Could not load community data.");
      setCommunities([]);
    } finally {
      setIsLoading(false);
    }
  };
  
   // Handle removing an item: remove from context AND refetch/filter displayed data
  const handleRemove = (idToRemove: string) => {
    removeFromComparison(idToRemove); // Update context
    setCommunities(prev => prev.filter(c => c.id !== idToRemove)); // Update local state immediately
  };

  // Handle clearing all: clear context AND local state
  const handleClearAll = () => {
    clearComparison(); // Update context
    setCommunities([]); // Clear local state
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <FiLoader className="animate-spin text-[#1b4d70]" size={48} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-16 bg-red-50 rounded-lg border border-red-200">
        <h2 className="text-xl font-semibold mb-3 text-red-700">Error Loading Comparison</h2>
        <p className="text-red-600 mb-6">{error}</p>
        <Link
          href="/"
          className="inline-block bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition"
        >
          Go Back Home
        </Link>
      </div>
    );
  }

  // No communities selected state
  if (communities.length === 0) {
    return (
      <div className="text-center py-16 bg-[#f1f6f0] rounded-lg">
        <h2 className="text-xl font-semibold mb-3 text-[#1b4d70]">No Communities to Compare</h2>
        <p className="text-[#333333] mb-6">
          You haven't selected any communities to compare. Browse communities and use the checkbox to add them.
        </p>
        <Link
          href="/"
          className="inline-block bg-[#1b4d70] text-white px-6 py-3 rounded-md hover:bg-[#2F5061] transition"
          aria-label="Browse Communities"
        >
          Browse Communities
        </Link>
      </div>
    );
  }

  // Main comparison table display
  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full min-w-[800px]">
          {/* Header */}
          <thead>
            <tr className="border-b border-[#A7C4A0]">
              <th className="p-4 text-left w-1/4 bg-[#f1f6f0] sticky left-0 z-10">Feature</th>
              {communities.map((community) => (
                <th key={community.id} className="p-4 text-center border-l border-[#A7C4A0]">
                  <div className="relative">
                    <button
                      onClick={() => handleRemove(community.id)} // Use updated remove handler
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition"
                      aria-label={`Remove ${community.name} from comparison`}
                    >
                      <FiX size={14} />
                    </button>
                    <div className="relative h-32 mb-3 mx-auto w-full max-w-[200px]">
                      <Image
                        src={community.imageUrl || "/images/hero-banner.png"} // Use imageUrl
                        alt={community.name ?? 'Community image'}
                        fill
                        sizes="200px"
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <h3 className="text-base font-semibold text-[#1b4d70] line-clamp-2">{community.name}</h3>
                    <p className="text-gray-500 text-xs flex items-center justify-center mt-1">
                      <FiMapPin className="mr-1 text-[#1b4d70]" size={12} />
                      {community.city}, {community.state}
                    </p>
                    <div className="mt-2">
                      <Link
                        href={`/provider/${community.slug}`}
                        className="text-blue-600 text-xs font-medium hover:underline transition"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {featureCategories.map((category) => (
              <React.Fragment key={category.name}>
                {/* Category Header */}
                <tr className="bg-gray-50">
                  <td colSpan={communities.length + 1} className="p-3 font-semibold text-gray-700 sticky left-0 z-10 bg-gray-50">
                    {category.name}
                  </td>
                </tr>

                {/* Category Features */}
                {category.features.map((feature) => (
                  <tr key={feature.name} className="border-b border-gray-200 hover:bg-gray-50/50">
                    <td className="p-3 text-gray-600 font-medium bg-white sticky left-0 z-10">{feature.name}</td>
                    {communities.map((community) => (
                      <td key={`${community.id}-${feature.name}`} className="p-3 text-center border-l border-gray-200">
                        {feature.accessor ? (
                          // Handle direct accessors (basic info)
                          <span className="text-gray-800 text-sm">
                            {String(community[feature.accessor] ?? '-')} 
                          </span>
                        ) : feature.key ? (
                          // Handle key-based checks (services string)
                          hasFeature(community, feature.key) ? (
                            <span className="text-green-600">
                              <FiCheck className="mx-auto" size={18} />
                            </span>
                          ) : (
                            <span className="text-gray-400">
                              <FiX className="mx-auto" size={16} />
                            </span>
                          )
                        ) : (
                           '-' 
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}

            {/* Contact Row */}
            <tr className="border-t border-gray-300">
              <td className="p-3 text-gray-600 font-medium bg-white sticky left-0 z-10">Contact</td>
              {communities.map((community) => (
                <td key={`${community.id}-contact`} className="p-3 text-center border-l border-gray-200">
                  <a
                    className="inline-flex items-center text-blue-600 text-xs font-medium hover:underline mb-1"
                    href={`tel:${community.phone || ''}`}
                    aria-label={`Call ${community.name}`}
                  >
                    <FiPhone size={12} />
                    <span className="ml-1">{community.phone || "N/A"}</span>
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Clear button */}
      <div className="mt-6 text-right">
        <button
          onClick={handleClearAll} // Use updated clear handler
          className="inline-flex items-center text-red-600 hover:text-red-800 transition text-sm"
        >
          <FiTrash2 className="mr-1" size={14} />
          Clear Comparison
        </button>
      </div>
    </>
  );
}

// --- Main Page Component with Suspense ---
export default function ComparePage() {
  return (
    <main className="container mx-auto px-4 py-8 bg-[#FAFAF5]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1b4d70]">Compare Communities</h1>
          <p className="text-[#333333] mt-1">Compare senior living communities side by side to find the best fit</p>
        </div>
        <Link
          href="/"
          className="flex items-center text-[#1b4d70] hover:text-[#2F5061] transition"
        >
          <FiArrowLeft className="mr-2" />
          Back to Home
        </Link>
      </div>
      
      {/* Wrap the content in Suspense for useSearchParams */}
      <Suspense fallback={
        <div className="flex justify-center items-center py-20">
           <FiLoader className="animate-spin text-[#1b4d70]" size={48} />
        </div>
      }>
        <ComparePageContent />
      </Suspense>
    </main>
  );
}
