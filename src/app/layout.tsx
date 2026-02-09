import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SonnerLabsProvider } from "@/components/sonner-labs/sonner-labs-provider";
import { ThemeProvider } from "next-themes";
import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sonnerlabs.devvarena.com"),
  title: "Sonner Labs | UI Toast Configurator",
  description: "A professional-grade playground for configuring and previewing Sonner notification systems. Craft perfect toasts with real-time CSS and React code export.",
  keywords: ["sonner", "sonner-customizer", "toast", "notifications", "react", "react-toast", "nextjs", "ui-ux", "configurator", "frontend"],
  authors: [{ name: "Devyansh Yadav" }],
  openGraph: {
    title: "Sonner Labs | UI Toast Configurator",
    description: "The ultimate playground for Sonner notifications. Configure, preview, and export in seconds.",
    url: "https://sonnerlabs.devvarena.com",
    siteName: "Sonner Labs",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/banner.png",
        width: 1200,
        height: 630,
        alt: "Sonner Labs Configurator Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sonner Labs | UI Toast Configurator",
    description: "The ultimate playground for Sonner notifications.",
    images: ["/banner.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          <SonnerLabsProvider>
            {children}
          </SonnerLabsProvider>
        </ThemeProvider>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
