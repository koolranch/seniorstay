import Link from 'next/link';
import GlobalHeader from '@/components/home/GlobalHeader';
import Footer from '@/components/footer/Footer';
import BlogListing from '@/components/blog/BlogListing';
import { fetchAllBlogPosts } from '@/lib/blog-posts';
import { Phone, ArrowRight, BookOpen, ChevronRight } from 'lucide-react';

export const revalidate = 300;

// Schema markup for blog collection page
const blogSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Senior Living Blog & Advice',
  description: 'Expert tips, practical advice, and helpful insights for Cleveland families navigating senior living decisions.',
  url: 'https://www.guideforseniors.com/blog',
  publisher: {
    '@type': 'Organization',
    name: 'Guide for Seniors',
    url: 'https://www.guideforseniors.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.guideforseniors.com/logo.png'
    }
  },
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: [] // Will be populated dynamically
  }
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://www.guideforseniors.com'
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Blog & Advice',
      item: 'https://www.guideforseniors.com/blog'
    }
  ]
};

export default async function BlogPage() {
  const posts = await fetchAllBlogPosts();

  // Build dynamic schema with blog posts
  const dynamicBlogSchema = {
    ...blogSchema,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.slice(0, 10).map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `https://www.guideforseniors.com/blog/${post.slug}`,
        name: post.title
      }))
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dynamicBlogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <GlobalHeader />

      {/* Breadcrumbs */}
      <nav className="bg-slate-50 border-b border-slate-200" aria-label="Breadcrumb">
        <div className="container mx-auto px-4 py-3">
          <ol className="flex items-center gap-1 text-sm">
            <li>
              <Link href="/" className="text-slate-600 hover:text-teal-600 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </li>
            <li>
              <span className="text-slate-900 font-medium">Blog & Advice</span>
            </li>
          </ol>
        </div>
      </nav>
      
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
                href="/cleveland"
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
