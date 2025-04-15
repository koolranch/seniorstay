// Define the shape of the community data we'll work with internally
// Use string for ID as it comes from Prisma
export interface InternalCommunity {
  id: string; // Changed to string to match Prisma
  name: string;
  city: string;
  slug: string;
  state: string;
  type: string; // Type will be derived or defaulted
  services?: string[]; // Keep services if needed later
  imageUrl?: string; // URL to the community image
} 