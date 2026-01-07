import GlobalHeader from '@/components/home/GlobalHeader';
import Footer from '@/components/footer/Footer';
import { Users, Heart, Shield, Award, MapPin, BookOpen, Phone, CheckCircle, ArrowRight, Star } from 'lucide-react';
import Script from 'next/script';
import Link from 'next/link';

export const metadata = {
  title: 'About Our Team | Cleveland Senior Living Experts | Guide for Seniors',
  description: 'Meet the Guide for Seniors team - Cleveland\'s trusted senior living advisors with 15+ years of local expertise helping families find assisted living, memory care, and independent living communities.',
};

// Organization and team schema for E-E-A-T signals
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://guideforseniors.com/#organization",
  "name": "Guide for Seniors",
  "url": "https://guideforseniors.com",
  "description": "Cleveland's trusted resource for finding assisted living, memory care, and independent living communities in Greater Cleveland and Northeast Ohio.",
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
    "Senior Care",
    "Ohio Medicaid Waiver",
    "Cleveland Senior Services",
    "Elder Care",
    "Retirement Communities"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-216-677-4630",
    "contactType": "customer service",
    "availableLanguage": "English"
  }
};

const teamSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://guideforseniors.com/#team",
  "name": "Guide for Seniors Advisory Team",
  "jobTitle": "Cleveland Senior Living Advisors",
  "worksFor": {
    "@id": "https://guideforseniors.com/#organization"
  },
  "knowsAbout": [
    "Assisted Living",
    "Memory Care",
    "Independent Living",
    "Ohio Medicaid Waiver",
    "Cleveland Senior Care"
  ]
};

const coreValues = [
  {
    icon: Heart,
    title: "Compassion",
    description: "We approach every interaction with empathy and understanding",
    color: "rose"
  },
  {
    icon: Shield,
    title: "Trust",
    description: "We provide honest, unbiased information you can rely on",
    color: "teal"
  },
  {
    icon: Users,
    title: "Community",
    description: "We foster connections between families and quality care providers",
    color: "violet"
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We maintain the highest standards in everything we do",
    color: "amber"
  }
];

const howWeHelp = [
  {
    title: "Free Expert Guidance",
    description: "Our experienced advisors are available to help you navigate the search process at no cost to you. We'll help you understand your options and find communities that match your specific needs."
  },
  {
    title: "Comprehensive Information",
    description: "We provide detailed profiles of thousands of senior living communities, including amenities, care levels, pricing information, photos, and reviews from residents and their families."
  },
  {
    title: "Easy Comparison Tools",
    description: "Our platform makes it simple to compare multiple communities side by side, helping you evaluate your options and make informed decisions."
  },
  {
    title: "Ongoing Support",
    description: "We're here for you throughout your journey, from initial research to move-in day and beyond. Our commitment to your family doesn't end when you choose a community."
  }
];

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
        id="team-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(teamSchema) }}
      />
      
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
                Since 2018
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                About Guide for Seniors
              </h1>
              <p className="text-lg md:text-xl text-slate-600">
                Cleveland's trusted resource for senior living. We're dedicated to helping families 
                find the perfect senior living community that meets their unique needs, preferences, and budget.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Our Story</h2>
              <div className="prose prose-lg text-slate-600 space-y-6">
                <p className="text-lg leading-relaxed">
                  Guide for Seniors was founded with a simple yet powerful mission: to make the process 
                  of finding senior living communities easier, more transparent, and less stressful for 
                  families during what can be a challenging time.
                </p>
                <p className="text-lg leading-relaxed">
                  We understand that choosing the right senior living community is one of the most 
                  important decisions a family can make. That's why we've built a comprehensive platform 
                  that provides detailed information, honest reviews, and expert guidance to help you 
                  make the best choice for your loved ones.
                </p>
                <p className="text-lg leading-relaxed">
                  Our team consists of senior care experts, technology professionals, and advocates 
                  who are passionate about improving the lives of seniors and their families. We work 
                  tirelessly to maintain the most up-to-date and accurate information about senior 
                  living communities across Greater Cleveland and Northeast Ohio.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Meet Our Experts - E-E-A-T Section */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block bg-teal-500/20 text-teal-300 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Local Expertise
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Meet Our Cleveland Senior Living Experts
              </h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                Our local advisors combine years of experience with deep knowledge of Greater Cleveland's senior living landscape.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-8 md:p-10 shadow-2xl text-slate-900">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-shrink-0">
                    <div className="bg-gradient-to-br from-teal-500 to-teal-600 w-24 h-24 rounded-2xl flex items-center justify-center mx-auto md:mx-0 shadow-lg">
                      <Users className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold mb-2">Cleveland Senior Living Advisory Team</h3>
                    <p className="text-teal-600 font-semibold mb-4">Local Senior Care Specialists</p>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                      Our Cleveland-based advisors have helped over 500 families find the right senior living community. 
                      With deep knowledge of Greater Cleveland's neighborhoods—from Shaker Heights heritage communities to 
                      Rocky River's waterfront options—we provide personalized recommendations based on care needs, budget, 
                      and location preferences.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-3 text-slate-700">
                        <div className="bg-teal-100 p-2 rounded-lg">
                          <MapPin className="h-4 w-4 text-teal-600" />
                        </div>
                        <span>Cleveland, Ohio-based team</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-700">
                        <div className="bg-teal-100 p-2 rounded-lg">
                          <BookOpen className="h-4 w-4 text-teal-600" />
                        </div>
                        <span>Ohio Medicaid Waiver experts</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-700">
                        <div className="bg-teal-100 p-2 rounded-lg">
                          <Users className="h-4 w-4 text-teal-600" />
                        </div>
                        <span>500+ families assisted</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-700">
                        <div className="bg-teal-100 p-2 rounded-lg">
                          <Phone className="h-4 w-4 text-teal-600" />
                        </div>
                        <span>Free consultations available</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {['Assisted Living', 'Memory Care', 'Independent Living', 'Ohio Medicaid Waiver', 'Cleveland Communities'].map((skill) => (
                        <span key={skill} className="bg-teal-100 text-teal-700 text-sm font-medium px-4 py-1.5 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 md:py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Core Values</h2>
              <p className="text-lg text-slate-600">The principles that guide everything we do</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {coreValues.map((value) => {
                const Icon = value.icon;
                const colorClasses = {
                  rose: "bg-rose-100 text-rose-600",
                  teal: "bg-teal-100 text-teal-600",
                  violet: "bg-violet-100 text-violet-600",
                  amber: "bg-amber-100 text-amber-600"
                };
                
                return (
                  <div key={value.title} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 text-center hover:shadow-lg transition-shadow">
                    <div className={`${colorClasses[value.color as keyof typeof colorClasses]} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="font-bold text-xl text-slate-900 mb-3">{value.title}</h3>
                    <p className="text-slate-600">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How We Help */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How We Help</h2>
                <p className="text-lg text-slate-600">Your journey to finding the right community, simplified</p>
              </div>
              
              <div className="space-y-6">
                {howWeHelp.map((item, index) => (
                  <div 
                    key={item.title} 
                    className="bg-slate-50 rounded-2xl p-6 md:p-8 border-l-4 border-teal-500 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-teal-100 text-teal-600 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-lg">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-slate-900 mb-2">{item.title}</h3>
                        <p className="text-slate-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 md:py-20 bg-gradient-to-r from-teal-600 to-teal-700">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-teal-100 mb-10 max-w-2xl mx-auto">
              Let us help you find the perfect senior living community for your loved one. 
              Our expert advisors are standing by to assist you.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/contact" 
                className="inline-flex items-center justify-center gap-2 bg-white text-teal-700 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:bg-slate-50 transition-all"
              >
                <span>Contact Us Today</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="tel:+12166774630"
                className="inline-flex items-center justify-center gap-2 bg-teal-800 text-white font-bold px-8 py-4 rounded-xl hover:bg-teal-900 transition-all"
              >
                <Phone className="h-5 w-5" />
                <span>(216) 677-4630</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
