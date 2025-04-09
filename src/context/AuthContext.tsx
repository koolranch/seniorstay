"use client";

import { createContext, useState, useContext, useEffect, type ReactNode } from "react";

// User type definition
export type User = {
  id: string;
  email: string;
  name?: string;
  favorites: number[]; // Array of provider IDs
  referralHistory: {
    id: number;
    providerId: number;
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
  addToFavorites: (providerId: number) => void;
  removeFromFavorites: (providerId: number) => void;
  isFavorite: (providerId: number) => boolean;
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
          setUser(JSON.parse(storedUser));
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
    }
  }, [user]);

  // Sign up function - in a real app, this would call an API
  const signUp = async (email: string, password: string, name?: string) => {
    // Simulate API call
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to create a user
      // For demo, we'll create a mock user
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        favorites: [],
        referralHistory: [],
      };

      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));

      // Import favorites from localStorage if any exist
      const localFavorites = localStorage.getItem("favorites");
      if (localFavorites) {
        try {
          const favIds = JSON.parse(localFavorites) as number[];
          if (favIds.length > 0) {
            newUser.favorites = favIds;
            setUser({ ...newUser });
            localStorage.setItem("user", JSON.stringify(newUser));
          }
        } catch (error) {
          console.error("Failed to parse local favorites", error);
        }
      }
    } catch (error) {
      console.error("Sign up failed", error);
      throw new Error("Sign up failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Login function - in a real app, this would verify credentials
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to verify credentials
      // For demo, we'll create a mock user
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

      const loggedInUser: User = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        favorites: [],
        referralHistory: [
          {
            id: 1,
            providerId: 1,
            providerName: "Sunshine Meadows",
            date: new Date().toISOString(),
            status: "contacted",
          },
        ],
      };

      setUser(loggedInUser);
      localStorage.setItem("user", JSON.stringify(loggedInUser));

      // Import favorites from localStorage if any exist
      const localFavorites = localStorage.getItem("favorites");
      if (localFavorites) {
        try {
          const favIds = JSON.parse(localFavorites) as number[];
          if (favIds.length > 0) {
            loggedInUser.favorites = favIds;
            setUser({ ...loggedInUser });
            localStorage.setItem("user", JSON.stringify(loggedInUser));
          }
        } catch (error) {
          console.error("Failed to parse local favorites", error);
        }
      }
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
    localStorage.removeItem("user");
    // Don't remove favorites from localStorage to persist them for next login
  };

  // Add to favorites
  const addToFavorites = (providerId: number) => {
    if (user) {
      // Add to user's favorites if logged in
      if (!user.favorites.includes(providerId)) {
        const updatedUser = {
          ...user,
          favorites: [...user.favorites, providerId],
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } else {
      // Store in localStorage if not logged in
      const localFavorites = localStorage.getItem("favorites");
      let favIds: number[] = [];

      if (localFavorites) {
        try {
          favIds = JSON.parse(localFavorites);
        } catch (error) {
          console.error("Failed to parse local favorites", error);
        }
      }

      if (!favIds.includes(providerId)) {
        favIds.push(providerId);
        localStorage.setItem("favorites", JSON.stringify(favIds));
      }
    }
  };

  // Remove from favorites
  const removeFromFavorites = (providerId: number) => {
    if (user) {
      // Remove from user's favorites if logged in
      const updatedUser = {
        ...user,
        favorites: user.favorites.filter(id => id !== providerId),
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } else {
      // Remove from localStorage if not logged in
      const localFavorites = localStorage.getItem("favorites");

      if (localFavorites) {
        try {
          const favIds = JSON.parse(localFavorites) as number[];
          const updatedFavs = favIds.filter(id => id !== providerId);
          localStorage.setItem("favorites", JSON.stringify(updatedFavs));
        } catch (error) {
          console.error("Failed to parse local favorites", error);
        }
      }
    }
  };

  // Check if a provider is favorited
  const isFavorite = (providerId: number) => {
    if (user) {
      // Check user's favorites if logged in
      return user.favorites.includes(providerId);
    }

    // Check localStorage if not logged in
    const localFavorites = localStorage.getItem("favorites");

    if (localFavorites) {
      try {
        const favIds = JSON.parse(localFavorites) as number[];
        return favIds.includes(providerId);
      } catch (error) {
        console.error("Failed to parse local favorites", error);
      }
    }

    return false;
  };

  // Update user information
  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
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
