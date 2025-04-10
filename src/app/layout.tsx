import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ComparisonProvider } from "@/context/ComparisonContext";
import { AuthProvider } from "@/context/AuthContext";
import ClientHeader from "@/components/ClientHeader";
import ClientFooter from "@/components/ClientFooter";
import ClientBody from "./ClientBody";

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
      </body>
    </html>
  );
}
