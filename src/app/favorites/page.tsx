"use client";

import { useState, useEffect, ChangeEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { FiHeart, FiStar, FiMapPin, FiFilter, FiArrowLeft, FiTrash2, FiLoader, FiSquare, FiCheckSquare } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import FavoriteButton from '@/components/FavoriteButton';
import type { Community } from '@/types/community';
import { parseServices, deriveCommunityType } from '@/lib/utils/communityUtils';
import { useComparison } from '@/context/ComparisonContext';
import CompareFloatingButton from "@/components/CompareFloatingButton";

// Add a debugging function to inspect the favorited communities
const logCommunityData = (community: any) => {
  console.log("Community data structure:", {
    id: community.id,
    name: community.name,
    slug: community.slug,
    imageUrl: community.imageUrl,
    description: community.description,
    services: community.services
  });
};

export default function FavoritesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { 
    comparisonItems, 
    addToComparison, 
    removeFromComparison, 
    isInComparison, 
    clearComparison 
  } = useComparison();
  const [favoritedCommunities, setFavoritedCommunities] = useState<Community[]>([]);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);

  // Load favorited communities
  useEffect(() => {
    const fetchFavoritedCommunities = async () => {
      setIsLoading(true);
      setFavoritedCommunities([]);
      let favIds: string[] = [];

      console.log("FavoritesPage: useEffect triggered");

      if (user) {
        favIds = user.favorites;
        console.log("FavoritesPage: Using user context favorites:", favIds);
      } else {
        console.log("FavoritesPage: User not logged in, checking localStorage");
        const localFavorites = localStorage.getItem("favorites");
        if (localFavorites) {
          console.log("FavoritesPage: Found localFavorites string:", localFavorites);
          try {
            const parsedFavs = JSON.parse(localFavorites) as string[];
            if (Array.isArray(parsedFavs) && parsedFavs.every(id => typeof id === 'string')) {
              favIds = parsedFavs;
              console.log("FavoritesPage: Parsed localFavorites successfully:", favIds);
            } else {
               console.warn("Invalid format in localStorage favorites. Expected string[].");
               localStorage.removeItem("favorites");
            }
          } catch (error) {
            console.error("Failed to parse local favorites", error);
            localStorage.removeItem("favorites");
          }
        } else {
           console.log("FavoritesPage: No favorites found in localStorage");
        }
      }

      // Fetch communities from API if favIds exist
      if (favIds.length > 0) {
        try {
          console.log("FavoritesPage: Requesting communities with IDs:", favIds);
          const response = await fetch(`/api/providers?ids=${favIds.join(',')}`);
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error(`API error (${response.status}): ${errorText || response.statusText}`);
            throw new Error(`API error: ${response.statusText}`);
          }
          
          const data = await response.json();
          console.log("FavoritesPage: FULL API response:", data);
          
          // Ensure the fetched data matches the Community type structure
          if (data && Array.isArray(data.communities)) {
            console.log(`FavoritesPage: Received ${data.communities.length} communities from API`);
            
            // Log the first community to help debug structure issues
            if (data.communities.length > 0) {
              logCommunityData(data.communities[0]);
            }
            
            setFavoritedCommunities(data.communities);
          } else {
            console.error("Fetched data format mismatch:", data);
            setFavoritedCommunities([]); // Set to empty if format is wrong
          }
        } catch (error) {
          console.error("Error fetching favorited communities:", error);
          setFavoritedCommunities([]); // Set to empty on error
        }
      } else {
        setFavoritedCommunities([]); // Set to empty if no favIds
      }
      
      setIsLoading(false);
    };

    fetchFavoritedCommunities();

  }, [user]);

  const handleComparisonChange = (communityId: string) => {
    if (isInComparison(communityId)) {
      removeFromComparison(communityId);
    } else {
      addToComparison(communityId);
    }
  };

  const handleCompare = () => {
    if (comparisonItems.length >= 2) {
      const ids = comparisonItems.join(',');
      router.push(`/compare?ids=${ids}`);
    }
  };

  const selectAll = () => {
    favoritedCommunities.forEach(community => {
      if (!isInComparison(community.id)) {
        addToComparison(community.id);
      }
    });
  };

  const clearSelection = () => {
    clearComparison();
  };

  return (
    <div className="bg-[#FAFAF5] min-h-screen">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center mb-2">
              <Link
                href="/"
                className="text-[#1b4d70] hover:text-[#2F5061] flex items-center mr-3"
              >
                <FiArrowLeft className="mr-1" />
                <span>Back to Home</span>
              </Link>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#1b4d70]">My Favorites</h1>
            <p className="text-[#333333] mt-1">
              {isLoading 
                ? 'Loading...' 
                : `${favoritedCommunities.length} saved senior living ${favoritedCommunities.length === 1 ? 'community' : 'communities'}`}
            </p>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto">
            {/* View toggle */}
            <div className="bg-white border border-[#A7C4A0] rounded-lg p-1 flex">
              <button
                onClick={() => setView('grid')}
                className={`px-3 py-1.5 rounded ${view === 'grid' ? 'bg-[#1b4d70] text-white' : 'text-[#333333]'}`}
              >
                Grid
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-3 py-1.5 rounded ${view === 'list' ? 'bg-[#1b4d70] text-white' : 'text-[#333333]'}`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Selection controls & actions */}
        {favoritedCommunities.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-[#A7C4A0] p-4 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-[#333333]">
                  {comparisonItems.length} of {favoritedCommunities.length} selected for comparison
                </span>
                <button
                  onClick={selectAll}
                  className="text-[#1b4d70] text-sm font-medium hover:underline"
                >
                  Select All for Comparison
                </button>
                {comparisonItems.length > 0 && (
                  <button
                    onClick={clearSelection}
                    className="text-[#F5A623] text-sm font-medium hover:underline"
                  >
                    Clear Comparison Selection
                  </button>
                )}
              </div>

              {comparisonItems.length >= 2 && (
                <button
                  onClick={handleCompare}
                  className="bg-[#1b4d70] text-white px-4 py-2 rounded-lg flex items-center"
                >
                  Compare Selected ({comparisonItems.length})
                </button>
              )}
            </div>
          </div>
        )}

        {/* Favorites content */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <FiLoader className="animate-spin text-[#1b4d70]" size={48} />
          </div>
        ) : favoritedCommunities.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-[#A7C4A0] p-8 text-center">
            <FiHeart size={48} className="mx-auto text-[#A7C4A0] mb-4" />
            <h2 className="text-xl font-semibold text-[#1b4d70] mb-2">No saved communities yet</h2>
            <p className="text-[#333333] mb-6 max-w-lg mx-auto">
              Save communities you like by clicking the heart icon. Your favorites will be stored here so you can easily compare and revisit them later.
            </p>
            <Link
              href="/"
              className="inline-block bg-[#1b4d70] text-white px-6 py-3 rounded-md hover:bg-[#2F5061] transition"
            >
              Browse Communities
            </Link>
          </div>
        ) : view === 'grid' ? (
          // Grid view
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoritedCommunities.map((community) => {
              const imageUrl = community.imageUrl ?? '/images/hero-banner.png';
              const displayType = deriveCommunityType(community.description, community.services);
              const rating = 0;
              const isChecked = isInComparison(community.id);

              return (
                <div key={community.id} className="bg-white rounded-xl shadow-sm border border-[#A7C4A0] overflow-hidden relative group">
                  <label 
                    className="absolute top-3 left-3 z-20 cursor-pointer p-1.5 bg-white/80 hover:bg-white rounded-md shadow transition-opacity opacity-0 group-hover:opacity-100 focus-within:opacity-100" 
                    onClick={(e) => e.stopPropagation()}
                    htmlFor={`compare-fav-${community.id}`}
                  >
                    <input
                      type="checkbox"
                      id={`compare-fav-${community.id}`}
                      checked={isChecked}
                      onChange={() => handleComparisonChange(community.id)}
                      className="hidden"
                      aria-label={`Select ${community.name} for comparison`}
                    />
                    {isChecked ? (
                      <FiCheckSquare size={20} className="text-blue-600" />
                    ) : (
                      <FiSquare size={20} className="text-gray-500" />
                    )}
                  </label>

                  <div className="absolute top-3 right-3 z-10">
                    <FavoriteButton
                      providerId={community.id}
                      providerName={community.name}
                    />
                  </div>

                  <Link href={`/provider/${community.slug}`}>
                    <div className="relative aspect-[16/10] w-full">
                      <Image
                        src={imageUrl}
                        alt={community.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                        className="object-cover"
                      />
                      <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-xs">
                        {displayType}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-[#1b4d70] line-clamp-1">{community.name}</h3>

                      <div className="flex items-center text-sm mt-1 mb-2">
                        <FiStar className="text-[#F5A623] fill-[#F5A623]" />
                        <span className="ml-1 font-medium">{rating}</span>
                        <span className="text-gray-400 text-xs ml-1">
                          ({community.reviewCount || 0} reviews)
                        </span>
                      </div>

                      <div className="flex items-center text-gray-500 text-sm">
                        <FiMapPin size={14} className="mr-1 flex-shrink-0" />
                        <span className="truncate">{community.city}, {community.state}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          // List view
          <div className="space-y-4">
            {favoritedCommunities.map((community) => {
              const imageUrl = community.imageUrl ?? '/images/hero-banner.png';
              const displayType = deriveCommunityType(community.description, community.services);
              const rating = 0;
              const amenitiesList = parseServices(community.services);
              const isChecked = isInComparison(community.id);

              return (
                <div key={community.id} className="bg-white rounded-xl shadow-sm border border-[#A7C4A0] overflow-hidden group">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative md:w-1/3 h-[200px] md:h-auto">
                      <label 
                        className="absolute top-3 left-3 z-20 cursor-pointer p-1.5 bg-white/80 hover:bg-white rounded-md shadow transition-opacity opacity-0 group-hover:opacity-100 focus-within:opacity-100" 
                        onClick={(e) => e.stopPropagation()}
                        htmlFor={`compare-fav-list-${community.id}`}
                      >
                        <input
                          type="checkbox"
                          id={`compare-fav-list-${community.id}`}
                          checked={isChecked}
                          onChange={() => handleComparisonChange(community.id)}
                          className="hidden"
                          aria-label={`Select ${community.name} for comparison`}
                        />
                        {isChecked ? (
                          <FiCheckSquare size={20} className="text-blue-600" />
                        ) : (
                          <FiSquare size={20} className="text-gray-500" />
                        )}
                      </label>

                      <Image
                        src={imageUrl}
                        alt={community.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover"
                      />

                      <div className="absolute top-3 right-3 z-10">
                        <FavoriteButton
                          providerId={community.id}
                          providerName={community.name}
                        />
                      </div>

                      <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-xs">
                        {displayType}
                      </div>
                    </div>

                    <div className="p-4 md:p-6 flex-1">
                      <Link href={`/provider/${community.slug}`} className="hover:underline">
                        <h3 className="font-semibold text-xl text-[#1b4d70]">{community.name}</h3>
                      </Link>

                      <div className="flex items-center text-sm mt-1 mb-2">
                        <FiStar className="text-[#F5A623] fill-[#F5A623]" />
                        <span className="ml-1 font-medium">{rating}</span>
                        <span className="text-gray-400 text-xs ml-1">
                          ({community.reviewCount || 0} reviews)
                        </span>
                      </div>

                      <div className="flex items-center text-gray-500 text-sm mb-3">
                        <FiMapPin size={14} className="mr-1 flex-shrink-0" />
                        <span>{community.city}, {community.state}</span>
                      </div>

                      {amenitiesList && amenitiesList.length > 0 && (
                        <div className="mt-2 space-y-1">
                          <h4 className="text-sm font-medium text-[#333333] mb-1">Amenities:</h4>
                          <div className="flex flex-wrap gap-2">
                            {amenitiesList.slice(0, 3).map((amenity: string, i: number) => (
                              <span key={`${community.id}-${i}`} className="text-xs bg-[#f1f6f0] text-[#1b4d70] px-2 py-1 rounded">
                                {amenity}
                              </span>
                            ))}
                            {amenitiesList.length > 3 && (
                              <span className="text-xs bg-[#f1f6f0] text-[#1b4d70] px-2 py-1 rounded">
                                +{amenitiesList.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="mt-4 flex gap-2">
                        <Link
                          href={`/provider/${community.slug}`}
                          className="bg-[#1b4d70] text-white px-4 py-2 rounded-lg text-sm"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <CompareFloatingButton />
    </div>
  );
}
