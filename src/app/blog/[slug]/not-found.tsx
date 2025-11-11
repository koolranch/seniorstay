import Link from 'next/link';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';

export default function BlogPostNotFound() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Header />
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-8">Sorry, we couldn&apos;t find the article you&apos;re looking for.</p>
          <Link href="/blog" className="text-primary hover:underline font-semibold">
            ← Back to Blog
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}

