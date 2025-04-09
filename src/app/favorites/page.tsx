"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { FiHeart, FiStar, FiMapPin, FiFilter, FiArrowLeft, FiTrash2 } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import FavoriteButton from '@/components/FavoriteButton';
import type { Community } from '@/types/community';

// Mock data for favorites page - in a real app, this would come from an API
const mockCommunities: Community[] = [
  {
    id: 1,
    slug: "sunshine-meadows",
    name: "Sunshine Meadows",
    city: "Cleveland",
    state: "OH",
    type: "Independent Living",
    image: "https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=2074&auto=format&fit=crop",
    rating: 4.8,
    reviewCount: 126,
    distance: "61 miles away",
    amenities: ["Restaurant-style dining", "Fitness center", "Swimming pool", "Garden", "Pet friendly"],
  },
  {
    id: 2,
    slug: "cedar-ridge",
    name: "Cedar Ridge Retirement",
    city: "Columbus",
    state: "OH",
    type: "Assisted Living",
    image: "https://images.unsplash.com/photo-1556155092-490a1ba16284?q=80&w=2070&auto=format&fit=crop",
    rating: 4.98,
    reviewCount: 87,
    distance: "63 miles away",
    amenities: ["24/7 care staff", "Medication management", "Housekeeping", "Transportation services", "Social activities"],
  },
  {
    id: 3,
    slug: "lakeside-gardens",
    name: "Lakeside Gardens",
    city: "Cincinnati",
    state: "OH",
    type: "Memory Care",
    image: "https://images.unsplash.com/photo-1582719471384-894fbb07a271?q=80&w=2187&auto=format&fit=crop",
    rating: 4.97,
    reviewCount: 102,
    distance: "62 miles away",
    amenities: ["Specialized memory programs", "Secured environment", "Therapeutic activities", "Individualized care plans"],
  },
];

export default function FavoritesPage() {
  const { user, isFavorite } = useAuth();
  const router = useRouter();
  const [selectedCommunities, setSelectedCommunities] = useState<number[]>([]);
  const [favoritedCommunities, setFavoritedCommunities] = useState<Community[]>([]);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  // Load favorited communities
  useEffect(() => {
    if (user) {
      // In a real app, this would be a server request with user's favorites
      const userFavorites = mockCommunities.filter(community =>
        user.favorites.includes(community.id)
      );
      setFavoritedCommunities(userFavorites);
    } else {
      // For non-logged-in users, check localStorage
      const localFavorites = localStorage.getItem("favorites");
      if (localFavorites) {
        try {
          const favIds = JSON.parse(localFavorites) as number[];
          const userFavorites = mockCommunities.filter(community =>
            favIds.includes(community.id)
          );
          setFavoritedCommunities(userFavorites);
        } catch (error) {
          console.error("Failed to parse local favorites", error);
        }
      }
    }
  }, [user]);

  const handleToggleSelection = (communityId: number) => {
    setSelectedCommunities(prev => {
      if (prev.includes(communityId)) {
        return prev.filter(id => id !== communityId);
      }
      return [...prev, communityId];
    });
  };

  const handleCompare = () => {
    if (selectedCommunities.length >= 2) {
      router.push('/compare');
    }
  };

  const selectAll = () => {
    const allIds = favoritedCommunities.map(community => community.id);
    setSelectedCommunities(allIds);
  };

  const clearSelection = () => {
    setSelectedCommunities([]);
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
              {favoritedCommunities.length} saved senior living {favoritedCommunities.length === 1 ? 'community' : 'communities'}
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
                  {selectedCommunities.length} of {favoritedCommunities.length} selected
                </span>
                <button
                  onClick={selectAll}
                  className="text-[#1b4d70] text-sm font-medium hover:underline"
                >
                  Select All
                </button>
                {selectedCommunities.length > 0 && (
                  <button
                    onClick={clearSelection}
                    className="text-[#F5A623] text-sm font-medium hover:underline"
                  >
                    Clear Selection
                  </button>
                )}
              </div>

              {selectedCommunities.length >= 2 && (
                <button
                  onClick={handleCompare}
                  className="bg-[#1b4d70] text-white px-4 py-2 rounded-lg flex items-center"
                >
                  Compare Selected ({selectedCommunities.length})
                </button>
              )}
            </div>
          </div>
        )}

        {/* Favorites content */}
        {favoritedCommunities.length === 0 ? (
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
            {favoritedCommunities.map((community) => (
              <div key={community.id} className="bg-white rounded-xl shadow-sm border border-[#A7C4A0] overflow-hidden relative">
                <div className="absolute top-3 left-3 z-10">
                  <input
                    type="checkbox"
                    id={`select-${community.id}`}
                    checked={selectedCommunities.includes(community.id)}
                    onChange={() => handleToggleSelection(community.id)}
                    className="w-5 h-5 rounded border-[#A7C4A0] text-[#1b4d70] focus:ring-[#1b4d70]"
                  />
                </div>

                <div className="absolute top-3 right-3 z-10">
                  <FavoriteButton
                    providerId={community.id}
                    providerName={community.name}
                  />
                </div>

                <Link href={`/provider/${community.slug}`}>
                  <div className="relative aspect-[16/10] w-full">
                    <Image
                      src={community.image}
                      alt={community.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-xs">
                      {community.type}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-[#1b4d70] line-clamp-1">{community.name}</h3>

                    <div className="flex items-center text-sm mt-1 mb-2">
                      <FiStar className="text-[#F5A623] fill-[#F5A623]" />
                      <span className="ml-1 font-medium">{community.rating}</span>
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
            ))}
          </div>
        ) : (
          // List view
          <div className="space-y-4">
            {favoritedCommunities.map((community) => (
              <div key={community.id} className="bg-white rounded-xl shadow-sm border border-[#A7C4A0] overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="relative md:w-1/3 h-[200px] md:h-auto">
                    <Image
                      src={community.image}
                      alt={community.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 z-10">
                      <input
                        type="checkbox"
                        id={`select-list-${community.id}`}
                        checked={selectedCommunities.includes(community.id)}
                        onChange={() => handleToggleSelection(community.id)}
                        className="w-5 h-5 rounded border-[#A7C4A0] text-[#1b4d70] focus:ring-[#1b4d70]"
                      />
                    </div>
                    <div className="absolute top-3 right-3 z-10">
                      <FavoriteButton
                        providerId={community.id}
                        providerName={community.name}
                      />
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-xs">
                      {community.type}
                    </div>
                  </div>

                  <div className="p-4 md:p-6 flex-1">
                    <Link href={`/provider/${community.slug}`} className="hover:underline">
                      <h3 className="font-semibold text-xl text-[#1b4d70]">{community.name}</h3>
                    </Link>

                    <div className="flex items-center text-sm mt-1 mb-2">
                      <FiStar className="text-[#F5A623] fill-[#F5A623]" />
                      <span className="ml-1 font-medium">{community.rating}</span>
                      <span className="text-gray-400 text-xs ml-1">
                        ({community.reviewCount || 0} reviews)
                      </span>
                    </div>

                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <FiMapPin size={14} className="mr-1 flex-shrink-0" />
                      <span>{community.city}, {community.state}</span>
                    </div>

                    {community.amenities && community.amenities.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <h4 className="text-sm font-medium text-[#333333] mb-1">Amenities:</h4>
                        <div className="flex flex-wrap gap-2">
                          {community.amenities.slice(0, 3).map((amenity, i) => (
                            <span key={`${community.id}-${i}`} className="text-xs bg-[#f1f6f0] text-[#1b4d70] px-2 py-1 rounded">
                              {amenity}
                            </span>
                          ))}
                          {community.amenities.length > 3 && (
                            <span className="text-xs bg-[#f1f6f0] text-[#1b4d70] px-2 py-1 rounded">
                              +{community.amenities.length - 3} more
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
