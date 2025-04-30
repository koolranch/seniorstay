"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { FiUser, FiHeart, FiCalendar, FiMessageSquare, FiEdit2, FiTrash2, FiMapPin } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import type { Community } from '@/types/community';

// Mock data for profile page
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
    distance: "62 miles away",
    amenities: ["Specialized memory programs", "Secured environment", "Therapeutic activities", "Individualized care plans"],
  },
];

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'favorites' | 'referrals' | 'settings'>('favorites');
  const [favoritedCommunities, setFavoritedCommunities] = useState<Community[]>([]);
  const [selectedCommunities, setSelectedCommunities] = useState<number[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!user && typeof window !== 'undefined') {
      router.push('/');
    } else if (user) {
      setFormData({
        name: user.name || '',
        email: user.email,
      });
    }
  }, [user, router]);

  // Get favorited communities
  useEffect(() => {
    if (user) {
      // In a real application, you would fetch this data from an API
      // For now, we'll filter the mock data based on the user's favorites
      const userFavorites = mockCommunities.filter(community =>
        user.favorites.includes(community.id)
      );
      setFavoritedCommunities(userFavorites);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleToggleSelection = (communityId: number) => {
    setSelectedCommunities(prev => {
      if (prev.includes(communityId)) {
        return prev.filter(id => id !== communityId);
      }
      return [...prev, communityId];
    });
  };

  const handleCompare = () => {
    // Redirect to compare page with selected communities
    if (selectedCommunities.length > 0) {
      router.push('/compare');
    }
  };

  const handleSubmitProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    if (user) {
      updateUser({
        ...user,
        name: formData.name,
        // We don't update email for simplicity in this example
      });
      setIsEditing(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAF5] min-h-screen">
      <div className="container mx-auto py-8 px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="bg-[#1b4d70] text-white rounded-full p-8 flex items-center justify-center w-32 h-32">
              <FiUser size={48} />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-[#1b4d70]">
                {user.name || user.email.split('@')[0]}
              </h1>
              <p className="text-[#333333] mb-2">{user.email}</p>
              <p className="text-[#333333] text-sm mb-4">Member since {new Date(Number.parseInt(user.id)).toLocaleDateString()}</p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-white border border-[#1b4d70] text-[#1b4d70] px-4 py-2 rounded-lg flex items-center"
                >
                  <FiEdit2 className="mr-2" />
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-white border border-[#F5A623] text-[#F5A623] px-4 py-2 rounded-lg flex items-center"
                >
                  <FiUser className="mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h2 className="text-xl font-semibold text-[#1b4d70] mb-4">Edit Profile</h2>
              <form onSubmit={handleSubmitProfileUpdate}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium font-semibold text-[#333333] mb-1">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 border border-[#A7C4A0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4d70]"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium font-semibold text-[#333333] mb-1">
                    Email (cannot be changed)
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full p-3 border border-[#A7C4A0] bg-gray-50 rounded-md"
                  />
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-[#A7C4A0] text-[#333333] rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#1b4d70] text-white rounded-md"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-[#A7C4A0]">
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveTab('favorites')}
              className={`pb-3 font-medium flex items-center ${activeTab === 'favorites' ? 'text-[#1b4d70] border-b-2 border-[#1b4d70]' : 'text-[#333333]'}`}
            >
              <FiHeart className="mr-2" />
              My Favorites
            </button>
            <button
              onClick={() => setActiveTab('referrals')}
              className={`pb-3 font-medium flex items-center ${activeTab === 'referrals' ? 'text-[#1b4d70] border-b-2 border-[#1b4d70]' : 'text-[#333333]'}`}
            >
              <FiMessageSquare className="mr-2" />
              Referral History
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-3 font-medium flex items-center ${activeTab === 'settings' ? 'text-[#1b4d70] border-b-2 border-[#1b4d70]' : 'text-[#333333]'}`}
            >
              <FiUser className="mr-2" />
              Account Settings
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-md p-6">
          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[#1b4d70]">Saved Communities</h2>
                {selectedCommunities.length > 0 && (
                  <button
                    onClick={handleCompare}
                    className="bg-[#1b4d70] text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    Compare Selected ({selectedCommunities.length})
                  </button>
                )}
              </div>

              {favoritedCommunities.length === 0 ? (
                <div className="text-center py-8">
                  <FiHeart size={48} className="mx-auto text-[#A7C4A0] mb-4" />
                  <h3 className="text-lg font-medium font-semibold text-[#1b4d70] mb-2">No saved communities yet</h3>
                  <p className="text-[#333333] mb-4">Browse communities and click the heart icon to save them here.</p>
                  <Link
                    href="/"
                    className="inline-block bg-[#1b4d70] text-white px-6 py-3 rounded-md hover:bg-[#2F5061] transition"
                  >
                    Browse Communities
                  </Link>
                </div>
              ) : (
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
                          <div className="flex items-center text-gray-500 text-sm mb-3">
                            <FiMapPin size={14} className="mr-1 flex-shrink-0" />
                            <span className="truncate">{community.city}, {community.state}</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Referral History Tab */}
          {activeTab === 'referrals' && (
            <div>
              <h2 className="text-xl font-semibold text-[#1b4d70] mb-6">Referral History</h2>

              {user.referralHistory && user.referralHistory.length > 0 ? (
                <div className="space-y-4">
                  {user.referralHistory.map((referral) => (
                    <div key={referral.id} className="border border-[#A7C4A0] rounded-lg p-4 flex flex-col md:flex-row justify-between">
                      <div>
                        <h3 className="font-medium font-semibold text-[#1b4d70]">{referral.providerName}</h3>
                        <p className="text-sm text-[#333333]">
                          Status: <span className={`font-medium ${
                            referral.status === 'completed' ? 'text-green-600' :
                            referral.status === 'contacted' ? 'text-blue-600' : 'text-orange-500'
                          }`}>
                            {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                          </span>
                        </p>
                        <div className="flex items-center text-sm text-[#333333] mt-1">
                          <FiCalendar className="mr-1" size={14} />
                          {new Date(referral.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="mt-3 md:mt-0">
                        <Link
                          href={`/provider/${referral.providerId}`}
                          className="text-[#1b4d70] font-medium font-semibold hover:underline text-sm"
                        >
                          View Community
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FiMessageSquare size={48} className="mx-auto text-[#A7C4A0] mb-4" />
                  <h3 className="text-lg font-medium font-semibold text-[#1b4d70] mb-2">No referral history yet</h3>
                  <p className="text-[#333333] mb-4">Contact a care advisor to get help finding the right senior living community.</p>
                  <Link
                    href="/contact"
                    className="inline-block bg-[#1b4d70] text-white px-6 py-3 rounded-md hover:bg-[#2F5061] transition"
                  >
                    Contact a Care Advisor
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Account Settings Tab */}
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-xl font-semibold text-[#1b4d70] mb-6">Account Settings</h2>

              <div className="space-y-6">
                <div className="border border-[#A7C4A0] rounded-lg p-6">
                  <h3 className="font-medium font-semibold text-lg text-[#1b4d70] mb-4">Profile Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-[#666666]">Name</p>
                      <p className="font-medium font-semibold">{user.name || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#666666]">Email</p>
                      <p className="font-medium font-semibold">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-6 bg-white border border-[#1b4d70] text-[#1b4d70] px-4 py-2 rounded-lg flex items-center"
                  >
                    <FiEdit2 className="mr-2" />
                    Edit Profile
                  </button>
                </div>

                <div className="border border-[#F5A623] rounded-lg p-6">
                  <h3 className="font-medium font-semibold text-lg text-[#F5A623] mb-4">Account Actions</h3>
                  <button
                    onClick={handleLogout}
                    className="bg-white border border-[#F5A623] text-[#F5A623] px-4 py-2 rounded-lg flex items-center"
                  >
                    <FiUser className="mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
