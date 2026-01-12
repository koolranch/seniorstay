import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Hospital, MapPin, Shield, Clock, Star, Check, 
  Phone, Calendar, Users, Award, ArrowRight, 
  Building2, Heart, Stethoscope, Home
} from 'lucide-react';
import { fetchCommunityById, fetchCommunityBySlug, fetchCommunitiesByRegion } from '@/lib/fetch-community';
import { findNearestHospital, getNearestHospitalForCity } from '@/lib/hospital-proximity';
import { getNeighborhoodHubData } from '@/data/neighborhood-hub-data';
import { 
  isValidRegion, 
  getRegionConfig, 
  getAllRegionSlugs,
  getRegionPhoneNumber 
} from '@/data/regions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import NeighborhoodEvents from '@/components/events/NeighborhoodEvents';
import StickyLeadCapture from '@/components/community/StickyLeadCapture';
import SimilarCommunities from '@/components/community/SimilarCommunities';
import CommunityContact from '@/components/community/CommunityContact';
import CareNeedsQuiz from '@/components/community/CareNeedsQuiz';
import MapComponent from '@/components/map/GoogleMap';

// ISR: Revalidate every hour
export const revalidate = 3600;

interface CommunityPageProps {
  params: { region: string; id: string; slug: string };
}

// Generate metadata with region-aware canonical URL
export async function generateMetadata({ params }: CommunityPageProps): Promise<Metadata> {
  const { region, id, slug } = params;
  
  // Validate region
  if (!isValidRegion(region)) {
    return {
      title: 'Region Not Found | Guide for Seniors',
      description: 'The requested region could not be found.',
    };
  }
  
  const regionConfig = getRegionConfig(region);
  
  let community = await fetchCommunityById(id, region);
  if (!community) {
    community = await fetchCommunityBySlug(slug, region);
  }

  if (!community) {
    return {
      title: 'Community Not Found | Guide for Seniors',
      description: 'The requested senior living community could not be found.',
    };
  }

  const city = community.location.split(',')[0].trim();
  const citySlug = city.toLowerCase().replace(/\s+/g, '-');
  const baseUrl = 'https://www.guideforseniors.com';
  const canonicalUrl = `${baseUrl}/${region}/community/${id}/${slug}`;
  const currentYear = new Date().getFullYear();
  const stateAbbr = regionConfig?.stateAbbr || 'OH';
  
  // Determine care type for title
  const primaryCareType = community.careTypes.includes('Memory Care') 
    ? 'Memory Care' 
    : community.careTypes.includes('Assisted Living') 
      ? 'Assisted Living' 
      : 'Senior Living';
  
  // Get nearest hospital
  let nearestHospitalName = getNearestHospitalForCity(citySlug);
  let hospitalDistance = '';
  
  if (community.coordinates) {
    const nearestHospital = findNearestHospital(community.coordinates.lat, community.coordinates.lng, 'major_system');
    if (nearestHospital) {
      nearestHospitalName = nearestHospital.hospital.shortName;
      hospitalDistance = `${nearestHospital.distance} miles from `;
    }
  }
  
  // SEO SAFETY: Check if profile is "incomplete"
  const hasDescription = community.description && community.description.trim().length > 50;
  const communityImage = community.images?.[0] || '';
  const hasPlaceholderImage = !communityImage || 
    communityImage.toLowerCase().includes('placeholder') ||
    communityImage.toLowerCase().includes('no-image');
  const isIncompleteProfile = !hasDescription || hasPlaceholderImage;
  
  // Region-aware title
  const title = `${community.name} | ${primaryCareType} in ${city}, ${stateAbbr} Near ${nearestHospitalName}`;
  
  // Region-aware description
  const description = community.description 
    ? `${currentYear} guide: ${community.name} offers ${primaryCareType.toLowerCase()} in ${city}, ${stateAbbr}—${hospitalDistance}${nearestHospitalName}. ${community.description.substring(0, 120)}... Free consultation available.`
    : `${currentYear} guide: Explore ${community.name}, a ${primaryCareType.toLowerCase()} community in ${city}, ${stateAbbr} near ${nearestHospitalName}. Get verified pricing and schedule tours.`;
  
  const keywords = `${community.name}, ${primaryCareType.toLowerCase()} ${city} ${stateAbbr.toLowerCase()}, senior living ${city}, ${community.careTypes.join(', ').toLowerCase()}`;
  const ogImageUrl = communityImage || `${baseUrl}/images/default-community.jpg`;
  const ogTitle = `${city} Senior Care | ${community.name.slice(0, 30)}`;
  const ogDescription = community.description 
    ? `${primaryCareType} ${hospitalDistance}${nearestHospitalName}. ${community.description.substring(0, 80)}... Free tour & pricing.`
    : `Discover ${community.name}, offering ${primaryCareType.toLowerCase()} in ${city}, ${stateAbbr} near ${nearestHospitalName}.`;
  
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: ogTitle.slice(0, 60),
      description: ogDescription.slice(0, 160),
      url: canonicalUrl,
      siteName: 'Guide for Seniors',
      locale: 'en_US',
      type: 'article',
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    robots: isIncompleteProfile 
      ? { index: false, follow: true, noarchive: true }
      : { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' as const },
  };
}

export default async function CommunityPage({ params }: CommunityPageProps) {
  const { region, id, slug } = params;
  
  // Validate region
  if (!isValidRegion(region)) {
    notFound();
  }
  
  const regionConfig = getRegionConfig(region);
  if (!regionConfig) {
    notFound();
  }
  
  const phoneNumber = getRegionPhoneNumber(region);
  
  // Fetch community data
  const [communityById, communityBySlug, allCommunities] = await Promise.all([
    fetchCommunityById(id, region),
    fetchCommunityBySlug(slug, region),
    fetchCommunitiesByRegion(region)
  ]);
  
  const community = communityById || communityBySlug;
  
  if (!community) {
    notFound();
  }

  const cityName = community.location.split(',')[0].trim();
  const citySlug = cityName.toLowerCase().replace(/\s+/g, '-');
  const neighborhoodData = getNeighborhoodHubData(citySlug);
  const baseUrl = 'https://www.guideforseniors.com';

  // Check if this is a skilled nursing-only facility
  const isOnlySkilledNursing = community.careTypes.every(type => 
    type.toLowerCase().includes('skilled nursing')
  ) && !community.careTypes.some(type =>
    type.toLowerCase().includes('assisted living') ||
    type.toLowerCase().includes('memory care')
  );

  // Primary care type for schema
  const primaryCareType = community.careTypes.includes('Memory Care') 
    ? 'MemoryCare' 
    : community.careTypes.includes('Assisted Living') 
      ? 'AssistedLivingFacility' 
      : 'SeniorLivingCommunity';
  
  // Get hospital proximity
  let nearestHospital: { hospital: { name: string; shortName: string; medicalSystem: string }; distance: number } | null = null;
  if (community.coordinates) {
    nearestHospital = findNearestHospital(community.coordinates.lat, community.coordinates.lng, 'major_system');
  }

  // JSON-LD Schema - Region-aware URLs
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", primaryCareType],
    "@id": `${baseUrl}/${region}/community/${id}/${slug}`,
    "name": community.name,
    "description": community.description || `Quality senior living community in ${cityName}, ${regionConfig.stateAbbr}.`,
    "url": `${baseUrl}/${region}/community/${id}/${slug}`,
    "telephone": phoneNumber,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": community.address || "",
      "addressLocality": cityName,
      "addressRegion": regionConfig.stateAbbr,
      "postalCode": community.zip || "",
      "addressCountry": "US"
    },
    "geo": community.coordinates ? {
      "@type": "GeoCoordinates",
      "latitude": community.coordinates.lat,
      "longitude": community.coordinates.lng
    } : undefined,
    "image": community.images?.[0] || `${baseUrl}/images/default-community.jpg`,
  };

  // Breadcrumb schema - Region-aware
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
      { "@type": "ListItem", "position": 2, "name": regionConfig.displayName, "item": `${baseUrl}/${region}` },
      { "@type": "ListItem", "position": 3, "name": cityName, "item": `${baseUrl}/${region}/${citySlug}` },
      { "@type": "ListItem", "position": 4, "name": community.name, "item": `${baseUrl}/${region}/community/${id}/${slug}` }
    ]
  };

  // Medical system colors for badges
  const getSystemColor = (system: string) => {
    const colors: Record<string, string> = {
      'Cleveland Clinic': 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30 text-emerald-100',
      'University Hospitals': 'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-100',
      'MetroHealth': 'from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-100',
      'Southwest General': 'from-orange-500/20 to-orange-600/20 border-orange-500/30 text-orange-100',
    };
    return colors[system] || 'from-slate-500/20 to-slate-600/20 border-slate-500/30 text-slate-100';
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([localBusinessSchema, breadcrumbSchema]) }}
      />

      {/* Hero Section with Image Gallery */}
      <section className="relative">
        <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
          <Carousel className="w-full h-full">
            <CarouselContent className="h-full">
              {community.images?.length > 0 ? (
                community.images.map((image, index) => (
                  <CarouselItem key={`gallery-${index}`} className="h-full">
                    <div className="relative w-full h-[40vh] md:h-[50vh]">
                      <Image
                        src={image}
                        alt={`${community.name} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                        priority={index === 0}
                      />
                    </div>
                  </CarouselItem>
                ))
              ) : (
                <CarouselItem className="h-full">
                  <div className="relative w-full h-[40vh] md:h-[50vh] bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                    <Building2 className="h-24 w-24 text-slate-600" />
                  </div>
                </CarouselItem>
              )}
            </CarouselContent>
            {community.images?.length > 1 && (
              <>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </>
            )}
          </Carousel>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
          
          {/* Region-aware back button */}
          <Link 
            href={`/${region}/${citySlug}`}
            className="absolute top-4 left-4 z-10 flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-medium backdrop-blur-md bg-black/30 hover:bg-black/50 transition-colors"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to {cityName}
          </Link>
          
          <button className="absolute top-4 right-4 z-10 p-3 rounded-full backdrop-blur-md bg-black/30 hover:bg-black/50 transition-colors">
            <Heart className="h-5 w-5 text-white" />
          </button>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
            <div className="container mx-auto">
              <div className="flex flex-wrap gap-2 mb-3">
                {community.careTypes.map((type, i) => (
                  <Badge key={i} className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                    {type}
                  </Badge>
                ))}
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
                {community.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {community.location}
                </span>
                {community.overallRating && (
                  <span className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {community.overallRating} / 5
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Layout */}
      <section className="container mx-auto px-4 py-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          
          {/* Card 1: Safety & Proximity */}
          {nearestHospital && (
            <div 
              className="lg:col-span-2 rounded-2xl p-6 border overflow-hidden relative"
              style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                borderColor: 'rgba(141, 163, 153, 0.3)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-1">
                      <Shield className="h-5 w-5" style={{ color: '#8DA399' }} />
                      Safety & Medical Proximity
                    </h2>
                    <p className="text-slate-400 text-sm">
                      Critical healthcare access for peace of mind
                    </p>
                  </div>
                  <div className={`px-4 py-2 rounded-xl border bg-gradient-to-r ${getSystemColor(nearestHospital.hospital.medicalSystem)}`}>
                    <span className="text-sm font-semibold">
                      {nearestHospital.hospital.medicalSystem}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <Hospital className="h-6 w-6 mb-2" style={{ color: '#8DA399' }} />
                    <p className="text-2xl font-bold text-white mb-1">
                      {nearestHospital.distance} mi
                    </p>
                    <p className="text-slate-400 text-sm">
                      to {nearestHospital.hospital.shortName}
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <Clock className="h-6 w-6 mb-2" style={{ color: '#8DA399' }} />
                    <p className="text-2xl font-bold text-white mb-1">
                      ~{Math.round(nearestHospital.distance * 2.5)} min
                    </p>
                    <p className="text-slate-400 text-sm">Average drive time</p>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <Stethoscope className="h-6 w-6 mb-2" style={{ color: '#8DA399' }} />
                    <p className="text-lg font-bold text-white mb-1">24/7 Access</p>
                    <p className="text-slate-400 text-sm">Emergency services</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Card 2: Care Needs Quiz */}
          <CareNeedsQuiz communityName={community.name} cityName={cityName} />

          {/* Card 3: Expert Take / About */}
          <div className="lg:col-span-2 rounded-2xl p-6 border bg-white" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2.5 rounded-xl shrink-0" style={{ backgroundColor: 'rgba(141, 163, 153, 0.15)' }}>
                <Award className="h-5 w-5" style={{ color: '#8DA399' }} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-1">Expert Consultant's Take</h2>
                <p className="text-sm text-slate-500">From our team of 20+ year regional specialists</p>
              </div>
            </div>
            
            {neighborhoodData?.expertTake ? (
              <div className="space-y-4">
                <p className="text-slate-700 leading-relaxed">
                  {neighborhoodData.expertTake.consultantPerspective}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Best for:</span>
                  {neighborhoodData.expertTake.bestFor.map((item, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{item}</Badge>
                  ))}
                </div>
              </div>
            ) : community.description ? (
              <p className="text-slate-700 leading-relaxed">{community.description}</p>
            ) : (
              <p className="text-slate-700 leading-relaxed">
                {community.name} is a respected senior living community in {cityName}, {regionConfig.stateAbbr},
                providing compassionate care in a welcoming environment.
              </p>
            )}
          </div>

          {/* Card 4: Neighborhood Events */}
          <div className="rounded-2xl overflow-hidden border bg-white" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
            <div className="px-5 py-4 border-b" style={{ backgroundColor: 'rgba(141, 163, 153, 0.08)' }}>
              <h3 className="font-semibold flex items-center gap-2 text-slate-900">
                <Calendar className="h-5 w-5" style={{ color: '#8DA399' }} />
                Neighborhood Pulse
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Upcoming events in {cityName}</p>
            </div>
            <NeighborhoodEvents 
              neighborhood={cityName} 
              limit={2}
              showHeader={false}
              className="border-0 shadow-none rounded-none"
            />
          </div>

          {/* Card 5: Care Types & Amenities */}
          <div className="lg:col-span-2 rounded-2xl p-6 border bg-white" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Home className="h-5 w-5" style={{ color: '#8DA399' }} />
              Services & Amenities
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Care Types</h3>
                <div className="space-y-2">
                  {community.careTypes.map((type, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg" style={{ backgroundColor: 'rgba(141, 163, 153, 0.1)' }}>
                      <Check className="h-4 w-4" style={{ color: '#8DA399' }} />
                      <span className="text-slate-700 text-sm">{type}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Amenities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {(community.amenities || ["24/7 Care Staff", "Restaurant-Style Dining", "Activity Programs", "Transportation", "Housekeeping", "Wellness Programs"])
                    .slice(0, 6).map((amenity, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <Check className="h-3.5 w-3.5 text-slate-400" />
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 6: Location & Map */}
          <div className="lg:col-span-3 rounded-2xl p-6 border bg-white" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5" style={{ color: '#8DA399' }} />
              Location & Address
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-slate-700 mb-2">{community.address}</p>
                <p className="text-slate-600 text-sm mb-4">{community.location}</p>
                {community.zip && (
                  <p className="text-sm text-slate-500 mb-4">ZIP Code: {community.zip}</p>
                )}
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(community.address + ' ' + community.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    Get Directions
                  </Button>
                </a>
              </div>
              
              <div className="h-48 md:h-64 rounded-xl overflow-hidden">
                {community.coordinates ? (
                  <MapComponent
                    communities={[community]}
                    height="100%"
                    zoom={15}
                    center={community.coordinates}
                    showInfoWindows={false}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center" style={{ backgroundColor: 'rgba(141, 163, 153, 0.1)' }}>
                    <div className="text-center text-slate-500">
                      <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Map loading...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Contact Section */}
      {!isOnlySkilledNursing && (
        <section className="container mx-auto px-4 py-8">
          <CommunityContact community={community} />
        </section>
      )}

      {/* Similar Communities */}
      <SimilarCommunities community={community} allCommunities={allCommunities} />

      {/* Sticky Lead Capture Bar */}
      {!isOnlySkilledNursing && (
        <StickyLeadCapture 
          neighborhood={cityName}
          communityName={community.name}
        />
      )}
    </div>
  );
}
