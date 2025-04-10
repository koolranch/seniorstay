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
  return (
    <main>
      <HeroBanner />
      <CategoryPillBar />
      <RegionalDirectory />
      <CommunityGrid communities={communities} />
      <TourModal />
    </main>
  );
}
