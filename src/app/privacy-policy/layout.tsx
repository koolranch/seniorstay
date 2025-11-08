import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Guide for Seniors',
  description: 'Privacy Policy for Guide for Seniors. Learn how we collect, use, and protect your personal information when helping you find senior living communities in Cleveland.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

