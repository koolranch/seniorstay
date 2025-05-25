import React from 'react';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ComparisonProvider } from '@/context/ComparisonContext';
import GoogleMapsScript from '@/components/map/GoogleMapsScript';

export const metadata: Metadata = {
  title: 'Cleveland Senior Guide | Find Assisted Living & Senior Care Options',
  description: 'Find the perfect senior living community with Cleveland Senior Guide. Compare assisted living, memory care, and independent living options.',
  keywords: 'senior living, assisted living, memory care, independent living, senior care, Cleveland senior living, Ohio senior living, senior housing',
  authors: [{ name: 'Cleveland Senior Guide' }],
  creator: 'Cleveland Senior Guide',
  publisher: 'Cleveland Senior Guide',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://guideforseniors.com'),
  alternates: {
    canonical: '/',
  },
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
    title: 'Cleveland Senior Guide | Find Assisted Living & Senior Care Options',
    description: 'Find the perfect senior living community with Cleveland Senior Guide. Compare assisted living, memory care, and independent living options.',
    url: 'https://guideforseniors.com',
    siteName: 'Cleveland Senior Guide',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Cleveland Senior Guide - Senior Living Directory',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cleveland Senior Guide | Find Assisted Living & Senior Care Options',
    description: 'Find the perfect senior living community with Cleveland Senior Guide. Compare assisted living, memory care, and independent living options.',
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
        <ComparisonProvider>
          {children}
        </ComparisonProvider>
        <GoogleMapsScript />
      </body>
    </html>
  );
}
