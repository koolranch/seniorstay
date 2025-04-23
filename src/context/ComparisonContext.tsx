"use client";

import {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode,
  useCallback,
} from "react";
import { type Community } from "@/types/community";

// Comparison context type
type ComparisonContextType = {
  comparisonItems: string[]; // Array of community IDs
  addToComparison: (providerId: string) => void;
  removeFromComparison: (providerId: string) => void;
  isInComparison: (providerId: string) => boolean;
  clearComparison: () => void;
  isLoading: boolean; // Added loading state for persistence
};

// Create context with default values
const ComparisonContext = createContext<ComparisonContextType>({
  comparisonItems: [],
  addToComparison: () => {},
  removeFromComparison: () => {},
  isInComparison: () => false,
  clearComparison: () => {},
  isLoading: true, // Default to true until loaded from storage
});

// Custom hook to use the comparison context
export const useComparison = () => useContext(ComparisonContext);

// Comparison provider component
export const ComparisonProvider = ({ children }: { children: ReactNode }) => {
  const [comparisonItems, setComparisonItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const storageKey = "comparisonItems";

  // Load comparison items from localStorage on mount
  useEffect(() => {
    try {
      const storedItems = localStorage.getItem(storageKey);
      if (storedItems) {
        const parsedItems = JSON.parse(storedItems);
        // Validate that it's an array of strings
        if (
          Array.isArray(parsedItems) &&
          parsedItems.every((item) => typeof item === "string")
        ) {
          setComparisonItems(parsedItems);
        } else {
          console.warn(
            "Invalid format in localStorage comparisonItems. Clearing."
          );
          localStorage.removeItem(storageKey);
        }
      }
    } catch (error) {
      console.error("Failed to parse comparison items from localStorage", error);
      localStorage.removeItem(storageKey);
    }
    setIsLoading(false); // Loading finished
  }, []);

  // Save comparison items to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) { // Only save after initial load
      localStorage.setItem(storageKey, JSON.stringify(comparisonItems));
    }
  }, [comparisonItems, isLoading]);

  // Add to comparison
  const addToComparison = useCallback((providerId: string) => {
    setComparisonItems((prevItems) => {
      if (!prevItems.includes(providerId)) {
        console.log("ComparisonContext: Adding ID:", providerId);
        return [...prevItems, providerId];
      }
      return prevItems; // Return unchanged if already present
    });
  }, []);

  // Remove from comparison
  const removeFromComparison = useCallback((providerId: string) => {
    setComparisonItems((prevItems) => {
      const updatedItems = prevItems.filter((id) => id !== providerId);
       if (updatedItems.length !== prevItems.length) {
         console.log("ComparisonContext: Removing ID:", providerId);
       }
      return updatedItems;
    });
  }, []);

  // Check if item is in comparison
  const isInComparison = useCallback(
    (providerId: string) => {
      return comparisonItems.includes(providerId);
    },
    [comparisonItems]
  );

  // Clear all comparison items
  const clearComparison = useCallback(() => {
    console.log("ComparisonContext: Clearing all items.");
    setComparisonItems([]);
  }, []);

  // Context value
  const value = {
    comparisonItems,
    addToComparison,
    removeFromComparison,
    isInComparison,
    clearComparison,
    isLoading,
  };

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  );
};
