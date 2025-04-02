"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Community } from '@/data/facilities';

interface ComparisonContextType {
  communities: Community[];
  addToComparison: (community: Community) => void;
  removeFromComparison: (id: string) => void;
  clearComparison: () => void;
  isInComparison: (id: string) => boolean;
}

const ComparisonContext = createContext<ComparisonContextType>({
  communities: [],
  addToComparison: () => {},
  removeFromComparison: () => {},
  clearComparison: () => {},
  isInComparison: () => false,
});

export const useComparison = () => useContext(ComparisonContext);

export const ComparisonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [communities, setCommunities] = useState<Community[]>([]);

  // Load saved communities from localStorage on initial render
  useEffect(() => {
    const savedCommunities = localStorage.getItem('comparisonCommunities');
    if (savedCommunities) {
      try {
        setCommunities(JSON.parse(savedCommunities));
      } catch (error) {
        console.error('Error loading saved comparison communities:', error);
        localStorage.removeItem('comparisonCommunities');
      }
    }
  }, []);

  // Save communities to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('comparisonCommunities', JSON.stringify(communities));
  }, [communities]);

  const addToComparison = (community: Community) => {
    // Don't add if already in comparison or reached limit
    if (isInComparison(community.id) || communities.length >= 4) return;
    setCommunities([...communities, community]);
  };

  const removeFromComparison = (id: string) => {
    setCommunities(communities.filter(item => item.id !== id));
  };

  const clearComparison = () => {
    setCommunities([]);
  };

  const isInComparison = (id: string) => {
    return communities.some(item => item.id === id);
  };

  return (
    <ComparisonContext.Provider
      value={{
        communities,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
};
