import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { Users, Heart, Shield, Award, MapPin, BookOpen, Phone } from 'lucide-react';
import Script from 'next/script';

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

const teamMembers = [
  {
    name: "Cleveland Senior Living Advisory Team",
    role: "Local Experts",
    expertise: ["Assisted Living", "Memory Care", "Ohio Medicaid Waiver", "Cleveland Communities"],
    description: "Our Cleveland-based advisors have helped over 500 families find the right senior living community. With deep knowledge of Greater Cleveland's neighborhoods and communities, we provide personalized recommendations based on care needs, budget, and location preferences."
  }
];

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

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
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
      
      <Header />
      
      <main className="flex-grow">
        <div className="bg-gradient-to-b from-gray-50 to-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-center mb-4">About Guide for Seniors</h1>
            <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
              Cleveland's trusted resource for senior living since 2018. We're dedicated to helping families 
              find the perfect senior living community that meets their unique needs, preferences, and budget.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Our Story */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl font-semibold mb-6">Our Story</h2>
            <div className="prose prose-lg text-gray-600 space-y-4">
              <p>
                Guide for Seniors was founded with a simple yet powerful mission: to make the process 
                of finding senior living communities easier, more transparent, and less stressful for 
                families during what can be a challenging time.
              </p>
              <p>
                We understand that choosing the right senior living community is one of the most 
                important decisions a family can make. That's why we've built a comprehensive platform 
                that provides detailed information, honest reviews, and expert guidance to help you 
                make the best choice for your loved ones.
              </p>
              <p>
                Our team consists of senior care experts, technology professionals, and advocates 
                who are passionate about improving the lives of seniors and their families. We work 
                tirelessly to maintain the most up-to-date and accurate information about senior 
                living communities across Greater Cleveland and Northeast Ohio.
              </p>
            </div>
          </div>

          {/* Meet Our Experts - E-E-A-T Section */}
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8 md:p-12 mb-16">
            <h2 className="text-3xl font-semibold mb-2 text-center">Meet Our Cleveland Senior Living Experts</h2>
            <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
              Our local advisors combine years of experience with deep knowledge of Greater Cleveland's senior living landscape.
            </p>
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-shrink-0">
                    <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto md:mx-0">
                      <Users className="h-12 w-12 text-primary" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold mb-2">Cleveland Senior Living Advisory Team</h3>
                    <p className="text-primary font-medium mb-4">Local Senior Care Specialists</p>
                    <p className="text-gray-600 mb-6">
                      Our Cleveland-based advisors have helped over 500 families find the right senior living community. 
                      With deep knowledge of Greater Cleveland's neighborhoods—from Shaker Heights heritage communities to 
                      Rocky River's waterfront options—we provide personalized recommendations based on care needs, budget, 
                      and location preferences.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>Cleveland, Ohio-based team</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span>Ohio Medicaid Waiver experts</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Users className="h-4 w-4 text-primary" />
                        <span>500+ families assisted</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Phone className="h-4 w-4 text-primary" />
                        <span>Free consultations available</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {['Assisted Living', 'Memory Care', 'Independent Living', 'Ohio Medicaid Waiver', 'Cleveland Communities'].map((skill) => (
                        <span key={skill} className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Our Values */}
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 mb-16">
            <h2 className="text-3xl font-semibold mb-8 text-center">Our Core Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Compassion</h3>
                <p className="text-gray-600 text-sm">
                  We approach every interaction with empathy and understanding
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Trust</h3>
                <p className="text-gray-600 text-sm">
                  We provide honest, unbiased information you can rely on
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Community</h3>
                <p className="text-gray-600 text-sm">
                  We foster connections between families and quality care providers
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Excellence</h3>
                <p className="text-gray-600 text-sm">
                  We maintain the highest standards in everything we do
                </p>
              </div>
            </div>
          </div>

          {/* How We Help */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl font-semibold mb-6">How We Help</h2>
            <div className="space-y-6">
              <div className="border-l-4 border-primary pl-6">
                <h3 className="font-semibold text-lg mb-2">Free Expert Guidance</h3>
                <p className="text-gray-600">
                  Our experienced advisors are available to help you navigate the search process 
                  at no cost to you. We'll help you understand your options and find communities 
                  that match your specific needs.
                </p>
              </div>
              
              <div className="border-l-4 border-primary pl-6">
                <h3 className="font-semibold text-lg mb-2">Comprehensive Information</h3>
                <p className="text-gray-600">
                  We provide detailed profiles of thousands of senior living communities, including 
                  amenities, care levels, pricing information, photos, and reviews from residents 
                  and their families.
                </p>
              </div>
              
              <div className="border-l-4 border-primary pl-6">
                <h3 className="font-semibold text-lg mb-2">Easy Comparison Tools</h3>
                <p className="text-gray-600">
                  Our platform makes it simple to compare multiple communities side by side, 
                  helping you evaluate your options and make informed decisions.
                </p>
              </div>
              
              <div className="border-l-4 border-primary pl-6">
                <h3 className="font-semibold text-lg mb-2">Ongoing Support</h3>
                <p className="text-gray-600">
                  We're here for you throughout your journey, from initial research to move-in 
                  day and beyond. Our commitment to your family doesn't end when you choose a community.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-primary/5 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-semibold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Let us help you find the perfect senior living community for your loved one. 
              Our expert advisors are standing by to assist you.
            </p>
            <a 
              href="/contact" 
              className="inline-block bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors"
            >
              Contact Us Today
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 