"use client";

import { useState, useEffect } from "react";
import HeroBanner from "@/components/HeroBanner";
import RegionalDirectory from "@/components/RegionalDirectory";
import MapToggleView from "@/components/MapToggleView";
import TestimonialSlider from "@/components/TestimonialSlider";
import ReferralCTA from "@/components/ReferralCTA";
import TourScheduler from "@/components/TourScheduler";
import { FiX } from "react-icons/fi";
import { communities as staticCommunities } from "@/lib/data/staticCommunities";
import CategoryPillBar from "@/components/CategoryPillBar";
import CommunityGrid from "@/components/CommunityGrid";
import TourModal from "@/components/TourModal";
import { InternalCommunity } from "@/lib/types/community";
import { Community } from "@/types/community";
import CompareFloatingButton from "@/components/CompareFloatingButton";

// Helper function to create city_slug if not available
function generateCitySlug(city: string): string {
  return city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Helper function to convert InternalCommunity to Community format
function mapInternalToDisplay(internalCommunities: InternalCommunity[]): Community[] {
  return internalCommunities.map(community => {
    // Extract just the name part from the slug if it contains city and state
    let cleanSlug = community.slug;
    
    // For cases like "vitalia-rockside-seven-hills-oh", we want just "vitalia-rockside"
    if (cleanSlug.includes(community.city.toLowerCase()) || cleanSlug.includes('-oh')) {
      const cityParts = community.city.toLowerCase().split(' ').map(part => part.trim()).filter(Boolean);
      const statePart = '-oh';
      
      // More precise approach: remove the city and state parts from the end of the slug
      const slugParts = cleanSlug.split('-');
      const cityIndex = slugParts.findIndex(part => 
        cityParts.some(cityPart => cityPart === part) ||
        part === 'ohio' || 
        part === 'oh'
      );
      
      if (cityIndex > 0) {
        // Take everything before the city name starts
        cleanSlug = slugParts.slice(0, cityIndex).join('-');
      } else {
        // Fallback to original approach if city index not found
        cleanSlug = cleanSlug.split('-').slice(0, -2).join('-');
      }
      
      // If it's empty (rare case), default to the name
      if (!cleanSlug) cleanSlug = community.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    
    return {
      id: community.id,
      name: community.name,
      slug: cleanSlug, // Use the cleaned slug
      address: `${community.city}, ${community.state}`,
      city: community.city,
      city_slug: community.city_slug || generateCitySlug(community.city), // Add city_slug with fallback
      state: community.state,
      type: community.type || "Senior Living",
      services: Array.isArray(community.services) ? community.services : 
                typeof community.services === 'string' ? [community.services] : [],
      amenities: Array.isArray(community.services) ? community.services : 
                typeof community.services === 'string' ? [community.services] : [],
      rating: 4.5,
      description: `${community.name} is a ${community.type || "Senior Living"} community in ${community.city}, ${community.state}.`,
      image: community.imageUrl || "https://source.unsplash.com/random/800x600/?senior,living",
      reviewCount: 0
    };
  });
}

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [mappedCommunities, setMappedCommunities] = useState<Community[]>(
    // Apply the city_slug generation to the static communities as well
    staticCommunities.map(community => {
      // Clean up slugs for static communities
      let cleanSlug = community.slug;
      
      // For cases like "vitalia-rockside-seven-hills-oh", we want just "vitalia-rockside"
      if (cleanSlug.includes(community.city.toLowerCase()) || cleanSlug.includes('-oh')) {
        const cityParts = community.city.toLowerCase().split(' ').map(part => part.trim()).filter(Boolean);
        
        // More precise approach: remove the city and state parts from the end of the slug
        const slugParts = cleanSlug.split('-');
        const cityIndex = slugParts.findIndex(part => 
          cityParts.some(cityPart => cityPart === part) ||
          part === 'ohio' || 
          part === 'oh'
        );
        
        if (cityIndex > 0) {
          // Take everything before the city name starts
          cleanSlug = slugParts.slice(0, cityIndex).join('-');
        } else {
          // Fallback to original approach if city index not found
          cleanSlug = cleanSlug.split('-').slice(0, -2).join('-');
        }
        
        // If it's empty (rare case), default to the name
        if (!cleanSlug) cleanSlug = community.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      }
      
      return {
        ...community,
        slug: cleanSlug,
        city_slug: community.city_slug || generateCitySlug(community.city)
      };
    })
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showTourModal, setShowTourModal] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<{id: string; name: string; slug: string} | null>(null);
  
  // Fetch communities from the API
  useEffect(() => {
    // Debug log static communities
    console.log('Static communities with processed slugs:', mappedCommunities.slice(0, 3).map(c => ({
      name: c.name,
      slug: c.slug,
      city: c.city,
      city_slug: c.city_slug
    })));
    
    async function fetchCommunities() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/communities');
        if (!response.ok) {
          throw new Error('Failed to fetch communities');
        }
        
        const data = await response.json();
        if (data.communities && data.communities.length > 0) {
          const mapped = mapInternalToDisplay(data.communities);
          setMappedCommunities(mapped);
          console.log(`Loaded ${data.communities.length} communities with images`);
        }
      } catch (error) {
        console.error("Error fetching communities:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchCommunities();
  }, []);

  const openTourModal = (community: {id: string; name: string; slug: string}) => {
    setSelectedCommunity(community);
    setShowTourModal(true);
  };

  const closeTourModal = () => {
    setShowTourModal(false);
    setSelectedCommunity(null);
  };

  return (
    <main>
      <HeroBanner />
      <CategoryPillBar onSelectCategory={setSelectedCategory} selected={selectedCategory} />
      <RegionalDirectory />
      <CommunityGrid communities={mappedCommunities} filterByCategory={selectedCategory} />
      {selectedCommunity && (
        <TourModal
          isOpen={showTourModal}
          onClose={closeTourModal}
          communityId={selectedCommunity.id}
          communityName={selectedCommunity.name}
          communitySlug={selectedCommunity.slug}
        />
      )}
      <CompareFloatingButton />
    </main>
  );
}
