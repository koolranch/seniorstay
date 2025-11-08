import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Assisted Living in Cleveland, OH | Guide for Seniors',
  description: 'Find the best assisted living communities in Cleveland, Ohio. Compare costs, services, and amenities. Get free personalized help from local advisors. Tour request assistance available.',
  keywords: 'assisted living cleveland, assisted living cleveland ohio, senior living cleveland, cleveland assisted living facilities, assisted living costs cleveland',
  openGraph: {
    title: 'Assisted Living in Cleveland, OH | Complete Guide',
    description: 'Comprehensive guide to assisted living in Cleveland. Learn about services, costs, and how to choose the right community for your loved one.',
    url: 'https://www.guideforseniors.com/assisted-living-cleveland',
    siteName: 'Guide for Seniors',
    locale: 'en_US',
    type: 'article',
  },
};

export default function AssistedLivingClevelandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

