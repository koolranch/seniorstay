import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, DollarSign, Heart, MapPin, Users, Shield, Phone, Utensils, Clock, Home, Hospital } from 'lucide-react';
import GlobalHeader from '@/components/home/GlobalHeader';
import Footer from '@/components/footer/Footer';
import LocationCard from '@/components/property/LocationCard';
import StickyTourButton from '@/components/tour/StickyTourButton';
import { fetchAllCommunities } from '@/lib/fetch-community';
import SimpleContactForm from '@/components/forms/SimpleContactForm';

// ISR: Revalidate every hour
export const revalidate = 3600;

export default async function AssistedLivingClevelandPage() {
  // Fetch live community data from Supabase
  const communityData = await fetchAllCommunities();
  
  // Filter for Cleveland-area assisted living communities
  const clevelandCities = ['Cleveland', 'Shaker Heights', 'Beachwood', 'Parma', 'Lakewood', 'Westlake', 'Strongsville', 'Independence', 'Seven Hills', 'Rocky River'];
  const assistedLivingCommunities = communityData.filter(c => 
    c.careTypes.includes('Assisted Living') &&
    clevelandCities.some(city => c.location.toLowerCase().includes(city.toLowerCase()))
  ).slice(0, 8);

  const services = [
    { icon: Heart, title: "Personal Care Assistance", desc: "Help with bathing, dressing, grooming, and mobility" },
    { icon: Shield, title: "Medication Management", desc: "Staff ensures medications are taken correctly and on time" },
    { icon: Utensils, title: "Meals & Dining", desc: "Three nutritious meals daily plus snacks" },
    { icon: Home, title: "Housekeeping & Laundry", desc: "Maintenance-free living with regular cleaning services" },
    { icon: Users, title: "Social Activities", desc: "Engaging programs, events, and outings" },
    { icon: Clock, title: "24/7 Staff Support", desc: "Help available whenever needed" },
  ];

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <GlobalHeader />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-rose-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Heart className="inline h-4 w-4 mr-1" />
              Personalized Daily Support
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 leading-tight">
              Assisted Living in Cleveland, Ohio
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10">
              Find the perfect assisted living community for your loved one. Compare top-rated Cleveland-area options, schedule tours, and get personalized guidance—completely free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#communities"
                className="inline-flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-lg hover:shadow-xl min-h-[56px]"
              >
                Browse Communities
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a
                href="#guide"
                className="inline-flex items-center justify-center bg-white border-2 border-slate-300 text-slate-700 hover:border-teal-500 hover:text-teal-600 font-bold px-8 py-4 rounded-xl transition-colors min-h-[56px]"
              >
                Read Complete Guide
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-slate-800 py-4 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-teal-400" />
              <span>85+ Cleveland Communities</span>
            </div>
            <div className="flex items-center gap-2">
              <Hospital className="h-5 w-5 text-teal-400" />
              <span>Near Cleveland Clinic & UH</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-teal-400" />
              <span>Free Expert Guidance</span>
            </div>
          </div>
        </div>
      </section>

      {/* What is Assisted Living Section */}
      <section id="guide" className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">What is Assisted Living?</h2>
            
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              Assisted living is a senior housing option designed for older adults who need help with daily activities but don't require the intensive medical care provided in a nursing home. Cleveland's assisted living communities offer a perfect balance of independence and support, providing personalized care in a home-like environment.
            </p>

            {/* Services Grid */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-8 text-slate-900">Services Provided in Cleveland Assisted Living Communities</h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => {
                  const Icon = service.icon;
                  return (
                    <div key={service.title} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:shadow-md transition-shadow">
                      <div className="bg-rose-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-rose-600" />
                      </div>
                      <h4 className="font-bold text-slate-900 mb-2">{service.title}</h4>
                      <p className="text-slate-600">{service.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* When to Consider */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 mb-12">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">When to Consider Assisted Living</h3>
              <p className="text-slate-600 mb-6">It may be time to consider assisted living in Cleveland when your loved one:</p>
              <ul className="grid md:grid-cols-2 gap-3">
                {[
                  "Has difficulty with daily tasks like bathing, dressing, or meal preparation",
                  "Experiences frequent falls or safety concerns at home",
                  "Feels isolated or lonely living alone",
                  "Has trouble managing medications correctly",
                  "Requires more care than family members can safely provide",
                  "Would benefit from social engagement and activities"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-slate-700">
                    <CheckCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cost Section */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 mb-12 border border-teal-200">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-teal-100 p-3 rounded-xl">
                  <DollarSign className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Cost of Assisted Living in Cleveland</h3>
                  <p className="text-3xl font-bold text-teal-600">$3,200 – $6,500/month</p>
                </div>
              </div>
              <p className="text-slate-600 mb-4">This cost usually includes:</p>
              <ul className="grid md:grid-cols-2 gap-2 mb-6">
                {["Private or semi-private apartment", "All meals and snacks", "Personal care services", "Medication management", "Housekeeping and laundry", "Activities and social programs", "24-hour staffing", "Emergency response"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-slate-700">
                    <div className="w-2 h-2 bg-teal-500 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-slate-600 text-sm">
                Additional costs may include specialized care, beauty salon services, or transportation. Many Cleveland-area communities offer all-inclusive pricing.
              </p>
            </div>

            {/* Financial Assistance */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-slate-900">Financial Assistance Options in Ohio</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: "Medicaid Assisted Living Waiver", desc: "Helps eligible seniors pay for assisted living services" },
                  { title: "Veterans Aid & Attendance", desc: "Additional benefits for qualifying veterans and spouses" },
                  { title: "Long-term Care Insurance", desc: "May cover some or all assisted living costs" },
                  { title: "Medicare", desc: "Does not cover room and board, but may cover specific medical services" }
                ].map((item) => (
                  <div key={item.title} className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                    <p className="text-slate-600 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* How to Choose */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-slate-900">How to Choose an Assisted Living Community in Cleveland</h3>
              <div className="space-y-3">
                {[
                  { title: "Location", desc: "Proximity to family, friends, and familiar neighborhoods" },
                  { title: "Healthcare Access", desc: "Distance to hospitals like Cleveland Clinic or University Hospitals" },
                  { title: "Staff-to-Resident Ratio", desc: "Lower ratios mean more personalized attention" },
                  { title: "Activities & Amenities", desc: "Programs that match your loved one's interests" },
                  { title: "Community Culture", desc: "Visit multiple times to get a feel for the atmosphere" },
                  { title: "Reviews & Reputation", desc: "Check state inspection reports and online reviews" }
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl">
                    <CheckCircle className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900">{item.title}:</span>{' '}
                      <span className="text-slate-600">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Communities */}
      <section id="communities" className="bg-slate-50 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Featured Communities
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Top Assisted Living Communities in Cleveland</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              These highly-rated assisted living communities offer quality care, engaging activities, and personalized support for Cleveland-area seniors.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {assistedLivingCommunities.map((community) => (
              <LocationCard key={community.id} community={community} />
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/?filter=assisted-living"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-lg hover:shadow-xl min-h-[56px]"
            >
              View All Assisted Living Communities
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-teal-600 to-teal-700 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get Free Help Finding Assisted Living in Cleveland</h2>
            <p className="text-lg text-teal-100 mb-10">
              Our local advisors know every community personally. We'll help you compare options, schedule tours, and find the perfect fit—at no cost to you.
            </p>
            <div className="bg-white p-8 rounded-2xl shadow-2xl">
              <SimpleContactForm 
                sourcePage="assisted-living-cleveland" 
                buttonText="Get Free Consultation"
                showMessage={false}
              />
            </div>
            <div className="mt-8">
              <a
                href="tel:+12166774630"
                className="inline-flex items-center gap-2 text-white hover:text-teal-100 font-semibold transition-colors"
              >
                <Phone className="h-5 w-5" />
                <span>Or call us directly: (216) 677-4630</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <StickyTourButton />
      <Footer />
    </main>
  );
}
