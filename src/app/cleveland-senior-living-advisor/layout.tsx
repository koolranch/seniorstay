import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cleveland Senior Living Advisor — Free Local Placement Help | Guide for Seniors',
  description:
    'Talk to a free local senior living advisor in Cleveland. We help families compare assisted living, memory care, and independent living communities, check real pricing and availability, and schedule tours — at no cost to you.',
  keywords:
    'senior living advisor cleveland, senior placement services cleveland, help finding assisted living cleveland, free senior living referral cleveland ohio, elder care advisor cleveland',
  alternates: {
    canonical: 'https://www.guideforseniors.com/cleveland-senior-living-advisor',
  },
  openGraph: {
    title: 'Free Cleveland Senior Living Advisor | Guide for Seniors',
    description:
      'One call, and a local advisor shortlists Cleveland-area communities that fit your care needs and budget — free to families.',
    url: 'https://www.guideforseniors.com/cleveland-senior-living-advisor',
    siteName: 'Guide for Seniors',
    locale: 'en_US',
    type: 'website',
  },
};

export default function ClevelandSeniorLivingAdvisorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
