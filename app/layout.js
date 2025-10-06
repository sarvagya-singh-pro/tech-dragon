import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Optimize font loading
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // Prevent invisible text while font loads
  preload: true,
  fallback: ['system-ui', 'arial'],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['ui-monospace', 'monospace'],
});

// Improved metadata
export const metadata = {
  title: {
    default: 'Tech Dragon - Future Tech Insights',
    template: '%s | Tech Dragon'
  },
  description: 'Explore cutting-edge tech insights, AI tutorials, and next-gen web development on Tech Dragon. Join the future of technology.',
  keywords: ['tech blog', 'AI', 'machine learning', 'web development', 'coding', 'next.js', 'react', 'programming', 'tech tutorials'],
  authors: [{ name: 'Sarvagya Singh' }],
  creator: 'Sarvagya Singh',
  publisher: 'Tech Dragon',
  
  // Open Graph metadata for social sharing
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://techdragon.dev',
    siteName: 'Tech Dragon',
    title: 'Tech Dragon - Future Tech Insights',
    description: 'Explore cutting-edge tech insights, AI tutorials, and next-gen web development',
    images: [
      {
        url: '/og-image.jpg', // Create this image (1200x630px)
        width: 1200,
        height: 630,
        alt: 'Tech Dragon Logo',
      }
    ],
  },
  
  // Twitter metadata
  twitter: {
    card: 'summary_large_image',
    title: 'Tech Dragon - Future Tech Insights',
    description: 'Explore cutting-edge tech insights and AI tutorials',
    images: ['/og-image.jpg'],
    creator: '@techdragon', // Replace with your Twitter handle
  },
  
  // Additional metadata
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
  
  // Verification tags (add your actual verification codes)
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // other: 'your-other-verification-code',
  },
  
  // Category
  category: 'technology',
};

// Viewport configuration
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#000000',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://firestore.googleapis.com" />
        <link rel="preconnect" href="https://storage.googleapis.com" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
        
        {/* Preload critical assets */}
        <link rel="preload" href="/logo.svg" as="image" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Manifest for PWA */}
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="antialiased bg-black text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
