"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Community } from '@/data/facilities';

type ComparisonContextType = {
  addToComparison: (facility: Community) => void;
  removeFromComparison: (id: string) => void;
  isInComparison: (id: string) => boolean;
  comparisonList: Community[];
};

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export const ComparisonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [comparison, setComparison] = useState<Community[]>([]);

  // Load saved comparison from localStorage on initial render
  useEffect(() => {
    const savedComparison = localStorage.getItem('comparisonList');
    if (savedComparison) {
      try {
        setComparison(JSON.parse(savedComparison));
      } catch (error) {
        console.error('Error loading saved comparison:', error);
        localStorage.removeItem('comparisonList');
      }
    }
  }, []);

  // Save comparison to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('comparisonList', JSON.stringify(comparison));
  }, [comparison]);

  const addToComparison = (facility: Community) => {
    // Don't add if already in comparison or reached limit
    if (isInComparison(facility.id) || comparison.length >= 4) return;
    setComparison((prev) => [...prev, facility]);
  };

  const removeFromComparison = (id: string) => {
    setComparison((prev) => prev.filter((item) => item.id !== id));
  };

  const isInComparison = (id: string) => comparison.some((item) => item.id === id);

  return (
    <ComparisonContext.Provider
      value={{ addToComparison, removeFromComparison, isInComparison, comparisonList: comparison }}
    >
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};
