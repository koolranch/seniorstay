import Link from 'next/link';
import GlobalHeader from '@/components/home/GlobalHeader';
import Footer from '@/components/footer/Footer';
import BlogListing from '@/components/blog/BlogListing';
import { fetchAllBlogPosts } from '@/lib/blog-posts';
import { Phone, ArrowRight, BookOpen } from 'lucide-react';

export const revalidate = 300;

export default async function BlogPage() {
  const posts = await fetchAllBlogPosts();

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <GlobalHeader />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50 py-12 md:py-16 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <BookOpen className="inline h-4 w-4 mr-1" />
              Resources & Advice
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 leading-tight">
              Senior Living Blog & Advice
            </h1>
            <p className="text-lg md:text-xl text-slate-600">
              Expert guidance, tips, and insights to help Cleveland families navigate senior care decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Listing */}
      <BlogListing posts={posts} />

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-teal-600 to-teal-700 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Need Personal Guidance?</h2>
            <p className="text-lg text-teal-100 mb-10">
              Our Cleveland advisors can answer your specific questions, schedule tours, and help you find the perfect
              community—completely free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white text-teal-700 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:bg-slate-50 transition-all min-h-[56px]"
              >
                Get Free Consultation
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/greater-cleveland"
                className="inline-flex items-center justify-center gap-2 bg-teal-800 text-white font-bold px-8 py-4 rounded-xl hover:bg-teal-900 transition-all min-h-[56px]"
              >
                Browse Communities
              </Link>
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

      <Footer />
    </main>
  );
}
