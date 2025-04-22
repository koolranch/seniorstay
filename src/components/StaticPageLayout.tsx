import React from 'react';

interface StaticPageLayoutProps {
  children: React.ReactNode;
}

export default function StaticPageLayout({ children }: StaticPageLayoutProps) {
  return (
    <div className="bg-white text-gray-900 dark:bg-white dark:text-gray-900 px-4 py-10 min-h-screen">
      <div className="container mx-auto max-w-3xl">
        {children}
      </div>
    </div>
  );
} 