"use client";

import React from "react";
import { useComparison, type Community } from "@/context/ComparisonContext";
import Image from "next/image";
import Link from "next/link";
import { FiCheck, FiX, FiArrowLeft, FiMapPin, FiPhone, FiTrash2 } from "react-icons/fi";

export default function ComparePage() {
  const { comparedCommunities, removeFromComparison, clearComparison } = useComparison();

  // Features to compare
  const featureCategories = [
    {
      name: "Basic Information",
      features: [
        { name: "Community Type", accessor: "type" },
        { name: "Location", accessor: "city" },
        { name: "Rating", accessor: "rating" }
      ]
    },
    {
      name: "Amenities",
      features: [
        { name: "24-Hour Staff", key: "24-Hour Staff" },
        { name: "Fitness Center", key: "Fitness Center" },
        { name: "Transportation Services", key: "Transportation Services" },
        { name: "Housekeeping", key: "Housekeeping" },
        { name: "Dining Options", key: "Chef-Prepared Meals" },
        { name: "Library", key: "Library" },
        { name: "Garden/Outdoor Space", key: "Outdoor Garden" },
        { name: "Beauty Salon", key: "Beauty Salon" },
        { name: "Social Activities", key: "Social Activities" },
        { name: "Pet Friendly", key: "Pet Friendly" }
      ]
    }
  ];

  // Helper function to check if an amenity exists
  const hasAmenity = (community: Community, amenityKey: string) => {
    return community.amenities?.some((amenity: string) =>
      amenity.toLowerCase().includes(amenityKey.toLowerCase())
    );
  };

  return (
    <main className="container mx-auto px-4 py-8 bg-[#FAFAF5]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1b4d70]">Compare Communities</h1>
          <p className="text-[#333333] mt-1">Compare senior living communities side by side to find the best fit</p>
        </div>
        <Link
          href="/search"
          className="flex items-center text-[#1b4d70] hover:text-[#2F5061] transition"
        >
          <FiArrowLeft className="mr-2" />
          Back to Search
        </Link>
      </div>

      {comparedCommunities.length === 0 ? (
        <div className="text-center py-16 bg-[#f1f6f0] rounded-lg">
          <h2 className="text-xl font-semibold mb-3 text-[#1b4d70]">No Communities to Compare</h2>
          <p className="text-[#333333] mb-6">
            You haven't added any communities to compare yet. Browse communities and click "Add to Compare" to get started.
          </p>
          <Link
            href="/search"
            className="inline-block bg-[#1b4d70] text-white px-6 py-3 rounded-md hover:bg-[#2F5061] transition"
          >
            Browse Communities
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="w-full min-w-[800px]">
              {/* Header */}
              <thead>
                <tr className="border-b border-[#A7C4A0]">
                  <th className="p-4 text-left w-1/4 bg-[#f1f6f0]" />
                  {comparedCommunities.map((community) => (
                    <th key={community.id} className="p-4 text-center border-l border-[#A7C4A0]">
                      <div className="relative">
                        <button
                          onClick={() => removeFromComparison(community.id)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-[#F5A623]/20 text-[#F5A623] rounded-full flex items-center justify-center hover:bg-[#F5A623]/30 transition"
                          aria-label={`Remove ${community.name} from comparison`}
                        >
                          <FiX size={14} />
                        </button>
                        <div className="relative h-40 mb-4">
                          <Image
                            src={community.image}
                            alt={community.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <h3 className="text-lg font-semibold text-[#1b4d70]">{community.name}</h3>
                        <p className="text-[#333333] text-sm flex items-center justify-center mt-1">
                          <FiMapPin className="mr-1 text-[#1b4d70]" size={14} />
                          {community.city}, {community.state}
                        </p>
                        <div className="mt-3">
                          <Link
                            href={`/provider/${community.slug}`}
                            className="text-[#1b4d70] text-sm font-medium hover:text-[#2F5061] transition"
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
                    <tr className="bg-[#f1f6f0]">
                      <td colSpan={comparedCommunities.length + 1} className="p-4 font-semibold text-[#1b4d70]">
                        {category.name}
                      </td>
                    </tr>

                    {/* Category Features */}
                    {category.features.map((feature) => (
                      <tr key={feature.name} className="border-b border-[#A7C4A0]">
                        <td className="p-4 text-[#1b4d70] font-medium bg-[#f1f6f0]">{feature.name}</td>
                        {comparedCommunities.map((community) => (
                          <td key={community.id} className="p-4 text-center border-l border-[#A7C4A0]">
                            {/* For basic information */}
                            {"accessor" in feature ? (
                              <span className="text-[#333333]">
                                {feature.accessor === "rating" ? (
                                  <span className="font-medium">
                                    {community[feature.accessor as keyof typeof community]}
                                    <span className="text-[#A7C4A0]">/5</span>
                                  </span>
                                ) : (
                                  community[feature.accessor as keyof typeof community] || "Not available"
                                )}
                              </span>
                            ) : (
                              /* For amenities */
                              hasAmenity(community, feature.key) ? (
                                <span className="text-[#7B9E89]">
                                  <FiCheck className="mx-auto" size={20} />
                                </span>
                              ) : (
                                <span className="text-[#F5A623]/50">
                                  <FiX className="mx-auto" size={18} />
                                </span>
                              )
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}

                {/* Contact Row */}
                <tr className="border-b border-[#A7C4A0]">
                  <td className="p-4 text-[#1b4d70] font-medium bg-[#f1f6f0]">Contact</td>
                  {comparedCommunities.map((community) => (
                    <td key={community.id} className="p-4 text-center border-l border-[#A7C4A0]">
                      <Link
                        href={`tel:${community.phone || '555-123-4567'}`}
                        className="flex items-center justify-center gap-2 bg-[#1b4d70] text-white px-4 py-2 rounded-md hover:bg-[#2F5061] transition mx-auto w-36"
                      >
                        <FiPhone size={16} />
                        <span>Call</span>
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Clear button */}
          <div className="mt-6 text-right">
            <button
              onClick={clearComparison}
              className="flex items-center text-[#F5A623] hover:text-[#FFC65C] transition ml-auto"
            >
              <FiTrash2 className="mr-2" />
              Clear All
            </button>
          </div>
        </>
      )}
    </main>
  );
}
