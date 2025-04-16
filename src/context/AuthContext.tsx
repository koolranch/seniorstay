"use client";

import { createContext, useState, useContext, useEffect, type ReactNode } from "react";

// User type definition
export type User = {
  id: string;
  email: string;
  name?: string;
  favorites: string[]; // Changed from number[] to string[]
  referralHistory: {
    id: number; // Assuming referral IDs might still be numbers? Check source.
    providerId: number; // Check if this should also be string
    providerName: string;
    date: string;
    status: "pending" | "contacted" | "completed";
  }[];
};

// Auth context type
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  addToFavorites: (providerId: string) => void; // Changed from number to string
  removeFromFavorites: (providerId: string) => void; // Changed from number to string
  isFavorite: (providerId: string) => boolean; // Changed from number to string
  updateUser: (updates: Partial<User>) => void;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  signUp: async () => {},
  logout: () => {},
  addToFavorites: () => {},
  removeFromFavorites: () => {},
  isFavorite: () => false,
  updateUser: () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          // Add validation for favorites being string[]
          if (parsedUser && Array.isArray(parsedUser.favorites) && parsedUser.favorites.every((fav: any) => typeof fav === 'string')) {
             setUser(parsedUser);
          } else {
             console.warn("Stored user data mismatch (expected favorites: string[]).");
             // Optionally try to migrate or clear invalid data
             localStorage.removeItem("user");
          }
        } catch (error) {
          console.error("Failed to parse stored user", error);
          localStorage.removeItem("user");
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
       // If user logs out, ensure the user item is removed
       localStorage.removeItem("user");
    }
  }, [user]);

  // Sign up function
  const signUp = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); 

      const newUser: User = {
        id: Date.now().toString(), // Simple mock ID generation
        email,
        name,
        favorites: [], // Initialize with empty string array
        referralHistory: [], // Assuming referralHistory structure is correct
      };

      // Import favorites from localStorage if any exist (expecting string[])
      const localFavorites = localStorage.getItem("favorites");
      if (localFavorites) {
        try {
          const favIds = JSON.parse(localFavorites) as string[];
           if (Array.isArray(favIds) && favIds.every(id => typeof id === 'string') && favIds.length > 0) {
            newUser.favorites = favIds;
          }
        } catch (error) {
          console.error("Failed to parse local favorites during signup", error);
        }
      }
      
      setUser(newUser);
      // localStorage update happens in useEffect

    } catch (error) {
      console.error("Sign up failed", error);
      throw new Error("Sign up failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); 

      const loggedInUser: User = {
        id: Date.now().toString(), 
        email,
        name: email.split('@')[0],
        favorites: [], // Initialize with empty string array
        referralHistory: [], // Clear mock referral history or fetch real data
      };

      // Import favorites from localStorage if any exist (expecting string[])
      const localFavorites = localStorage.getItem("favorites");
      if (localFavorites) {
        try {
          const favIds = JSON.parse(localFavorites) as string[];
           if (Array.isArray(favIds) && favIds.every(id => typeof id === 'string') && favIds.length > 0) {
            loggedInUser.favorites = favIds;
          }
        } catch (error) {
          console.error("Failed to parse local favorites during login", error);
        }
      }

      setUser(loggedInUser);
      // localStorage update happens in useEffect

    } catch (error) {
      console.error("Login failed", error);
      throw new Error("Login failed. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    // User removal from localStorage handled by useEffect
    // Keep non-user-specific favorites in localStorage? Or clear them?
    // Let's keep them for now, assuming they might be used when logged out.
  };

  // Add to favorites
  const addToFavorites = (providerId: string) => { // Changed from number to string
    if (user) {
      // Add to user's favorites if logged in
      if (!user.favorites.includes(providerId)) {
        const updatedUser = {
          ...user,
          favorites: [...user.favorites, providerId],
        };
        setUser(updatedUser);
        // localStorage update happens in useEffect
      }
    } else {
      // Store in localStorage if not logged in
      const localFavorites = localStorage.getItem("favorites");
      let favIds: string[] = []; // Expect string array

      if (localFavorites) {
        try {
          const parsedFavs = JSON.parse(localFavorites);
          // Validate that it's an array of strings
           if (Array.isArray(parsedFavs) && parsedFavs.every(id => typeof id === 'string')) {
             favIds = parsedFavs;
          }
        } catch (error) {
          console.error("Failed to parse local favorites for adding", error);
          // Reset favIds if parsing fails
          favIds = [];
        }
      }

      if (!favIds.includes(providerId)) {
        favIds.push(providerId);
        localStorage.setItem("favorites", JSON.stringify(favIds));
      }
    }
  };

  // Remove from favorites
  const removeFromFavorites = (providerId: string) => { // Changed from number to string
    if (user) {
      // Remove from user's favorites if logged in
      const updatedUser = {
        ...user,
        favorites: user.favorites.filter(id => id !== providerId),
      };
      setUser(updatedUser);
      // localStorage update happens in useEffect
    } else {
      // Remove from localStorage if not logged in
      const localFavorites = localStorage.getItem("favorites");

      if (localFavorites) {
        try {
          const parsedFavs = JSON.parse(localFavorites) as string[];
          // Validate it's an array of strings
           if (Array.isArray(parsedFavs) && parsedFavs.every(id => typeof id === 'string')) {
             const updatedFavs = parsedFavs.filter(id => id !== providerId);
             localStorage.setItem("favorites", JSON.stringify(updatedFavs));
          } else {
             // If data is invalid, maybe just clear it?
             localStorage.removeItem("favorites");
          }
        } catch (error) {
          console.error("Failed to parse local favorites for removing", error);
          // Clear potentially corrupted data
          localStorage.removeItem("favorites");
        }
      }
    }
  };

  // Check if a provider is favorited
  const isFavorite = (providerId: string) => { // Changed from number to string
    if (user) {
      // Check user's favorites if logged in
      return user.favorites.includes(providerId);
    }

    // Check localStorage if not logged in
    const localFavorites = localStorage.getItem("favorites");

    if (localFavorites) {
      try {
        const parsedFavs = JSON.parse(localFavorites) as string[];
        // Validate it's an array of strings
         if (Array.isArray(parsedFavs) && parsedFavs.every(id => typeof id === 'string')) {
           return parsedFavs.includes(providerId);
        }
      } catch (error) {
        console.error("Failed to parse local favorites for checking", error);
        // Clear potentially corrupted data
        localStorage.removeItem("favorites");
      }
    }

    return false;
  };

  // Update user information
  const updateUser = (updates: Partial<User>) => {
    if (user) {
      // Ensure favorites update is handled correctly if provided in updates
       if (updates.favorites && !Array.isArray(updates.favorites)) {
          console.error("Invalid favorites format in updateUser");
          return; // Prevent update with invalid favorites
       }
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      // localStorage update happens in useEffect
    }
  };

  // Context value
  const value = {
    user,
    isLoading,
    login,
    signUp,
    logout,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
