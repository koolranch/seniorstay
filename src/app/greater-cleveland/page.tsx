import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Home, Users, ArrowRight, Hospital, Phone, Star } from 'lucide-react';
import GlobalHeader from '@/components/home/GlobalHeader';
import Footer from '@/components/footer/Footer';
import { fetchAllCommunities } from '@/lib/fetch-community';

export const metadata: Metadata = {
  title: 'Senior Living in Greater Cleveland | Browse All Communities | Guide for Seniors',
  description: 'Find senior living communities across Greater Cleveland including Cleveland, Beachwood, Shaker Heights, Westlake, and more. Compare assisted living, memory care, and independent living options.',
  keywords: 'Greater Cleveland senior living, Cleveland metro senior care, Cuyahoga County assisted living, Northeast Ohio senior communities',
  openGraph: {
    title: 'Senior Living in Greater Cleveland | Guide for Seniors',
    description: 'Explore 150+ senior living communities across Greater Cleveland. Find assisted living, memory care, and independent living in your preferred neighborhood.',
    url: 'https://guideforseniors.com/greater-cleveland',
    siteName: 'Guide for Seniors',
  },
};

// Define Greater Cleveland cities with additional info
const greaterClevelandCities = [
  { name: 'Cleveland', description: 'Ohio\'s second-largest city with diverse senior living options', clinicalAnchor: 'Cleveland Clinic Main Campus' },
  { name: 'Beachwood', description: 'Upscale community with premium senior care facilities', clinicalAnchor: 'UH Ahuja Medical Center', tier: 1 },
  { name: 'Shaker Heights', description: 'Historic suburb with elegant senior communities', tier: 1 },
  { name: 'Westlake', description: 'West side community with modern senior living', clinicalAnchor: 'St. John Medical Center', tier: 1 },
  { name: 'Chagrin Falls', description: 'Charming village with luxury senior care options', clinicalAnchor: 'Hillcrest Hospital', tier: 1 },
  { name: 'Hudson', description: 'Affluent community with upscale memory care', clinicalAnchor: 'Western Reserve Hospital', tier: 1 },
  { name: 'Independence', description: 'Convenient location with quality care options' },
  { name: 'Strongsville', description: 'Family-friendly area with senior care facilities', clinicalAnchor: 'Southwest General' },
  { name: 'Seven Hills', description: 'Safe suburb with dedicated assisted living', clinicalAnchor: 'Parma Hospital' },
  { name: 'Richmond Heights', description: 'East side community with quality memory care', clinicalAnchor: 'Hillcrest Hospital' },
  { name: 'Bedford', description: 'Established suburb with specialized AL/MC care' },
  { name: 'Mayfield Heights', description: 'East side location with various care levels' },
  { name: 'North Olmsted', description: 'Shopping and healthcare access for seniors' },
  { name: 'Rocky River', description: 'Lakefront community with senior living', tier: 1 },
  { name: 'Solon', description: 'Growing community with modern facilities', tier: 1 },
  { name: 'Parma', description: 'Affordable options with good healthcare access' },
  { name: 'Lakewood', description: 'Walkable city with community-focused living', clinicalAnchor: 'Fairview Hospital' },
];

// ISR: Revalidate every hour
export const revalidate = 3600;

export default async function GreaterClevelandPage() {
  // Fetch live community data from Supabase
  const communityData = await fetchAllCommunities();
  
  // Count communities by city
  const cityCounts = greaterClevelandCities.map(city => {
    const count = communityData.filter(
      c => c.location.split(',')[0].trim().toLowerCase() === city.name.toLowerCase()
    ).length;
    return { ...city, count };
  });

  // Sort: Tier 1 cities first, then by count
  const sortedCities = cityCounts.sort((a, b) => {
    if (a.tier === 1 && b.tier !== 1) return -1;
    if (a.tier !== 1 && b.tier === 1) return 1;
    return b.count - a.count;
  });

  const totalCommunities = communityData.length;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <GlobalHeader />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50 py-16 md:py-24 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-teal-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <span className="inline-block bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                Greater Cleveland Metro
              </span>
              
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Senior Living in Greater Cleveland
              </h1>
              <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-10">
                Explore {totalCommunities}+ senior living communities across Cuyahoga County and the Greater Cleveland metropolitan area. 
                Find the perfect assisted living, memory care, or independent living community in your preferred neighborhood.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <div className="bg-white px-6 py-3 rounded-xl shadow-md border border-slate-200 flex items-center gap-2">
                  <Home className="h-5 w-5 text-teal-600" />
                  <span className="font-bold text-slate-900">{totalCommunities}+ Communities</span>
                </div>
                <div className="bg-white px-6 py-3 rounded-xl shadow-md border border-slate-200 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-teal-600" />
                  <span className="font-bold text-slate-900">{greaterClevelandCities.length} Cities</span>
                </div>
                <div className="bg-white px-6 py-3 rounded-xl shadow-md border border-slate-200 flex items-center gap-2">
                  <Users className="h-5 w-5 text-teal-600" />
                  <span className="font-bold text-slate-900">All Care Levels</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cities Grid */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Senior Living Communities by City
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Click on any city to view detailed community listings, pricing, and availability.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {sortedCities.map((city) => (
                <Link
                  key={city.name}
                  href={city.count > 0 ? `/location/${city.name.toLowerCase().replace(/\s+/g, '-')}` : '#'}
                  className={`group block p-6 bg-white rounded-2xl border-2 transition-all duration-300
                    ${city.count > 0 
                      ? 'border-slate-200 hover:border-teal-300 hover:shadow-xl' 
                      : 'border-slate-100 opacity-60 cursor-not-allowed'
                    }
                    ${city.tier === 1 ? 'ring-2 ring-teal-100' : ''}
                  `}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors flex items-center gap-2">
                        {city.name}
                        {city.tier === 1 && (
                          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-xs px-2 py-0.5 rounded-full">
                            <Star className="h-3 w-3 fill-white" />
                            Premium
                          </span>
                        )}
                      </h3>
                    </div>
                    {city.count > 0 && (
                      <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {city.count} {city.count === 1 ? 'Community' : 'Communities'}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 text-sm mb-3">
                    {city.description}
                  </p>
                  {city.clinicalAnchor && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                      <Hospital className="h-3.5 w-3.5" />
                      <span>Near {city.clinicalAnchor}</span>
                    </div>
                  )}
                  {city.count === 0 ? (
                    <p className="text-slate-400 text-sm italic">Coming soon</p>
                  ) : (
                    <div className="flex items-center text-teal-600 font-semibold text-sm group-hover:gap-2 transition-all">
                      <span>View Communities</span>
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Regional Information */}
        <section className="py-16 md:py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 text-center">
                About Senior Living in Greater Cleveland
              </h2>
              
              <div className="grid md:grid-cols-2 gap-12">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Why Choose Greater Cleveland?</h3>
                  <ul className="space-y-4">
                    {[
                      'World-class healthcare with Cleveland Clinic and University Hospitals',
                      'Affordable cost of living compared to national averages',
                      'Rich cultural amenities including museums, theaters, and parks',
                      'Four seasons with beautiful fall foliage and mild summers',
                      'Strong senior services and community support programs',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="bg-teal-100 rounded-full p-1 mt-0.5">
                          <svg className="h-3 w-3 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Types of Senior Care Available</h3>
                  <div className="space-y-5">
                    {[
                      { title: 'Independent Living', desc: 'Maintenance-free lifestyle with social activities and amenities' },
                      { title: 'Assisted Living', desc: 'Personal care assistance while maintaining independence' },
                      { title: 'Memory Care', desc: 'Specialized care for Alzheimer\'s and dementia' },
                      { title: 'Skilled Nursing', desc: '24/7 medical care and rehabilitation services' },
                    ].map((type, i) => (
                      <div key={i}>
                        <h4 className="font-bold text-teal-700">{type.title}</h4>
                        <p className="text-slate-600 text-sm">{type.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Need Help Finding the Right Community?
            </h2>
            <p className="text-slate-300 mb-10 max-w-2xl mx-auto text-lg">
              Our senior living advisors are familiar with Greater Cleveland communities and can help 
              you find the perfect match based on your needs, preferences, and budget.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Users className="h-5 w-5" />
                <span>Get Free Assistance</span>
              </Link>
              <a
                href="tel:+12166774630"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-900 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Phone className="h-5 w-5" />
                <span>Call (216) 677-4630</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
