'use client';

import { communities } from "@/lib/data/communities";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const state = params.state as string;
  const stateCommunities = communities.filter(c => c.state.toLowerCase() === state.toLowerCase());
  const cities = Array.from(new Set(stateCommunities.map(c => c.city))).sort();
  const cityCount = cities.length;

  return (
    <>
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
          <h1 className="text-3xl font-bold mb-6">
            Senior Living Communities in {state.charAt(0).toUpperCase() + state.slice(1)}
          </h1>
          <p className="text-gray-600 mb-8">
            Explore {stateCommunities.length} senior living communities across {cityCount} cities in {state.charAt(0).toUpperCase() + state.slice(1)}.
            Find the perfect community that matches your needs and preferences.
          </p>
          {/* Add more content here as needed */}
        </main>
      </div>
    </>
  );
} 