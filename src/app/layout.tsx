import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ComparisonProvider } from "@/context/ComparisonContext";
import { AuthProvider } from "@/context/AuthContext";
import ClientHeader from "@/components/ClientHeader";
import ClientFooter from "@/components/ClientFooter";
import ClientBody from "./ClientBody";
import { Analytics } from "@vercel/analytics/react";
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GuideForSeniors | Find Senior Living Communities",
  description: "Browse and compare senior living communities in Ohio. Find independent living, assisted living, memory care and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script 
          async 
          src="https://www.googletagmanager.com/gtag/js?id=G-Q2CS0GMD3C" 
          strategy="afterInteractive"
        />
        <Script 
          id="google-analytics" 
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-Q2CS0GMD3C');
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ComparisonProvider>
            <ClientHeader />
            <ClientBody>
              <main className="min-h-screen">
                {children}
              </main>
            </ClientBody>
            <ClientFooter />
          </ComparisonProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
