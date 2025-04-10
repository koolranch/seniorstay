import type { Metadata } from "next";
import { ReactNode } from "react";
import { communities } from "@/lib/data/communities";
import Link from "next/link";

type CityLayoutProps = {
  children: ReactNode;
  params: {
    state: string;
    city: string;
  };
};

export async function generateMetadata({ 
  params 
}: CityLayoutProps): Promise<Metadata> {
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

export default function Layout({
  children,
  params,
}: CityLayoutProps) {
  const { state, city } = params;
  const cityCommunities = communities.filter(
    c => c.state.toLowerCase() === state.toLowerCase() && 
    c.city.toLowerCase() === city.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-gray-700">Home</Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li>
              <Link href="/community" className="hover:text-gray-700">Communities</Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li>
              <Link 
                href={`/community/${state.toLowerCase()}`}
                className="hover:text-gray-700"
              >
                {state.charAt(0).toUpperCase() + state.slice(1)}
              </Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li className="text-gray-900 font-medium">
              {city.charAt(0).toUpperCase() + city.slice(1)}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="md:col-span-1">
            <nav aria-label="Community filters">
              <h2 className="text-lg font-semibold mb-4">Filter Communities</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Care Types</h3>
                  <ul className="space-y-2">
                    <li>
                      <Link 
                        href={`/community/${state.toLowerCase()}/${city.toLowerCase()}?type=assisted-living`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Assisted Living
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href={`/community/${state.toLowerCase()}/${city.toLowerCase()}?type=independent-living`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Independent Living
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href={`/community/${state.toLowerCase()}/${city.toLowerCase()}?type=memory-care`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Memory Care
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </aside>
          <main className="md:col-span-3">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 