"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import HeroBanner from "@/components/HeroBanner";
import RegionalDirectory from "@/components/RegionalDirectory";
import ProviderCard from "@/components/ProviderCard";
import MapToggleView from "@/components/MapToggleView";
import TestimonialSlider from "@/components/TestimonialSlider";
import ReferralCTA from "@/components/ReferralCTA";
import TourScheduler from "@/components/TourScheduler";
import { FiX } from "react-icons/fi";
import { communities } from "@/lib/data/communities";
import CategoryPillBar from "@/components/CategoryPillBar";
import CommunityGrid from "@/components/CommunityGrid";
import TourModal from "@/components/TourModal";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Step 2: Log community data for debugging
  console.log("Homepage Communities:", communities.map(c => ({ id: c.id, name: c.name, city: c.city, slug: c.slug })));

  return (
    <main>
      <HeroBanner />
      <CategoryPillBar onSelectCategory={setSelectedCategory} selected={selectedCategory} />
      <RegionalDirectory />
      <CommunityGrid communities={communities} filterByCategory={selectedCategory} />
      <TourModal />
    </main>
  );
}
