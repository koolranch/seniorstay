import type { Metadata } from "next";
import { ReactNode } from "react";
import { communities } from "@/lib/data/communities";
import Link from "next/link";

// Define a clean local LayoutProps type
type LayoutProps = {
  children: ReactNode;
  params: {
    state: string;
    city: string;
  };
};

export async function generateMetadata({ 
  params 
}: LayoutProps): Promise<Metadata> {
  const { state, city } = params;
  const cityCommunities = communities.filter(
    c => c.state.toLowerCase() === state.toLowerCase() && 
    c.city.toLowerCase() === city.toLowerCase()
  );
  
  return {
    title: `Senior Living Communities in ${city.charAt(0).toUpperCase() + city.slice(1)}, ${state.charAt(0).toUpperCase() + state.slice(1)} | SeniorStay`,
    description: `Find ${cityCommunities.length} senior living communities in ${city.charAt(0).toUpperCase() + city.slice(1)}, ${state.charAt(0).toUpperCase() + state.slice(1)}. Compare amenities, pricing, and care options for assisted living, independent living, and memory care.`,
    openGraph: {
      title: `Senior Living Communities in ${city.charAt(0).toUpperCase() + city.slice(1)}, ${state.charAt(0).toUpperCase() + state.slice(1)} | SeniorStay`,
      description: `Find ${cityCommunities.length} senior living communities in ${city.charAt(0).toUpperCase() + city.slice(1)}, ${state.charAt(0).toUpperCase() + state.slice(1)}. Compare amenities, pricing, and care options.`,
      type: 'website',
      url: `https://seniorstay.com/community/${state.toLowerCase()}/${city.toLowerCase()}`,
      siteName: 'SeniorStay'
    },
    alternates: {
      canonical: `https://seniorstay.com/community/${state.toLowerCase()}/${city.toLowerCase()}`
    }
  };
}

// Ensure the layout function is NOT async
export default function Layout({ children, params }: LayoutProps) {
  return (
    <div className="container mx-auto px-4 py-6">
      {children}
    </div>
  );
} 