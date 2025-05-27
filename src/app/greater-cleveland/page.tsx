import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import Link from 'next/link';
import { MapPin, Home, Users } from 'lucide-react';
import { communityData } from '@/data/facilities';

export const metadata = {
  title: 'Senior Living in Greater Cleveland | Guide for Seniors',
  description: 'Find senior living communities across Greater Cleveland including Cleveland, Beachwood, Shaker Heights, Westlake, and more. Compare assisted living, memory care, and independent living options.',
  keywords: 'Greater Cleveland senior living, Cleveland metro senior care, Cuyahoga County assisted living, Northeast Ohio senior communities',
};

// Define Greater Cleveland cities with additional info
const greaterClevelandCities = [
  { name: 'Cleveland', description: 'Ohio\'s second-largest city with diverse senior living options' },
  { name: 'Beachwood', description: 'Upscale community with premium senior care facilities' },
  { name: 'Shaker Heights', description: 'Historic suburb with elegant senior communities' },
  { name: 'Westlake', description: 'West side community with modern senior living' },
  { name: 'Independence', description: 'Convenient location with quality care options' },
  { name: 'Strongsville', description: 'Family-friendly area with senior care facilities' },
  { name: 'Mayfield Heights', description: 'East side location with various care levels' },
  { name: 'North Olmsted', description: 'Shopping and healthcare access for seniors' },
  { name: 'Rocky River', description: 'Lakefront community with senior living' },
  { name: 'Solon', description: 'Growing community with modern facilities' },
];

export default function GreaterClevelandPage() {
  // Count communities by city
  const cityCounts = greaterClevelandCities.map(city => {
    const count = communityData.filter(
      c => c.location.split(',')[0].trim() === city.name
    ).length;
    return { ...city, count };
  });

  const totalCommunities = communityData.filter(c => 
    greaterClevelandCities.some(city => c.location.includes(city.name))
  ).length;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-center mb-4">
              Senior Living in Greater Cleveland
            </h1>
            <p className="text-xl text-gray-700 text-center max-w-3xl mx-auto mb-8">
              Explore {totalCommunities}+ senior living communities across Cuyahoga County and the Greater Cleveland metropolitan area. 
              Find the perfect assisted living, memory care, or independent living community in your preferred neighborhood.
            </p>
            
            <div className="flex justify-center gap-4 flex-wrap">
              <div className="bg-white px-6 py-3 rounded-full shadow-sm flex items-center gap-2">
                <Home className="h-5 w-5 text-primary" />
                <span className="font-semibold">{totalCommunities} Communities</span>
              </div>
              <div className="bg-white px-6 py-3 rounded-full shadow-sm flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="font-semibold">{greaterClevelandCities.length} Cities</span>
              </div>
              <div className="bg-white px-6 py-3 rounded-full shadow-sm flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-semibold">All Care Levels</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cities Grid */}
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-semibold mb-8 text-center">
            Senior Living Communities by City
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cityCounts.map((city) => (
              <Link
                key={city.name}
                href={city.count > 0 ? `/location/${city.name.toLowerCase().replace(/\s+/g, '-')}` : '#'}
                className={`block p-6 bg-white rounded-xl shadow-sm border border-gray-200 
                  ${city.count > 0 ? 'hover:shadow-md hover:border-primary/20 transition-all' : 'opacity-75 cursor-not-allowed'}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold">{city.name}</h3>
                  {city.count > 0 && (
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      {city.count} {city.count === 1 ? 'Community' : 'Communities'}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm">
                  {city.description}
                </p>
                {city.count === 0 && (
                  <p className="text-gray-400 text-sm mt-2 italic">Coming soon</p>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Regional Information */}
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-semibold mb-8">About Senior Living in Greater Cleveland</h2>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <div>
                <h3 className="text-xl font-semibold mb-4">Why Choose Greater Cleveland?</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>World-class healthcare with Cleveland Clinic and University Hospitals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Affordable cost of living compared to national averages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Rich cultural amenities including museums, theaters, and parks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Four seasons with beautiful fall foliage and mild summers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Strong senior services and community support programs</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Types of Senior Care Available</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-primary">Independent Living</h4>
                    <p className="text-gray-600 text-sm">Maintenance-free lifestyle with social activities and amenities</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary">Assisted Living</h4>
                    <p className="text-gray-600 text-sm">Personal care assistance while maintaining independence</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary">Memory Care</h4>
                    <p className="text-gray-600 text-sm">Specialized care for Alzheimer's and dementia</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary">Skilled Nursing</h4>
                    <p className="text-gray-600 text-sm">24/7 medical care and rehabilitation services</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-semibold mb-4">
              Need Help Finding the Right Community?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Our senior living advisors are familiar with Greater Cleveland communities and can help 
              you find the perfect match based on your needs, preferences, and budget.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/contact"
                className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors"
              >
                Get Free Assistance
              </Link>
              <a
                href="tel:1888736467"
                className="bg-white text-primary border-2 border-primary px-8 py-3 rounded-full font-semibold hover:bg-primary/5 transition-colors"
              >
                Call 1-888-SENIORS
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 