"use client";

import type React from "react";
import { createContext, useState, useContext, useEffect } from "react";

// Define the type for a community
export type Community = {
  id: number;
  slug: string;
  name: string;
  city: string;
  state: string;
  type: string;
  image: string;
  rating: number;
  amenities?: string[];
  price?: string;
  phone?: string;
  address?: string;
  description?: string;
};

// Define the context type
type ComparisonContextType = {
  comparedCommunities: Community[];
  addToComparison: (community: Community) => void;
  removeFromComparison: (communityId: number) => void;
  isInComparison: (communityId: number) => boolean;
  clearComparison: () => void;
};

// Create the context with default values
const ComparisonContext = createContext<ComparisonContextType>({
  comparedCommunities: [],
  addToComparison: () => {},
  removeFromComparison: () => {},
  isInComparison: () => false,
  clearComparison: () => {},
});

// Custom hook to use the comparison context
export const useComparison = () => useContext(ComparisonContext);

// Provider component
export const ComparisonProvider = ({ children }: { children: React.ReactNode }) => {
  const [comparedCommunities, setComparedCommunities] = useState<Community[]>([]);

  // Load saved comparison from localStorage on mount
  useEffect(() => {
    const savedComparison = localStorage.getItem("comparedCommunities");
    if (savedComparison) {
      try {
        setComparedCommunities(JSON.parse(savedComparison));
      } catch (error) {
        console.error("Failed to parse saved comparison", error);
        localStorage.removeItem("comparedCommunities");
      }
    }
  }, []);

  // Save comparison to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("comparedCommunities", JSON.stringify(comparedCommunities));
  }, [comparedCommunities]);

  // Add a community to comparison (max 3)
  const addToComparison = (community: Community) => {
    setComparedCommunities((prev) => {
      // Check if already in comparison
      if (prev.some((c) => c.id === community.id)) return prev;

      // Limit to 3 communities max
      if (prev.length >= 3) {
        return [...prev.slice(1), community];
      }

      return [...prev, community];
    });
  };

  // Remove a community from comparison
  const removeFromComparison = (communityId: number) => {
    setComparedCommunities((prev) => prev.filter((c) => c.id !== communityId));
  };

  // Check if a community is in comparison
  const isInComparison = (communityId: number) => {
    return comparedCommunities.some((c) => c.id === communityId);
  };

  // Clear all compared communities
  const clearComparison = () => {
    setComparedCommunities([]);
  };

  // Provide the context value
  const value = {
    comparedCommunities,
    addToComparison,
    removeFromComparison,
    isInComparison,
    clearComparison,
  };

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  );
};
