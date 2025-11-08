import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Guide for Seniors',
  description: 'Terms of Service for Guide for Seniors referral service. Understand our role, your rights, and our limitations when helping you find senior living in Cleveland.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsOfServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

