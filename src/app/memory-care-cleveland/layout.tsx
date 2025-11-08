import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Memory Care in Cleveland, OH | Alzheimer\'s & Dementia Care | Guide for Seniors',
  description: 'Find specialized memory care for Alzheimer\'s and dementia in Cleveland, Ohio. Secure communities with expert staff. Compare options, costs, and schedule tours with free local guidance.',
  keywords: 'memory care cleveland, alzheimers care cleveland, dementia care cleveland ohio, memory care facilities cleveland, cleveland memory care costs',
  openGraph: {
    title: 'Memory Care in Cleveland, OH | Expert Alzheimer\'s & Dementia Care',
    description: 'Complete guide to memory care in Cleveland. Learn about specialized services, costs, and how to choose the right memory care community for your loved one.',
    url: 'https://www.guideforseniors.com/memory-care-cleveland',
    siteName: 'Guide for Seniors',
    locale: 'en_US',
    type: 'article',
  },
};

export default function MemoryCareClevelandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

