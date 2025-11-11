import Link from 'next/link';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import BlogListing from '@/components/blog/BlogListing';
import { fetchAllBlogPosts } from '@/lib/blog-posts';

export const revalidate = 300;

export default async function BlogPage() {
  const posts = await fetchAllBlogPosts();

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Header />
      <BlogListing posts={posts} />

      <div className="bg-gray-50 py-16 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Need Personal Guidance?</h2>
            <p className="text-lg text-gray-700 mb-8">
              Our Cleveland advisors can answer your specific questions, schedule tours, and help you find the perfect
              community—completely free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                Get Free Consultation
              </Link>
              <Link
                href="/greater-cleveland"
                className="bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-8 rounded-lg border-2 border-gray-300 transition-colors"
              >
                Browse Communities
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

