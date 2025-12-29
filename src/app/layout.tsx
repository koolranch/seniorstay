import React from 'react';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ComparisonProvider } from '@/context/ComparisonContext';
import GoogleMapsScript from '@/components/map/GoogleMapsScript';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import MetaPixel from '@/components/analytics/MetaPixel';

export const metadata: Metadata = {
  title: 'Assisted Living & Memory Care in Cleveland, OH | Guide for Seniors',
  description: 'Find the best assisted living and memory care in Cleveland, Ohio. Compare 70+ communities, get free local guidance, and schedule tours. Serving Greater Cleveland families since 2024.',
  keywords: 'assisted living cleveland, memory care cleveland ohio, senior living cleveland, cleveland assisted living facilities, dementia care cleveland, alzheimers care cleveland',
  authors: [{ name: 'Guide for Seniors' }],
  creator: 'Guide for Seniors',
  publisher: 'Guide for Seniors',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.guideforseniors.com'),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Assisted Living & Memory Care in Cleveland, OH | Guide for Seniors',
    description: 'Find the best assisted living and memory care communities in Cleveland with free expert guidance. Compare options, schedule tours, get pricing.',
    url: 'https://www.guideforseniors.com',
    siteName: 'Guide for Seniors',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Guide for Seniors - Senior Living Directory',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guide for Seniors | Find Assisted Living & Senior Care Options',
    description: 'Find the perfect senior living community with Guide for Seniors. Compare assisted living, memory care, and independent living options.',
    images: ['/images/twitter-image.jpg'],
    creator: '@guideforseniors',
  },
  verification: {
    google: 'your-google-site-verification',
    yandex: 'your-yandex-verification',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0070f3" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className="min-h-screen bg-white antialiased">
        <GoogleAnalytics />
        <MetaPixel />
        <ComparisonProvider>
          {children}
        </ComparisonProvider>
        <GoogleMapsScript />
      </body>
    </html>
  );
}
