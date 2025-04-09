import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Senior Blog | SeniorStay',
  description: 'Explore our collection of articles about senior living, health, travel, technology, and more. Stay informed and inspired with our trusted content.',
  openGraph: {
    title: 'Senior Blog | SeniorStay',
    description: 'Explore our collection of articles about senior living, health, travel, technology, and more. Stay informed and inspired with our trusted content.',
    type: 'website',
    url: 'https://guideforseniors.com/blog'
  }
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        {children}
      </div>
    </div>
  );
} 