import { Metadata } from "next";
import Link from "next/link";
import { communities } from "@/lib/data/communities";

export const metadata: Metadata = {
  title: "Senior Living in Ohio | SeniorStay",
  description: "Explore senior living communities across Ohio. Find the perfect community for you or your loved one.",
};

export default function OhioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get all unique cities in Ohio
  const ohioCities = communities
    .filter((community) => community.state === "OH")
    .reduce((acc, community) => {
      if (!acc.includes(community.city)) {
        acc.push(community.city);
      }
      return acc;
    }, [] as string[])
    .sort();

  return (
    <div className="bg-[#FAFAF5] min-h-screen">
      <div className="container mx-auto px-6 md:px-10 lg:px-20 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="md:w-1/4 lg:w-1/5">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-[#1b4d70] mb-4">
                Cities in Ohio
              </h2>
              <nav aria-label="Cities in Ohio">
                <ul className="space-y-2">
                  {ohioCities.map((city) => (
                    <li key={city}>
                      <Link
                        href={`/ohio/${city.toLowerCase()}`}
                        className="text-[#1b4d70] hover:text-[#2F5061] hover:underline"
                      >
                        {city}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="md:w-3/4 lg:w-4/5">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 