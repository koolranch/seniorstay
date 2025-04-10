import type { Metadata } from "next";
import { communities } from "@/lib/data/communities";
import Link from "next/link";

export async function generateMetadata({ params }: { params: { state: string } }): Promise<Metadata> {
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

export default function StateLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { state: string };
}) {
  const state = params.state;
  const stateCommunities = communities.filter(c => c.state.toLowerCase() === state.toLowerCase());
  const cities = Array.from(new Set(stateCommunities.map(c => c.city))).sort();

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
            <li className="text-gray-900 font-medium">
              {state.charAt(0).toUpperCase() + state.slice(1)}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="md:col-span-1">
            <nav aria-label="Cities in this state">
              <h2 className="text-lg font-semibold mb-4">Cities in {state.charAt(0).toUpperCase() + state.slice(1)}</h2>
              <ul className="space-y-2">
                {cities.map(city => (
                  <li key={city}>
                    <Link 
                      href={`/community/${state.toLowerCase()}/${city.toLowerCase()}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {city}
                    </Link>
                  </li>
                ))}
              </ul>
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