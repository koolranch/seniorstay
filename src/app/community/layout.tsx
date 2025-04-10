import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Senior Living Communities Directory | SeniorStay",
  description: "Find the perfect senior living community for you or your loved ones. Browse our comprehensive directory of assisted living, independent living, and memory care communities.",
  openGraph: {
    title: "Senior Living Communities Directory | SeniorStay",
    description: "Find the perfect senior living community for you or your loved ones. Browse our comprehensive directory of assisted living, independent living, and memory care communities.",
    type: 'website',
    url: 'https://seniorstay.com/community',
    siteName: 'SeniorStay'
  },
  twitter: {
    card: 'summary_large_image',
    title: "Senior Living Communities Directory | SeniorStay",
    description: "Find the perfect senior living community for you or your loved ones. Browse our comprehensive directory of assisted living, independent living, and memory care communities."
  },
  alternates: {
    canonical: 'https://seniorstay.com/community'
  }
};

export default function CommunityLayout({
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