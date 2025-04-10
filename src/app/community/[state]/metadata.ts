import type { Metadata } from "next";
import { communities } from "@/lib/data/communities";

export async function generateMetadata({
  params,
}: {
  params: { state: string };
}): Promise<Metadata> {
  const state = params.state;
  const stateCommunities = communities.filter(c => c.state.toLowerCase() === state.toLowerCase());
  const cityCount = new Set(stateCommunities.map(c => c.city)).size;
  
  return {
    title: `Senior Living Communities in ${state.charAt(0).toUpperCase() + state.slice(1)} | SeniorStay`,
    description: `Find ${stateCommunities.length} senior living communities across ${cityCount} cities in ${state.charAt(0).toUpperCase() + state.slice(1)}. Compare assisted living, independent living, and memory care options.`,
    openGraph: {
      title: `Senior Living Communities in ${state.charAt(0).toUpperCase() + state.slice(1)} | SeniorStay`,
      description: `Find ${stateCommunities.length} senior living communities across ${cityCount} cities in ${state.charAt(0).toUpperCase() + state.slice(1)}. Compare assisted living, independent living, and memory care options.`,
      type: 'website',
      url: `https://seniorstay.com/community/${state.toLowerCase()}`,
      siteName: 'SeniorStay'
    },
    alternates: {
      canonical: `https://seniorstay.com/community/${state.toLowerCase()}`
    }
  };
} 