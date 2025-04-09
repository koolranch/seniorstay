import { Metadata } from "next";

// Define the params type for community routes
export type CommunityParams = {
  state: string;
  city: string;
  slug: string;
};

// Define the props type for community page components
export type CommunityPageProps = {
  params: CommunityParams;
  searchParams?: { [key: string]: string | string[] | undefined };
};

// Extend Next.js types to include our custom types
declare module "next" {
  interface PageProps {
    params: CommunityParams;
  }
}

// Helper type for generateMetadata function
export type GenerateMetadataProps = {
  params: CommunityParams;
};

// Helper function type for generateMetadata
export type GenerateMetadataFunction = (props: CommunityPageProps) => Promise<Metadata>;

export interface Community {
  id: number;
  name: string;
  slug: string;
  address: string;
  city: string;
  state: string;
  type: string;
  services: string[];
  image: string;
  description: string;
  rating: number;
  amenities?: string[];
  price?: string;
  phone?: string;
} 