import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { Users, Heart, Shield, Award } from 'lucide-react';

export const metadata = {
  title: 'About Us | Guide for Seniors',
  description: 'Learn about Guide for Seniors and our mission to help families find the perfect senior living communities.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="bg-gradient-to-b from-gray-50 to-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-center mb-4">About Guide for Seniors</h1>
            <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
              We're dedicated to helping families find the perfect senior living community 
              that meets their unique needs, preferences, and budget.
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
                living communities across the country.
              </p>
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