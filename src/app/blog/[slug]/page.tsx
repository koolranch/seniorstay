import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, Tag, ArrowLeft, User, MapPin, Phone } from 'lucide-react';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import PhoneLink from '@/components/conversion/PhoneLink';
import { fetchBlogPostBySlug, fetchRelatedBlogPosts, isRegionalPost, getPostRegionDisplayName } from '@/lib/blog-posts';
import SuburbLinksSection from '@/components/blog/SuburbLinksSection';
import BlogArticleContent from '@/components/blog/BlogArticleContent';
import Script from 'next/script';

export const revalidate = 300;

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

// Generate ISO date format for schema
const formatISODate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString();
};

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await fetchBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await fetchRelatedBlogPosts(params.slug, post.category, 3);

  // Check if this is a Medicaid-related article to show suburb links
  const isMedicaidRelated = post.slug.includes('medicaid') || 
    post.category.toLowerCase().includes('medicaid') ||
    post.title.toLowerCase().includes('medicaid') ||
    post.content.toLowerCase().includes('medicaid waiver');

  // Author schema for E-E-A-T signals
  const authorSchema = {
    "@type": "Person",
    "@id": "https://guideforseniors.com/#author",
    "name": post.author || "Guide for Seniors Editorial Team",
    "jobTitle": "Cleveland Senior Living Advisor",
    "worksFor": {
      "@type": "Organization",
      "name": "Guide for Seniors",
      "url": "https://guideforseniors.com"
    },
    "knowsAbout": [
      "Assisted Living",
      "Memory Care",
      "Senior Care",
      "Ohio Medicaid Waiver",
      "Cleveland Senior Services"
    ]
  };

  // Article schema with author reference
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.description,
    "author": authorSchema,
    "publisher": {
      "@type": "Organization",
      "name": "Guide for Seniors",
      "url": "https://guideforseniors.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://guideforseniors.com/images/logo.png"
      }
    },
    "datePublished": formatISODate(post.date),
    "dateModified": formatISODate(post.date),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://guideforseniors.com/blog/${params.slug}`
    },
    "articleSection": post.category,
    "inLanguage": "en-US"
  };

  // Check if regional post for enhanced breadcrumbs
  const isRegional = isRegionalPost(post);
  const regionDisplayName = getPostRegionDisplayName(post);
  const regionSlug = post.regionSlug;

  // Breadcrumb schema - Enhanced for regional posts
  // Cleveland-specific posts link back to /cleveland hub for SEO silo integrity
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": isRegional && regionSlug ? [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://guideforseniors.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": regionDisplayName,
        "item": `https://guideforseniors.com/${regionSlug}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Expert Advice",
        "item": "https://guideforseniors.com/blog"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": post.title,
        "item": `https://guideforseniors.com/blog/${params.slug}`
      }
    ] : [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://guideforseniors.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://guideforseniors.com/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://guideforseniors.com/blog/${params.slug}`
      }
    ]
  };

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* Structured Data for SEO */}
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <Header />
      
      {/* Article Header */}
      <article className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back Link */}
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 text-primary hover:underline mb-8 font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>

            {/* Category & Regional Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">{post.category}</span>
              </div>
              {isRegional && regionDisplayName && (
                <div className="flex items-center gap-1.5 bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-medium">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{regionDisplayName}</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-8 pb-8 border-b">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
            </div>

            {/* Article Content with Enhanced UI */}
            <BlogArticleContent content={post.content} slug={params.slug} />

            {/* Suburb Links for Medicaid Articles - Internal Siloing */}
            {isMedicaidRelated && (
              <SuburbLinksSection 
                title="Find Medicaid-Approved Communities Near You"
                subtitle="Looking for a facility that accepts the Ohio Medicaid Assisted Living Waiver? Browse communities in these Cleveland suburbs:"
              />
            )}

            {/* CTA Box - Region-aware, phone-first */}
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-8 mt-12">
              <h3 className="text-2xl font-bold mb-4 text-slate-900">
                Need Help Finding Senior Living{isRegional && regionDisplayName ? ` in ${regionDisplayName}` : ''}?
              </h3>
              <p className="text-slate-700 mb-6">
                Our {isRegional && regionDisplayName ? `${regionDisplayName} ` : ''}local advisors compare pricing, schedule tours, and answer your questions — completely free.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <PhoneLink
                  placement="blog_post_cta"
                  className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center min-h-[48px]"
                >
                  <Phone className="h-5 w-5" />
                  Call for Free Help
                </PhoneLink>
                <Link
                  href={`/contact?intent=placement${isRegional && regionSlug ? `&region=${regionSlug}` : ''}`}
                  className="inline-flex items-center justify-center bg-white hover:bg-slate-50 text-slate-900 font-semibold py-3 px-6 rounded-lg border-2 border-teal-200 transition-colors text-center min-h-[48px]"
                >
                  Request a Callback
                </Link>
              </div>
              <div className="mt-4">
                <Link
                  href={isRegional && regionSlug ? `/${regionSlug}` : '/cleveland'}
                  className="text-teal-700 hover:text-teal-900 font-medium text-sm"
                >
                  Browse {regionDisplayName || 'Cleveland'} communities →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts - Category-based recommendations for better internal linking */}
      {relatedPosts.length > 0 && (
        <div className="bg-gray-50 py-16 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Related Articles You May Find Helpful</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.slug}
                    href={`/blog/${relatedPost.slug}`}
                    className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-primary">{relatedPost.category}</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {relatedPost.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{relatedPost.readTime}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}

