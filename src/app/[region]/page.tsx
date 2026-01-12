import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MapPin, Home, Users, ArrowRight, Hospital, Phone, Star, BookOpen, Calendar } from 'lucide-react';
import GlobalHeader from '@/components/home/GlobalHeader';
import Footer from '@/components/footer/Footer';
import { fetchCommunitiesByRegion } from '@/lib/fetch-community';
import { fetchRegionalOnlyPosts } from '@/lib/blog-posts';
import { 
  getRegionConfig, 
  getAllRegionSlugs, 
  isValidRegion,
  getRegionPhoneNumber,
  getHubCities,
  type RegionConfig 
} from '@/data/regions';

interface RegionPageProps {
  params: { region: string };
}

// Generate static params for all regions
export async function generateStaticParams() {
  return getAllRegionSlugs().map((region) => ({
    region,
  }));
}

// Generate dynamic metadata based on region
export async function generateMetadata({ params }: RegionPageProps): Promise<Metadata> {
  const { region } = params;
  const regionConfig = getRegionConfig(region);
  
  if (!regionConfig) {
    return {
      title: 'Region Not Found | Guide for Seniors',
      description: 'The requested region could not be found.',
    };
  }

  const baseUrl = 'https://www.guideforseniors.com';
  const canonicalUrl = `${baseUrl}/${region}`;
  
  return {
    title: `Senior Living in ${regionConfig.displayName} | Browse All Communities | Guide for Seniors`,
    description: regionConfig.seo.defaultDescription,
    keywords: regionConfig.seo.keywords.join(', '),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `Senior Living in ${regionConfig.displayName} | Guide for Seniors`,
      description: regionConfig.seo.defaultDescription,
      url: canonicalUrl,
      siteName: 'Guide for Seniors',
    },
  };
}

// ISR: Revalidate every hour
export const revalidate = 3600;

export default async function RegionHubPage({ params }: RegionPageProps) {
  const { region } = params;
  
  // Validate region
  if (!isValidRegion(region)) {
    notFound();
  }
  
  const regionConfig = getRegionConfig(region);
  if (!regionConfig) {
    notFound();
  }
  
  // Fetch live community data from Supabase for this region
  const [communityData, regionalPosts] = await Promise.all([
    fetchCommunitiesByRegion(region),
    fetchRegionalOnlyPosts(region, 3), // Get 3 most recent Cleveland-specific posts
  ]);
  
  // Get hub cities from config
  const hubCities = getHubCities(region);
  
  // Count communities by city
  const cityCounts = hubCities.map(city => {
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
  const phoneNumber = getRegionPhoneNumber(region);

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
                {regionConfig.metroName}
              </span>
              
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Senior Living in {regionConfig.displayName}
              </h1>
              <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-10">
                {regionConfig.description}
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <div className="bg-white px-6 py-3 rounded-xl shadow-md border border-slate-200 flex items-center gap-2">
                  <Home className="h-5 w-5 text-teal-600" />
                  <span className="font-bold text-slate-900">{totalCommunities}+ Communities</span>
                </div>
                <div className="bg-white px-6 py-3 rounded-xl shadow-md border border-slate-200 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-teal-600" />
                  <span className="font-bold text-slate-900">{hubCities.length} Cities</span>
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
                  href={city.count > 0 ? `/${region}/${city.name.toLowerCase().replace(/\s+/g, '-')}` : '#'}
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

        {/* Local Expert Advice Section */}
        {regionalPosts.length > 0 && (
          <section className="py-16 md:py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <span className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                    <BookOpen className="h-4 w-4" />
                    Local Expert Advice
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {regionConfig.displayName} Senior Care Insights
                  </h2>
                  <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                    Expert guidance from our local advisors who know {regionConfig.displayName} communities inside and out.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {regionalPosts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group block bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:bg-white/10 hover:border-teal-500/50 transition-all duration-300"
                    >
                      {post.image && (
                        <div className="relative h-40 overflow-hidden">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                          <span className="absolute bottom-3 left-3 bg-teal-600/90 text-white text-xs px-2 py-1 rounded-full font-medium">
                            {post.category}
                          </span>
                        </div>
                      )}
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-teal-300 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                          {post.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(post.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </span>
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                
                <div className="text-center mt-10">
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl border border-white/20 transition-all"
                  >
                    <span>View All {regionConfig.displayName} Articles</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Regional Information */}
        <section className="py-16 md:py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 text-center">
                About Senior Living in {regionConfig.displayName}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-12">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Why Choose {regionConfig.displayName}?</h3>
                  <ul className="space-y-4">
                    {getRegionHighlights(region).map((item, i) => (
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
              Our senior living advisors are familiar with {regionConfig.displayName} communities and can help 
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
                href={`tel:${phoneNumber.replace(/[^0-9+]/g, '')}`}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-900 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Phone className="h-5 w-5" />
                <span>Call {phoneNumber}</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// Helper function to get region-specific highlights
function getRegionHighlights(regionSlug: string): string[] {
  const highlights: Record<string, string[]> = {
    'cleveland': [
      'World-class healthcare with Cleveland Clinic and University Hospitals',
      'Affordable cost of living compared to national averages',
      'Rich cultural amenities including museums, theaters, and parks',
      'Four seasons with beautiful fall foliage and mild summers',
      'Strong senior services and community support programs',
    ],
    'columbus': [
      'Home to Ohio State University Wexner Medical Center',
      'Vibrant arts and cultural scene',
      'Growing economy with diverse job opportunities for family members',
      'Extensive park system and outdoor recreation',
      'Strong community support programs for seniors',
    ],
  };
  
  return highlights[regionSlug] || highlights['cleveland'];
}
