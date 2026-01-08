import React from 'react';
import Link from 'next/link';
import { BookOpen, DollarSign, Heart, HelpCircle, MapPin, Building2, ArrowRight, FileText, Users, Shield, CheckCircle, Phone, Gamepad2, Brain, Coffee } from 'lucide-react';
import GlobalHeader from '@/components/home/GlobalHeader';
import Footer from '@/components/footer/Footer';
import StickyTourButton from '@/components/tour/StickyTourButton';
import { fetchRecentBlogPosts } from '@/lib/blog-posts';
import SimpleContactForm from '@/components/forms/SimpleContactForm';

export const revalidate = 300;

export default async function ResourcesPage() {
  const recentBlogPosts = await fetchRecentBlogPosts(3);
  
  // New lifestyle & wellness resources section
  const lifestyleResources = [
    {
      icon: Gamepad2,
      title: "Free Games for Seniors",
      description: "Discover the best free online games for seniors. Brain puzzles, card games, and engaging activities for cognitive health and entertainment.",
      href: "/resources/games-for-seniors",
      gradient: "from-violet-500 to-purple-600",
      iconBg: "bg-violet-100 text-violet-600",
      badge: "Popular"
    },
    {
      icon: Coffee,
      title: "Where Seniors Meet",
      description: "11+ places in Cleveland where seniors can meet other seniors. Senior centers, community groups, and social activities to combat isolation.",
      href: "/resources/social-activities",
      gradient: "from-rose-500 to-pink-600",
      iconBg: "bg-rose-100 text-rose-600",
      badge: null
    },
    {
      icon: Brain,
      title: "Brain Health Guide",
      description: "Evidence-based strategies to maintain mental sharpness. Brain puzzles, cognitive exercises, and when to consider memory care.",
      href: "/resources/brain-health",
      gradient: "from-teal-500 to-cyan-600",
      iconBg: "bg-teal-100 text-teal-600",
      badge: null
    },
  ];
  
  const resources = [
    {
      icon: Heart,
      title: "Memory Care Guide",
      description: "Everything you need to know about memory care, Alzheimer's care, and dementia support in Cleveland. Learn about specialized services and how to choose the right community.",
      href: "/memory-care-cleveland",
      gradient: "from-rose-500 to-pink-600",
      iconBg: "bg-rose-100 text-rose-600"
    },
    {
      icon: Building2,
      title: "Assisted Living Guide",
      description: "Complete guide to assisted living in Cleveland. Understand services provided, when to transition, and how to find the perfect community for your loved one.",
      href: "/assisted-living-cleveland",
      gradient: "from-violet-500 to-purple-600",
      iconBg: "bg-violet-100 text-violet-600"
    },
    {
      icon: DollarSign,
      title: "Cleveland Pricing Guide",
      description: "Transparent pricing information for all senior living types in Cleveland. Learn costs, what's included, and financial assistance options available in Ohio.",
      href: "/senior-living-costs-cleveland",
      gradient: "from-emerald-500 to-green-600",
      iconBg: "bg-emerald-100 text-emerald-600"
    },
    {
      icon: HelpCircle,
      title: "Choosing Senior Living",
      description: "Expert decision guide covering when it's time, how to involve your loved one, questions to ask during tours, and red flags to avoid.",
      href: "/choosing-senior-living",
      gradient: "from-amber-500 to-orange-600",
      iconBg: "bg-amber-100 text-amber-600"
    },
    {
      icon: MapPin,
      title: "Browse Cleveland Communities",
      description: "Explore 150+ senior living communities across Greater Cleveland. Filter by city, care type, and amenities to find your perfect match.",
      href: "/greater-cleveland",
      gradient: "from-teal-500 to-cyan-600",
      iconBg: "bg-teal-100 text-teal-600"
    },
    {
      icon: BookOpen,
      title: "City Guides",
      description: "Detailed guides for Cleveland, Shaker Heights, Beachwood, Parma, Lakewood, and more. Local insights, healthcare access, and community recommendations.",
      href: "/",
      gradient: "from-blue-500 to-indigo-600",
      iconBg: "bg-blue-100 text-blue-600"
    }
  ];

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <GlobalHeader />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50 py-16 md:py-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Free Expert Resources
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 leading-tight">
              Senior Living Resources for Cleveland Families
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-4">
              Expert guides and helpful information to make the best decision for your loved one
            </p>
            <p className="text-slate-500">
              Free resources covering memory care, assisted living, pricing, and how to choose the right community
            </p>
          </div>
        </div>
      </section>

      {/* Blog Link Card */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Link
              href="/blog"
              className="group bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 transition-all hover:shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div className="flex items-center gap-5">
                <div className="bg-gradient-to-br from-teal-400 to-teal-600 text-white p-4 rounded-xl shadow-lg">
                  <FileText className="h-8 w-8" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-teal-300 transition-colors">
                    Senior Living Blog & Advice
                  </h3>
                  <p className="text-slate-300">
                    Expert tips, practical advice, and helpful insights for Cleveland families
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-teal-400 font-semibold">
                <span>Explore Articles</span>
                <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Lifestyle & Wellness Resources - NEW SECTION */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Lifestyle & Wellness
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
                Activities & Brain Health Resources
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Free games, social activities, and cognitive wellness resources for seniors and caregivers
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {lifestyleResources.map((resource, index) => {
                const Icon = resource.icon;
                
                return (
                  <Link
                    key={index}
                    href={resource.href}
                    className="group bg-white border-2 border-slate-200 hover:border-teal-300 rounded-2xl p-6 transition-all hover:shadow-xl relative"
                  >
                    {resource.badge && (
                      <span className="absolute top-4 right-4 bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-1 rounded-full">
                        {resource.badge}
                      </span>
                    )}
                    <div className={`${resource.iconBg} w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-teal-700 transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-slate-600 mb-5 text-sm leading-relaxed">
                      {resource.description}
                    </p>
                    <div className="flex items-center text-teal-600 font-semibold group-hover:gap-2 transition-all">
                      <span>Explore</span>
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Comprehensive Guides
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
                Senior Living & Care Guides
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                From understanding different care types to finding the perfect community in Cleveland
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource, index) => {
                const Icon = resource.icon;
                
                return (
                  <Link
                    key={index}
                    href={resource.href}
                    className="group bg-white border-2 border-slate-200 hover:border-slate-300 rounded-2xl p-6 transition-all hover:shadow-xl"
                  >
                    <div className={`${resource.iconBg} w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-teal-700 transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-slate-600 mb-5 text-sm leading-relaxed">
                      {resource.description}
                    </p>
                    <div className="flex items-center text-teal-600 font-semibold group-hover:gap-2 transition-all">
                      <span>Read Guide</span>
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                    
                    {/* Hover gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${resource.gradient} opacity-0 group-hover:opacity-[0.03] rounded-2xl transition-opacity pointer-events-none`} />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Recent Blog Posts */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Recent Blog Posts</h2>
              <p className="text-lg text-slate-600">
                Latest tips and advice for Cleveland families
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {recentBlogPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl transition-all hover:border-teal-200"
                >
                  <div className="mb-3">
                    <span className="text-sm font-semibold text-teal-600 bg-teal-50 px-3 py-1 rounded-full">{post.category}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {post.description}
                  </p>
                  <div className="text-sm font-semibold text-teal-600 group-hover:underline flex items-center gap-1">
                    Read More
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 bg-white border-2 border-slate-300 hover:border-teal-500 text-slate-700 hover:text-teal-700 font-bold px-6 py-3 rounded-xl transition-all"
              >
                View All Blog Posts
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="bg-white py-16 border-t border-slate-200">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-slate-900">Why Families Trust Our Resources</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="bg-slate-50 rounded-2xl p-6">
                <div className="text-4xl font-bold text-teal-600 mb-2">150+</div>
                <div className="text-slate-600 font-medium">Communities Listed</div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6">
                <div className="text-4xl font-bold text-teal-600 mb-2">35</div>
                <div className="text-slate-600 font-medium">City Guides</div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6">
                <div className="text-4xl font-bold text-teal-600 mb-2">500+</div>
                <div className="text-slate-600 font-medium">Families Helped</div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6">
                <div className="text-4xl font-bold text-teal-600 mb-2">100%</div>
                <div className="text-slate-600 font-medium">Free Service</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Need Personal Help?</h2>
              <p className="text-lg text-slate-300">
                Our Cleveland advisors can answer your specific questions, schedule tours, and help you find the perfect community—completely free.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center justify-center gap-6 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle className="h-5 w-5 text-teal-500" />
                  <span>100% Free</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Shield className="h-5 w-5 text-teal-500" />
                  <span>No Obligation</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Users className="h-5 w-5 text-teal-500" />
                  <span>Confidential</span>
                </div>
              </div>
              <SimpleContactForm sourcePage="resources" buttonText="Get Free Consultation" />
            </div>
            
            {/* Phone CTA */}
            <div className="text-center mt-8">
              <p className="text-slate-400 mb-3">Or call us directly</p>
              <a
                href="tel:+12166774630"
                className="inline-flex items-center gap-2 text-white hover:text-teal-300 font-bold text-xl transition-colors"
              >
                <Phone className="h-6 w-6" />
                <span>(216) 677-4630</span>
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
