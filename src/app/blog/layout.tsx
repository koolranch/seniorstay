import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | SeniorStay Blog',
    default: 'Senior Living Resources & Articles | SeniorStay Blog',
  },
  description: 'Explore articles and resources about senior living, retirement communities, and tips for older adults and their families.',
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAFAF5]">
      {children}
    </div>
  );
} 