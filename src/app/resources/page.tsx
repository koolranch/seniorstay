import React from 'react';
import Link from 'next/link';
import { BookOpen, DollarSign, Heart, HelpCircle, MapPin, Building2, ArrowRight, FileText } from 'lucide-react';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import StickyTourButton from '@/components/tour/StickyTourButton';
import { fetchRecentBlogPosts } from '@/lib/blog-posts';
import SimpleContactForm from '@/components/forms/SimpleContactForm';

export const revalidate = 300;

export default async function ResourcesPage() {
  const recentBlogPosts = await fetchRecentBlogPosts(3);
  
  const resources = [
    {
      icon: Heart,
      title: "Memory Care Guide",
      description: "Everything you need to know about memory care, Alzheimer's care, and dementia support in Cleveland. Learn about specialized services and how to choose the right community.",
      href: "/memory-care-cleveland",
      color: "purple"
    },
    {
      icon: Building2,
      title: "Assisted Living Guide",
      description: "Complete guide to assisted living in Cleveland. Understand services provided, when to transition, and how to find the perfect community for your loved one.",
      href: "/assisted-living-cleveland",
      color: "blue"
    },
    {
      icon: DollarSign,
      title: "Cleveland Pricing Guide",
      description: "Transparent pricing information for all senior living types in Cleveland. Learn costs, what's included, and financial assistance options available in Ohio.",
      href: "/senior-living-costs-cleveland",
      color: "green"
    },
    {
      icon: HelpCircle,
      title: "Choosing Senior Living",
      description: "Expert decision guide covering when it's time, how to involve your loved one, questions to ask during tours, and red flags to avoid.",
      href: "/choosing-senior-living",
      color: "amber"
    },
    {
      icon: MapPin,
      title: "Browse Cleveland Communities",
      description: "Explore 70+ senior living communities across Greater Cleveland. Filter by city, care type, and amenities to find your perfect match.",
      href: "/greater-cleveland",
      color: "primary"
    },
    {
      icon: BookOpen,
      title: "City Guides",
      description: "Detailed guides for Cleveland, Shaker Heights, Beachwood, Parma, Lakewood, and more. Local insights, healthcare access, and community recommendations.",
      href: "/",
      color: "teal"
    }
  ];

  const colorClasses = {
    purple: "bg-purple-50 border-purple-200 hover:border-purple-400 text-purple-600",
    blue: "bg-blue-50 border-blue-200 hover:border-blue-400 text-blue-600",
    green: "bg-green-50 border-green-200 hover:border-green-400 text-green-600",
    amber: "bg-amber-50 border-amber-200 hover:border-amber-400 text-amber-600",
    primary: "bg-primary/5 border-primary/20 hover:border-primary/40 text-primary",
    teal: "bg-teal-50 border-teal-200 hover:border-teal-400 text-teal-600"
  };

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Senior Living Resources for Cleveland Families
            </h1>
            <p className="text-xl text-gray-700 mb-4">
              Expert guides and helpful information to make the best decision for your loved one
            </p>
            <p className="text-gray-600">
              Free resources covering memory care, assisted living, pricing, and how to choose the right community
            </p>
          </div>
        </div>
      </div>

      {/* Blog Link Card */}
      <div className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Link
              href="/blog"
              className="group bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-400 rounded-xl p-8 transition-all hover:shadow-lg flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="bg-blue-500 text-white p-3 rounded-lg">
                  <FileText className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900 group-hover:text-blue-600">
                    Senior Living Blog & Advice
                  </h3>
                  <p className="text-gray-600">
                    Expert tips, practical advice, and helpful insights for Cleveland families
                  </p>
                </div>
              </div>
              <ArrowRight className="h-8 w-8 text-blue-500 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-center">Comprehensive Guides</h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Everything you need to know about senior living in Cleveland, from understanding different care types to finding the perfect community
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource, index) => {
                const Icon = resource.icon;
                const colorClass = colorClasses[resource.color as keyof typeof colorClasses];
                
                return (
                  <Link
                    key={index}
                    href={resource.href}
                    className={`group border-2 rounded-xl p-6 transition-all hover:shadow-lg ${colorClass}`}
                  >
                    <div className="mb-4">
                      <Icon className="h-12 w-12" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-current">
                      {resource.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {resource.description}
                    </p>
                    <div className="flex items-center text-sm font-semibold group-hover:gap-2 transition-all">
                      Read Guide
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Blog Posts */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-center">Recent Blog Posts</h2>
            <p className="text-gray-600 text-center mb-12">
              Latest tips and advice for Cleveland families
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {recentBlogPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="mb-3">
                    <span className="text-sm font-medium text-primary">{post.category}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {post.description}
                  </p>
                  <div className="text-sm font-semibold text-primary group-hover:underline">
                    Read More →
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-primary hover:underline font-semibold"
              >
                View All Blog Posts
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="bg-white py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Why Families Trust Our Resources</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-1">70+</div>
                <div className="text-sm text-gray-600">Communities Listed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-1">35</div>
                <div className="text-sm text-gray-600">City Guides</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-1">500+</div>
                <div className="text-sm text-gray-600">Families Helped</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-1">100%</div>
                <div className="text-sm text-gray-600">Free Service</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Need Personal Help?</h2>
            <p className="text-lg text-gray-700 mb-8">
              Our Cleveland advisors can answer your specific questions, schedule tours, and help you find the perfect community—completely free.
            </p>
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
              <SimpleContactForm sourcePage="resources" buttonText="Get Free Consultation" />
            </div>
          </div>
        </div>
      </div>

      <StickyTourButton />
      <Footer />
    </main>
  );
}

