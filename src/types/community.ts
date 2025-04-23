export interface Community {
  id: string;
  slug: string;
  name: string;
  city: string;
  state: string;
  type: string;
  
  // Support both property names for image to maintain compatibility
  image: string;
  imageUrl?: string | null;
  
  rating: number;
  reviewCount?: number;
  
  // Optional properties that may be used in different contexts
  amenities?: string[];
  services?: string | null;
  price?: string;
  address?: string | null;
  phone?: string | null;
  description?: string | null;
  
  // Additional properties used in some contexts
  zip?: string | null;
  website?: string | null;
  email?: string | null;
  
  // Database timestamps
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// Create type aliases for backward compatibility
export type InternalCommunity = Community;

// For any component that expects only a subset of properties
export type CommunityCard = Pick<Community, 'id' | 'slug' | 'name' | 'city' | 'state' | 'type' | 'image' | 'rating' | 'amenities'>;

// Add any other specialized types here
