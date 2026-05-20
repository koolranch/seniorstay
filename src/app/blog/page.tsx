import Link from 'next/link';
import GlobalHeader from '@/components/home/GlobalHeader';
import Footer from '@/components/footer/Footer';
import BlogListing from '@/components/blog/BlogListing';
import { fetchBlogPostSummaries } from '@/lib/blog-posts';
import PhoneLink from '@/components/conversion/PhoneLink';
import { Phone, ArrowRight, BookOpen, ChevronRight, DollarSign } from 'lucide-react';

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
  const posts = await fetchBlogPostSummaries();

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

      {/* Featured cost guide — high-intent placement content */}
      <section className="bg-teal-50 border-b border-teal-100 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-100 px-3 py-1 rounded-full mb-3">
                <DollarSign className="h-3.5 w-3.5" />
                Most searched
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
                2026 Assisted Living Costs in Ohio
              </h2>
              <p className="text-slate-600 text-sm">
                City-by-city pricing for Cleveland suburbs — what families actually pay and how to compare communities.
              </p>
            </div>
            <Link
              href="/blog/cost-of-assisted-living-ohio"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3.5 rounded-xl shrink-0"
            >
              Read the cost guide
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Listing */}
      <BlogListing posts={posts} />

      {/* All Articles archive — server-rendered so every post is crawlable.
          BlogListing only paginates 12 posts at a time client-side, which
          hides the rest from search engines. This flat list restores the
          internal link graph from the hub to all posts. */}
      <section aria-labelledby="all-articles" className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 id="all-articles" className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              All Articles
            </h2>
            <p className="text-slate-600 mb-6">
              Browse every article in our Cleveland senior living library ({posts.length} total).
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
              {[...posts]
                .sort((a, b) => a.title.localeCompare(b.title))
                .map((post) => (
                  <li key={post.slug} className="border-b border-slate-200/60 py-1.5">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-teal-700 hover:text-teal-900 hover:underline"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </section>

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
              <PhoneLink
                placement="blog_index_cta"
                className="inline-flex items-center justify-center gap-2 bg-white text-teal-700 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:bg-slate-50 transition-all min-h-[56px]"
              >
                <Phone className="h-5 w-5" />
                Call for Free Help
              </PhoneLink>
              <Link
                href="/contact?intent=placement"
                className="inline-flex items-center justify-center gap-2 bg-teal-800 text-white font-bold px-8 py-4 rounded-xl hover:bg-teal-900 transition-all min-h-[56px]"
              >
                Request a Callback
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="mt-6">
              <Link
                href="/cleveland"
                className="text-teal-100 hover:text-white font-medium underline-offset-2 hover:underline"
              >
                Browse Cleveland communities →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
