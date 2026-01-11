import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  MapPin, 
  Hospital, 
  Clock, 
  Building2, 
  Star, 
  ChevronRight,
  Download,
  Phone,
  ArrowRight,
  Sparkles,
  Shield,
  Heart,
  Users,
  TrendingUp,
  MessageCircle,
  HelpCircle,
  Navigation,
  Landmark,
  ShoppingBag,
  Trees
} from 'lucide-react';
import { 
  getNeighborhoodHubData, 
  getAllNeighborhoodSlugs,
  NeighborhoodHubData 
} from '@/data/neighborhood-hub-data';
import GlobalHeader from '@/components/home/GlobalHeader';
import Footer from '@/components/footer/Footer';
import NeighborhoodEvents from '@/components/events/NeighborhoodEvents';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/**
 * ============================================================================
 * NEIGHBORHOOD HUB PAGES - High-Value Local SEO & GEO Optimization
 * ============================================================================
 * Features:
 * - AIO Header for AI Overview optimization
 * - Local Pulse with events and proximity data
 * - E-E-A-T Expert Take section
 * - Stages of Care FAQ (Accordion)
 * - LocalBusiness + FAQPage + Event Schema injection
 * - Neighborhood-specific lead magnets
 * - Related Areas internal linking
 * ============================================================================
 */

// Theme colors
const NAVY = '#1e3a5f';
const SAGE_GREEN = '#8DA399';

// Generate static params for all neighborhoods
export async function generateStaticParams() {
  const slugs = getAllNeighborhoodSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate dynamic metadata
export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  const data = getNeighborhoodHubData(params.slug);
  
  if (!data) {
    return {
      title: 'Neighborhood Not Found | Guide for Seniors',
    };
  }

  const title = `Senior Living in ${data.name}, OH | Assisted Living & Memory Care | Guide for Seniors`;
  const description = data.aioHeader.answerSentence;

  return {
    title,
    description,
    keywords: [
      `${data.name} senior living`,
      `${data.name} assisted living`,
      `${data.name} memory care`,
      `${data.name} nursing homes`,
      `senior care ${data.name} Ohio`,
      ...data.aioHeader.semanticKeywords
    ].join(', '),
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_US',
      siteName: 'Guide for Seniors',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://www.guideforseniors.com/neighborhoods/${data.slug}`,
    },
  };
}

// Generate LocalBusiness Schema
function generateLocalBusinessSchema(data: NeighborhoodHubData) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `Guide for Seniors - ${data.name} Senior Living Placement`,
    "description": data.localBusinessSchema.description,
    "url": `https://www.guideforseniors.com/neighborhoods/${data.slug}`,
    "areaServed": {
      "@type": "City",
      "name": data.name,
      "containedInPlace": {
        "@type": "State",
        "name": "Ohio"
      }
    },
    "serviceType": "Senior Living Placement Services",
    "priceRange": "Free",
    "telephone": "+1-216-505-0555",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": data.name,
      "addressRegion": "OH",
      "addressCountry": "US"
    }
  };
}

// Generate FAQPage Schema
function generateFaqSchema(data: NeighborhoodHubData) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": data.faq.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };
}

// Generate BreadcrumbList Schema
function generateBreadcrumbSchema(data: NeighborhoodHubData) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.guideforseniors.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Neighborhoods",
        "item": "https://www.guideforseniors.com/greater-cleveland"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": `${data.name} Senior Living`,
        "item": `https://www.guideforseniors.com/neighborhoods/${data.slug}`
      }
    ]
  };
}

// Icon helper for landmark types
function getLandmarkIcon(type: string) {
  switch (type) {
    case 'hospital': return <Hospital className="h-4 w-4 text-red-500" />;
    case 'shopping': return <ShoppingBag className="h-4 w-4 text-blue-500" />;
    case 'park': return <Trees className="h-4 w-4 text-green-500" />;
    case 'cultural': return <Landmark className="h-4 w-4 text-purple-500" />;
    default: return <MapPin className="h-4 w-4 text-slate-500" />;
  }
}

export default async function NeighborhoodHubPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const data = getNeighborhoodHubData(params.slug);
  
  if (!data) {
    notFound();
  }

  const localBusinessSchema = generateLocalBusinessSchema(data);
  const faqSchema = generateFaqSchema(data);
  const breadcrumbSchema = generateBreadcrumbSchema(data);

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <GlobalHeader />

      <main className="min-h-screen bg-slate-50">
        {/* ================================================================
            SECTION 1: AIO HEADER - GEO Optimization
            ================================================================ */}
        <section 
          className="relative py-16 md:py-24 overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, ${NAVY} 0%, #2d4a6f 50%, ${SAGE_GREEN}40 100%)` 
          }}
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-white/70 text-sm mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/greater-cleveland" className="hover:text-white transition-colors">Cleveland</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white font-medium">{data.name}</span>
            </nav>

            {/* AIO Headline */}
            <div className="max-w-4xl">
              <Badge 
                className="mb-4 text-white border-white/30"
                style={{ backgroundColor: `${SAGE_GREEN}90` }}
              >
                <Sparkles className="h-3 w-3 mr-1" />
                {data.county} County • {data.zipCodes.join(', ')}
              </Badge>

              <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {data.aioHeader.headline}
              </h1>

              {/* The Answer Sentence - Optimized for AI Overviews */}
              <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-8 max-w-3xl">
                {data.aioHeader.answerSentence}
              </p>

              {/* Semantic Keywords (visually subtle, SEO important) */}
              <div className="flex flex-wrap gap-2 mb-8">
                {data.aioHeader.semanticKeywords.map((keyword, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80 border border-white/20"
                  >
                    {keyword}
                  </span>
                ))}
              </div>

              {/* Primary CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={`/senior-living-costs-cleveland?neighborhood=${data.slug}`}>
                  <Button 
                    size="lg" 
                    className="text-white font-bold shadow-lg hover:shadow-xl transition-all"
                    style={{ backgroundColor: SAGE_GREEN }}
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Get the 2026 {data.name} Cost Report
                  </Button>
                </Link>
                <Link href="/assessment">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-white text-white hover:bg-white/10"
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    Free Consultation
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 2: LOCAL PULSE - Live Data + Proximity
            ================================================================ */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Proximity Map (Text-Based) */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2 mb-6">
                  <Navigation className="h-6 w-6" style={{ color: NAVY }} />
                  <h2 className="text-2xl font-bold text-slate-900">
                    The Local Pulse: {data.name} at a Glance
                  </h2>
                </div>

                {/* Key Insight Card */}
                <Card className="mb-6 border-l-4" style={{ borderLeftColor: SAGE_GREEN }}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div 
                        className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${SAGE_GREEN}20` }}
                      >
                        <Hospital className="h-6 w-6" style={{ color: SAGE_GREEN }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">
                          Healthcare Access Insight
                        </h3>
                        <p className="text-slate-600 leading-relaxed">
                          {data.proximity.localInsight}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Proximity Grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Primary Hospital */}
                  <Card className="bg-red-50/50 border-red-100">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Hospital className="h-5 w-5 text-red-600" />
                        <span className="text-sm font-medium text-red-800">Nearest Hospital</span>
                      </div>
                      <h4 className="font-semibold text-slate-900 mb-1">
                        {data.proximity.hospital.name}
                      </h4>
                      <p className="text-sm text-slate-600">
                        {data.proximity.hospital.distance} • {data.proximity.hospital.driveTime} drive
                      </p>
                    </CardContent>
                  </Card>

                  {/* Other Landmarks */}
                  {data.proximity.landmarks.slice(1, 4).map((landmark, idx) => (
                    <Card key={idx} className="bg-slate-50/50">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-3">
                          {getLandmarkIcon(landmark.type)}
                          <span className="text-sm font-medium text-slate-600 capitalize">
                            {landmark.type}
                          </span>
                        </div>
                        <h4 className="font-semibold text-slate-900 mb-1">
                          {landmark.name}
                        </h4>
                        <p className="text-sm text-slate-600">
                          {landmark.distance}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Events Widget */}
              <div>
                <NeighborhoodEvents 
                  neighborhood={data.name}
                  limit={3}
                  showHeader={true}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 3: E-E-A-T EXPERT TAKE
            ================================================================ */}
        <section className="py-12 md:py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 mb-6">
                <MessageCircle className="h-6 w-6" style={{ color: NAVY }} />
                <h2 className="text-2xl font-bold text-slate-900">
                  Consultant&apos;s Perspective on {data.name}
                </h2>
              </div>

              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-3">
                    {/* Expert Quote */}
                    <div 
                      className="md:col-span-2 p-8"
                      style={{ backgroundColor: `${NAVY}08` }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: NAVY }}
                        >
                          GS
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">Guide for Seniors Team</p>
                          <p className="text-sm text-slate-600">20+ Years Regional Experience</p>
                        </div>
                      </div>
                      
                      <blockquote className="text-slate-700 leading-relaxed text-lg italic border-l-4 pl-4" style={{ borderLeftColor: SAGE_GREEN }}>
                        &ldquo;{data.expertTake.consultantPerspective}&rdquo;
                      </blockquote>
                    </div>

                    {/* Best For Section */}
                    <div className="p-6 bg-white border-l border-slate-200">
                      <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Star className="h-5 w-5" style={{ color: SAGE_GREEN }} />
                        {data.name} is Best For:
                      </h3>
                      <ul className="space-y-3">
                        {data.expertTake.bestFor.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                            <ChevronRight className="h-4 w-4 shrink-0 mt-0.5" style={{ color: SAGE_GREEN }} />
                            {item}
                          </li>
                        ))}
                      </ul>

                      {/* Differentiator Badge */}
                      <div className="mt-6 pt-4 border-t border-slate-100">
                        <Badge 
                          variant="secondary"
                          className="text-xs"
                        >
                          Key Differentiator: {data.expertTake.differentiator}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 4: MARKET DATA & COSTS
            ================================================================ */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-6 w-6" style={{ color: NAVY }} />
                <h2 className="text-2xl font-bold text-slate-900">
                  {data.name} Senior Living Costs (2026)
                </h2>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                {/* Assisted Living */}
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <Heart className="h-8 w-8 mx-auto mb-3 text-rose-500" />
                    <h3 className="font-semibold text-slate-900 mb-1">Assisted Living</h3>
                    <p className="text-xl font-bold" style={{ color: NAVY }}>
                      {data.marketData.averageAssistedLiving}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">per month</p>
                  </CardContent>
                </Card>

                {/* Memory Care */}
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <Shield className="h-8 w-8 mx-auto mb-3 text-purple-500" />
                    <h3 className="font-semibold text-slate-900 mb-1">Memory Care</h3>
                    <p className="text-xl font-bold" style={{ color: NAVY }}>
                      {data.marketData.averageMemoryCare}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">per month</p>
                  </CardContent>
                </Card>

                {/* Independent Living */}
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <Users className="h-8 w-8 mx-auto mb-3 text-teal-500" />
                    <h3 className="font-semibold text-slate-900 mb-1">Independent Living</h3>
                    <p className="text-xl font-bold" style={{ color: NAVY }}>
                      {data.marketData.averageIndependentLiving}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">per month</p>
                  </CardContent>
                </Card>
              </div>

              {/* Market Trend + Waitlist Note */}
              <Card className="border-l-4" style={{ borderLeftColor: SAGE_GREEN }}>
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <Badge 
                        className="mb-2"
                        variant={data.marketData.marketTrend === 'high_demand' ? 'destructive' : 'secondary'}
                      >
                        {data.marketData.marketTrend === 'high_demand' ? '🔥 High Demand Market' : 
                         data.marketData.marketTrend === 'moderate' ? '📊 Moderate Demand' : '📈 Emerging Market'}
                      </Badge>
                      {data.marketData.waitlistNote && (
                        <p className="text-sm text-slate-600">
                          {data.marketData.waitlistNote}
                        </p>
                      )}
                    </div>
                    <Link href={`/senior-living-costs-cleveland?neighborhood=${data.slug}`}>
                      <Button style={{ backgroundColor: NAVY }}>
                        <Download className="h-4 w-4 mr-2" />
                        Get Full Cost Report
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 5: STAGES OF CARE FAQ (Accordion)
            ================================================================ */}
        <section className="py-12 md:py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-2 mb-6">
                <HelpCircle className="h-6 w-6" style={{ color: NAVY }} />
                <h2 className="text-2xl font-bold text-slate-900">
                  What Families Are Asking About {data.name}
                </h2>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <Accordion type="single" collapsible className="w-full">
                    {data.faq.map((item, idx) => (
                      <AccordionItem key={idx} value={`item-${idx}`}>
                        <AccordionTrigger className="text-left font-medium text-slate-900 hover:no-underline">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600 leading-relaxed">
                          <p className="mb-3">{item.answer}</p>
                          {item.linkText && item.linkUrl && (
                            <Link 
                              href={item.linkUrl}
                              className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
                              style={{ color: SAGE_GREEN }}
                            >
                              {item.linkText}
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 6: CONVERSION CTA
            ================================================================ */}
        <section 
          className="py-16 md:py-20"
          style={{ backgroundColor: NAVY }}
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Explore {data.name} Senior Living?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Our free, no-obligation service connects you with the best communities 
              in {data.name}. Get personalized recommendations based on your family&apos;s 
              unique needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/assessment">
                <Button 
                  size="lg" 
                  className="text-white font-bold"
                  style={{ backgroundColor: SAGE_GREEN }}
                >
                  Start Your Free Assessment
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link href={`/location/${data.slug}`}>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  <Building2 className="h-5 w-5 mr-2" />
                  View {data.name} Communities
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 7: RELATED AREAS (Internal Linking)
            ================================================================ */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
              Explore Nearby Communities
            </h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {data.relatedAreas.map((area, idx) => (
                <Link 
                  key={idx}
                  href={`/neighborhoods/${area.slug}`}
                  className="group"
                >
                  <Card className="h-full transition-all hover:shadow-md hover:border-slate-300">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4" style={{ color: SAGE_GREEN }} />
                        <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors">
                          {area.name}
                        </h3>
                      </div>
                      <p className="text-sm text-slate-600">
                        {area.relationship}
                      </p>
                      <span 
                        className="inline-flex items-center gap-1 text-xs font-medium mt-3"
                        style={{ color: SAGE_GREEN }}
                      >
                        Explore
                        <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Back to all locations */}
            <div className="text-center mt-8">
              <Link href="/greater-cleveland">
                <Button variant="outline">
                  View All Greater Cleveland Neighborhoods
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
