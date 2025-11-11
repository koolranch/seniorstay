import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, Tag, ArrowLeft, User } from 'lucide-react';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import ReactMarkdown from 'react-markdown';
import { fetchBlogPostBySlug, fetchRecentBlogPosts } from '@/lib/blog-posts';

export const revalidate = 300;

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await fetchBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const recentPosts = (await fetchRecentBlogPosts(3)).filter((p) => p.slug !== params.slug);

  return (
    <main className="flex min-h-screen flex-col bg-white">
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

            {/* Category Badge */}
            <div className="flex items-center gap-2 mb-4">
              <Tag className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">{post.category}</span>
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

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown
                components={{
                  h2: ({ children }) => (
                    <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900">{children}</h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="text-xl font-bold mt-6 mb-3 text-gray-900">{children}</h4>
                  ),
                  p: ({ children }) => (
                    <p className="mb-6 text-gray-700 leading-relaxed">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="mb-6 space-y-2 list-disc list-inside">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="mb-6 space-y-2 list-decimal list-inside">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-gray-700 ml-4">{children}</li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-bold text-gray-900">{children}</strong>
                  ),
                  a: ({ href, children }) => (
                    <a href={href} className="text-primary hover:underline font-medium">
                      {children}
                    </a>
                  ),
                  hr: () => <hr className="my-8 border-gray-300" />,
                  em: ({ children }) => <em className="italic">{children}</em>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-primary pl-4 italic my-6 text-gray-700">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* CTA Box */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 mt-12">
              <h3 className="text-2xl font-bold mb-4">Need Help Finding Senior Living in Cleveland?</h3>
              <p className="text-gray-700 mb-6">
                Our local advisors can provide personalized recommendations, schedule tours, and answer all your questions—completely free.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center"
                >
                  Get Free Consultation
                </Link>
                <Link
                  href="/greater-cleveland"
                  className="bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-6 rounded-lg border-2 border-gray-300 transition-colors text-center"
                >
                  Browse Communities
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {recentPosts.length > 0 && (
        <div className="bg-gray-50 py-16 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">More Helpful Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {recentPosts.map((relatedPost) => (
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

