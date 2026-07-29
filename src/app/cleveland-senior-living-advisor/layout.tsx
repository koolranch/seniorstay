import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Senior Living Placement Cleveland | Free Local Advisor | Guide for Seniors',
  description:
    'Free senior living placement in Cleveland and the suburbs. A local advisor compares assisted living, memory care, and independent living, shares real pricing, and schedules tours — at no cost to your family.',
  keywords:
    'senior living placement cleveland, senior living advisor cleveland, assisted living advisor cleveland, senior placement services cleveland oh, free senior living referral cleveland, help finding assisted living cleveland',
  alternates: {
    canonical: 'https://www.guideforseniors.com/cleveland-senior-living-advisor',
  },
  openGraph: {
    title: 'Free Senior Living Placement in Cleveland | Local Advisor',
    description:
      'One call, and a Cleveland-area advisor shortlists assisted living and memory care communities that fit your care needs and budget — free to families.',
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
