import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Senior Blog | Guide for Seniors',
  description: 'Explore our collection of articles about senior living, health, travel, technology, and more. Stay informed with expert advice and resources for seniors.',
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
} 