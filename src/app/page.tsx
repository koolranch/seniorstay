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

// Helper function to convert InternalCommunity to Community format
function mapInternalToDisplay(internalCommunities: InternalCommunity[]) {
  return internalCommunities.map(community => ({
    id: community.id,
    name: community.name,
    slug: community.slug,
    address: `${community.city}, ${community.state}`,
    city: community.city,
    state: community.state,
    type: community.type,
    services: community.services || [],
    amenities: community.services || [],
    rating: 4.5,
    description: `${community.name} is a ${community.type} community in ${community.city}, ${community.state}.`,
    image: community.imageUrl || "https://source.unsplash.com/random/800x600/?senior,living",
    reviewCount: 0
  }));
}

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [mappedCommunities, setMappedCommunities] = useState(staticCommunities);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch communities from the API
  useEffect(() => {
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

  return (
    <main>
      <HeroBanner />
      <CategoryPillBar onSelectCategory={setSelectedCategory} selected={selectedCategory} />
      <RegionalDirectory />
      <CommunityGrid communities={mappedCommunities} filterByCategory={selectedCategory} />
      <TourModal />
    </main>
  );
}
