import GlobalHeader from '@/components/home/GlobalHeader';
import Footer from '@/components/footer/Footer';
import { Heart, Shield, Award, MapPin, Phone, CheckCircle, ArrowRight, Star, Eye, Building2, Users, Sparkles, ClipboardCheck, HeartHandshake, AlertTriangle } from 'lucide-react';
import Script from 'next/script';
import Link from 'next/link';
import Image from 'next/image';

// ============================================================================
// ABOUT PAGE - BOUTIQUE CONCIERGE DESIGN
// 20-Year Senior Living Insider | Regional Director Experience
// ============================================================================

export const metadata = {
  title: 'About Us | 20-Year Senior Living Insider | Guide for Seniors Cleveland',
  description: 'Meet the Guide for Seniors founder - a former Regional Director with 20 years of experience auditing and elevating senior living communities across the Midwest. Boutique, insider guidance for Cleveland families.',
  alternates: {
    canonical: 'https://www.guideforseniors.com/about',
  },
};

// Organization and founder schema for E-E-A-T signals
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://guideforseniors.com/#organization",
  "name": "Guide for Seniors",
  "url": "https://guideforseniors.com",
  "description": "Boutique senior living advisory service founded by a 20-year industry veteran and former Regional Director. Serving Greater Cleveland families with insider expertise.",
  "foundingDate": "2018",
  "areaServed": {
    "@type": "State",
    "name": "Ohio",
    "containedInPlace": {
      "@type": "Country",
      "name": "United States"
    }
  },
  "knowsAbout": [
    "Assisted Living",
    "Memory Care",
    "Independent Living",
    "Senior Care Quality Assessment",
    "Life Enrichment Programs",
    "Resident Experience",
    "Ohio Medicaid Waiver",
    "Cleveland Senior Services"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-216-677-4630",
    "contactType": "customer service",
    "availableLanguage": "English"
  }
};

const founderSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://guideforseniors.com/#founder",
  "name": "Guide for Seniors Founder",
  "jobTitle": "Senior Living Consultant & Former Regional Director",
  "description": "20-year senior living industry veteran with experience as Regional Director, Executive Director, Hospice Liaison, and Activity Director.",
  "worksFor": {
    "@id": "https://guideforseniors.com/#organization"
  },
  "knowsAbout": [
    "Regional Quality Oversight",
    "Life Enrichment Programs",
    "Resident Experience",
    "Senior Living Operations",
    "Hospital Discharge Planning",
    "Medical Transitions",
    "Hospice Care",
    "Memory Care",
    "Assisted Living",
    "Independent Living"
  ]
};

// Career journey milestones
const careerJourney = [
  {
    role: "Regional Director (Midwest)",
    icon: Building2,
    description: "Audited and elevated resident life enrichment and social programming for a large portfolio of communities across multiple states.",
    highlight: true,
    years: "Senior Leadership"
  },
  {
    role: "Executive Director",
    icon: ClipboardCheck,
    description: "Led the daily operations, staffing, and clinical standards of individual senior living buildings.",
    highlight: false,
    years: "Operations"
  },
  {
    role: "Hospital & Hospice Liaison",
    icon: HeartHandshake,
    description: "Embedded alongside social workers and discharge planners at Cleveland Clinic, UH, and St. John Medical Center. I speak the language of hospital staff and navigate 48-hour discharge crises so you can focus on being a family member.",
    highlight: false,
    years: "Clinical / Transitions"
  },
  {
    role: "Activity Director",
    icon: Sparkles,
    description: "Where it all began - learning the importance of joy, dignity, and daily purpose for every resident.",
    highlight: false,
    years: "Foundation"
  }
];

// Brand colors matching PDF guides
const COLORS = {
  navy: '#001F3F',
  sage: '#8DA399',
  sageLight: '#A8C0B0',
  sagePale: '#E8F0EB',
  white: '#FFFFFF',
  cream: '#FAFBF9',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Structured Data for E-E-A-T */}
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="founder-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(founderSchema) }}
      />
      
      <GlobalHeader />
      
      <main className="flex-grow">
        {/* ================================================================ */}
        {/* HERO SECTION - Human-First Authority Narrative */}
        {/* ================================================================ */}
        <section 
          className="py-20 md:py-28 relative overflow-hidden"
          style={{ backgroundColor: COLORS.navy }}
        >
          {/* Decorative elements */}
          <div 
            className="absolute top-0 right-0 w-1/2 h-full opacity-10"
            style={{
              background: `radial-gradient(circle at 70% 30%, ${COLORS.sage} 0%, transparent 50%)`
            }}
          />
          <div 
            className="absolute bottom-0 left-0 w-96 h-96 opacity-5"
            style={{
              background: `radial-gradient(circle, ${COLORS.sageLight} 0%, transparent 70%)`
            }}
          />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
              {/* Badge */}
              <div className="flex justify-center mb-8">
                <span 
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold"
                  style={{ backgroundColor: COLORS.sage, color: COLORS.navy }}
                >
                  <Star className="h-4 w-4" />
                  20 Years of Industry Experience
                </span>
              </div>
              
              {/* Main Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-6 leading-tight">
                Boutique Guidance from a{' '}
                <span style={{ color: COLORS.sage }}>
                  20-Year Senior Living Insider
                </span>
              </h1>
              
              {/* Subheadline */}
              <p className="text-xl md:text-2xl text-slate-300 text-center mb-10 leading-relaxed max-w-3xl mx-auto">
                Former Regional Director. Executive Director. Hospice Liaison.{' '}
                <span className="text-white font-medium">Now, your family&apos;s advocate.</span>
              </p>
              
              {/* Trust badges */}
              <div className="flex flex-wrap justify-center gap-6 text-slate-400 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" style={{ color: COLORS.sage }} />
                  <span>500+ Families Helped</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" style={{ color: COLORS.sage }} />
                  <span>100% Free Service</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" style={{ color: COLORS.sage }} />
                  <span>Cleveland-Based</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* THE REGIONAL PEDIGREE - Insider Story */}
        {/* ================================================================ */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-5 gap-10 items-start">
                {/* Left: Photo placeholder with decorative frame */}
                <div className="md:col-span-2">
                  <div className="relative">
                    <div 
                      className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl relative"
                      style={{ backgroundColor: COLORS.sagePale }}
                    >
                      {/* Placeholder - can be replaced with actual photo */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                        <div 
                          className="w-24 h-24 rounded-full mb-4 flex items-center justify-center"
                          style={{ backgroundColor: COLORS.navy }}
                        >
                          <Users className="h-12 w-12 text-white" />
                        </div>
                        <p className="font-semibold text-slate-700">Your Local Advisor</p>
                        <p className="text-sm text-slate-500 mt-1">Guide for Seniors</p>
                      </div>
                    </div>
                    {/* Decorative accent */}
                    <div 
                      className="absolute -bottom-4 -right-4 w-24 h-24 rounded-xl -z-10"
                      style={{ backgroundColor: COLORS.sage }}
                    />
                  </div>
                  
                  {/* Quick stats under photo */}
                  <div className="mt-8 space-y-3">
                    <div 
                      className="flex items-center gap-3 p-3 rounded-lg"
                      style={{ backgroundColor: COLORS.sagePale }}
                    >
                      <Award className="h-5 w-5" style={{ color: COLORS.navy }} />
                      <span className="text-sm font-medium text-slate-700">20+ Years Experience</span>
                    </div>
                    <div 
                      className="flex items-center gap-3 p-3 rounded-lg"
                      style={{ backgroundColor: COLORS.sagePale }}
                    >
                      <MapPin className="h-5 w-5" style={{ color: COLORS.navy }} />
                      <span className="text-sm font-medium text-slate-700">Cleveland, Ohio</span>
                    </div>
                  </div>
                </div>
                
                {/* Right: Story content */}
                <div className="md:col-span-3">
                  <span 
                    className="inline-block text-sm font-semibold tracking-wider uppercase mb-4"
                    style={{ color: COLORS.sage }}
                  >
                    The Insider Edge
                  </span>
                  <h2 
                    className="text-3xl md:text-4xl font-bold mb-6 leading-tight"
                    style={{ color: COLORS.navy }}
                  >
                    I Know What Excellence Looks Like -<br />
                    <span style={{ color: COLORS.sage }}>Because I Built It</span>
                  </h2>
                  
                  <div className="prose prose-lg text-slate-600 space-y-5">
                    <p className="text-lg leading-relaxed">
                      As a <strong>Regional Director</strong>, I oversaw life enrichment programs and resident 
                      engagement for dozens of senior living communities across the Midwest. My job was to ensure 
                      these buildings weren&apos;t just &ldquo;warehousing&rdquo; seniors - but actually providing 
                      vibrant, purposeful lives.
                    </p>
                    
                    <p className="text-lg leading-relaxed">
                      I spent years training directors across the Midwest on what excellence looks like - from 
                      staffing ratios and social programming to the subtle signs of genuine resident happiness.
                    </p>
                    
                    {/* The Insider Quote */}
                    <blockquote 
                      className="border-l-4 pl-6 py-4 my-8 italic text-xl font-medium rounded-r-lg"
                      style={{ 
                        borderColor: COLORS.sage, 
                        backgroundColor: COLORS.sagePale,
                        color: COLORS.navy
                      }}
                    >
                      &ldquo;I spent years training directors across the Midwest on what excellence looks like - 
                      now, I use that same lens to help your family.&rdquo;
                    </blockquote>
                    
                    <p className="text-lg leading-relaxed">
                      Now, I bring that same uncompromising standard to Cleveland families. When I tour a 
                      community with you, I&apos;m not seeing what they want you to see - I&apos;m seeing what 
                      I trained my teams to fix.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* CAREER JOURNEY - Visual Timeline */}
        {/* ================================================================ */}
        <section 
          className="py-16 md:py-24"
          style={{ backgroundColor: COLORS.cream }}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-14">
                <span 
                  className="inline-block text-sm font-semibold tracking-wider uppercase mb-4"
                  style={{ color: COLORS.sage }}
                >
                  Two Decades of Expertise
                </span>
                <h2 
                  className="text-3xl md:text-4xl font-bold mb-4"
                  style={{ color: COLORS.navy }}
                >
                  The 20-Year Journey
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  Every role shaped my understanding of what truly matters in senior care - 
                  and what to look for when helping your family.
                </p>
              </div>
              
              {/* Career Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                {careerJourney.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={item.role}
                      className={`relative rounded-2xl p-8 transition-all hover:shadow-xl ${
                        item.highlight ? 'shadow-lg' : 'shadow-md'
                      }`}
                      style={{ 
                        backgroundColor: item.highlight ? COLORS.navy : COLORS.white,
                        border: item.highlight ? 'none' : `2px solid ${COLORS.sagePale}`
                      }}
                    >
                      {/* Role tag */}
                      <span 
                        className={`inline-block text-xs font-semibold tracking-wider uppercase mb-4 px-3 py-1 rounded-full ${
                          item.highlight ? 'bg-white/20 text-white' : ''
                        }`}
                        style={!item.highlight ? { backgroundColor: COLORS.sagePale, color: COLORS.sage } : {}}
                      >
                        {item.years}
                      </span>
                      
                      <div className="flex items-start gap-5">
                        <div 
                          className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            item.highlight ? 'bg-white/10' : ''
                          }`}
                          style={!item.highlight ? { backgroundColor: COLORS.sagePale } : {}}
                        >
                          <Icon 
                            className="h-7 w-7" 
                            style={{ color: item.highlight ? COLORS.sage : COLORS.navy }} 
                          />
                        </div>
                        <div>
                          <h3 
                            className="text-xl font-bold mb-2"
                            style={{ color: item.highlight ? COLORS.white : COLORS.navy }}
                          >
                            {item.role}
                          </h3>
                          <p 
                            className="leading-relaxed"
                            style={{ color: item.highlight ? 'rgba(255,255,255,0.8)' : '#64748b' }}
                          >
                            {item.description}
                          </p>
                        </div>
                      </div>
                      
                      {/* Highlight badge */}
                      {item.highlight && (
                        <div 
                          className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold"
                          style={{ backgroundColor: COLORS.sage, color: COLORS.navy }}
                        >
                          Key Experience
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* MARKETING VS REALITY - Trust Section */}
        {/* ================================================================ */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-10 items-center">
                {/* Left: Content */}
                <div>
                  <span 
                    className="inline-block text-sm font-semibold tracking-wider uppercase mb-4"
                    style={{ color: COLORS.sage }}
                  >
                    The Insider Advantage
                  </span>
                  <h2 
                    className="text-3xl md:text-4xl font-bold mb-6 leading-tight"
                    style={{ color: COLORS.navy }}
                  >
                    I Know How to See Past the Fancy Lobby
                  </h2>
                  
                  <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                    Because I&apos;ve held Regional and Executive Director roles, I know exactly how to 
                    spot the red flags that a standard sales tour hides:
                  </p>
                  
                  <div className="space-y-4">
                    {[
                      { label: "Staffing Red Flags", detail: "I know the real ratios vs. what they claim" },
                      { label: "Poor Social Engagement", detail: "Empty activity rooms tell the real story" },
                      { label: "Care Gaps", detail: "I spot inconsistencies in how staff interact with residents" },
                      { label: "Hidden Fees", detail: "I know which 'add-ons' are reasonable and which are gouging" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: COLORS.sagePale }}
                        >
                          <Eye className="h-4 w-4" style={{ color: COLORS.navy }} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{item.label}</p>
                          <p className="text-sm text-slate-500">{item.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Right: Visual card */}
                <div 
                  className="rounded-2xl p-8 md:p-10 shadow-xl"
                  style={{ backgroundColor: COLORS.navy }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <AlertTriangle className="h-8 w-8" style={{ color: '#F59E0B' }} />
                    <h3 className="text-xl font-bold text-white">What I Look For</h3>
                  </div>
                  
                  <div className="space-y-5">
                    {[
                      "Do staff greet residents by name?",
                      "Are common areas active at 2pm on a Tuesday?",
                      "What's the turnover rate for caregivers?",
                      "How quickly do call lights get answered?",
                      "What does the back hallway smell like?"
                    ].map((question, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-3 text-white/90"
                      >
                        <CheckCircle className="h-5 w-5 flex-shrink-0" style={{ color: COLORS.sage }} />
                        <span>{question}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div 
                    className="mt-8 pt-6 border-t"
                    style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                  >
                    <p className="text-white/70 text-sm italic">
                      &ldquo;These are the questions I asked when auditing buildings. 
                      Now I ask them for your family.&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* LOCAL CLEVELAND CONNECTION */}
        {/* ================================================================ */}
        <section 
          className="py-16 md:py-20"
          style={{ backgroundColor: COLORS.sagePale }}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <span 
                className="inline-block text-sm font-semibold tracking-wider uppercase mb-4"
                style={{ color: COLORS.navy }}
              >
                Serving Greater Cleveland
              </span>
              <h2 
                className="text-3xl md:text-4xl font-bold mb-6"
                style={{ color: COLORS.navy }}
              >
                Big-Picture Standards,{' '}
                <span style={{ color: COLORS.sage }}>Local Cleveland Care</span>
              </h2>
              <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
                I bring regional-level industry standards to local families in Westlake, Beachwood, 
                Parma, and across Greater Cleveland. You get national-quality expertise with 
                someone who knows your neighborhood.
              </p>
              
              {/* Local area badges */}
              <div className="flex flex-wrap justify-center gap-3">
                {['Westlake', 'Beachwood', 'Parma', 'Rocky River', 'Mentor', 'Independence', 'Strongsville', 'Lakewood'].map((area) => (
                  <span 
                    key={area}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-white shadow-sm"
                    style={{ color: COLORS.navy }}
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* VALUES SECTION */}
        {/* ================================================================ */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-14">
                <h2 
                  className="text-3xl md:text-4xl font-bold mb-4"
                  style={{ color: COLORS.navy }}
                >
                  What I Believe
                </h2>
                <p className="text-lg text-slate-600">
                  The principles that guide every recommendation I make
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: Heart,
                    title: "Dignity First",
                    description: "Every senior deserves to be seen, heard, and valued. I only recommend communities that share this belief."
                  },
                  {
                    icon: Shield,
                    title: "Honest Guidance",
                    description: "I'll tell you what I really think - even if it means steering you away from a community that pays me."
                  },
                  {
                    icon: Users,
                    title: "Family Partnership",
                    description: "This is your decision. I'm here to inform and support - never to pressure or rush."
                  }
                ].map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <div 
                      key={value.title}
                      className="text-center p-8 rounded-2xl border-2 hover:shadow-lg transition-shadow"
                      style={{ borderColor: COLORS.sagePale }}
                    >
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                        style={{ backgroundColor: COLORS.sagePale }}
                      >
                        <Icon className="h-8 w-8" style={{ color: COLORS.navy }} />
                      </div>
                      <h3 
                        className="font-bold text-xl mb-3"
                        style={{ color: COLORS.navy }}
                      >
                        {value.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* FINAL CTA SECTION */}
        {/* ================================================================ */}
        <section 
          className="py-20 md:py-28 relative overflow-hidden"
          style={{ backgroundColor: COLORS.navy }}
        >
          {/* Decorative elements */}
          <div 
            className="absolute top-0 left-0 w-full h-full opacity-5"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, ${COLORS.sage} 0%, transparent 40%), radial-gradient(circle at 80% 80%, ${COLORS.sage} 0%, transparent 30%)`
            }}
          />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Put 20 Years of Insider Experience{' '}
                <span style={{ color: COLORS.sage }}>In Your Corner</span>
              </h2>
              <p className="text-xl text-slate-300 mb-10 leading-relaxed">
                Call today for a free, local consultation. I&apos;ll listen to your family&apos;s needs 
                and give you honest, expert guidance - no sales pitch, no pressure.
              </p>
              
              {/* Phone CTA */}
              <a
                href="tel:+12166774630"
                className="inline-flex items-center justify-center gap-3 text-2xl md:text-3xl font-bold px-10 py-5 rounded-xl shadow-2xl transition-all hover:scale-105"
                style={{ backgroundColor: COLORS.sage, color: COLORS.navy }}
              >
                <Phone className="h-7 w-7" />
                <span>(216) 677-4630</span>
              </a>
              
              <p className="text-slate-400 mt-6 text-sm">
                Free consultation &bull; No obligation &bull; Cleveland-based
              </p>
              
              {/* Secondary CTA */}
              <div className="mt-10 pt-10 border-t border-white/10">
                <p className="text-slate-400 mb-4">Prefer to start online?</p>
                <Link 
                  href="/assessment" 
                  className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-all"
                >
                  <span>Take Our Free Assessment</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
