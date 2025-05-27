import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Guide for Seniors',
  description: 'Get in touch with Guide for Seniors. We\'re here to help you find the perfect senior living community.',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 