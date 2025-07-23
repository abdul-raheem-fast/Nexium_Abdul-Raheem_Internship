import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true
});

export const metadata: Metadata = {
  title: {
    default: "Nexium Blog Summarizer & Webhook System",
    template: "%s | Nexium Blog Summarizer"
  },
  description: "Advanced AI-powered blog summarization with n8n webhook integration. Built by Abdul Raheem Khan for Nexium Internship Program.",
  keywords: [
    "blog summarizer",
    "AI summarization", 
    "n8n webhooks",
    "Urdu translation",
    "Next.js",
    "Supabase",
    "MongoDB",
    "automation",
    "Abdul Raheem Khan",
    "Nexium"
  ],
  authors: [{ name: "Muhammad Abdul Raheem Khan", url: "https://github.com/yourusername" }],
  creator: "Muhammad Abdul Raheem Khan",
  publisher: "Nexium Internship Program",
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
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    siteName: 'Nexium Blog Summarizer',
    title: 'Advanced Blog Summarizer & Webhook System',
    description: 'AI-powered blog summarization with real-time analytics and n8n integration',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nexium Blog Summarizer Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nexium Blog Summarizer & Webhook System',
    description: 'Advanced AI-powered blog summarization with n8n webhook integration',
    images: ['/og-image.jpg'],
    creator: '@yourtwitterhandle',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  verification: {
    google: 'your-google-verification-code',
  },
  category: 'technology',
  classification: 'Web Application',
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for better performance */}
        <link rel="dns-prefetch" href="https://supabase.com" />
        <link rel="dns-prefetch" href="https://mongodb.com" />
        
        {/* Viewport meta tag for responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#3b82f6" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        
        {/* Apple specific meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Nexium Summarizer" />
        
        {/* Performance and security headers */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="referrer" content="origin-when-cross-origin" />
        
        {/* Structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Nexium Blog Summarizer",
              "description": "Advanced AI-powered blog summarization with n8n webhook integration",
              "url": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
              "author": {
                "@type": "Person",
                "name": "Muhammad Abdul Raheem Khan"
              },
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "AI-powered blog summarization",
                "Urdu translation",
                "n8n webhook integration", 
                "Real-time analytics",
                "Performance monitoring"
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        {/* Skip to main content for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white p-2 rounded z-50"
        >
          Skip to main content
        </a>
        
        {/* Global error boundary will be handled by Next.js error.tsx */}
        <main id="main-content" className="min-h-screen">
        {children}
        </main>
        

        
        {/* Footer with attribution */}
        <footer className="bg-gray-900 text-white py-8 mt-auto">
          <div className="container mx-auto px-4 text-center">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="text-xl font-bold mb-2">🚀 Nexium Blog Summarizer</h3>
                <p className="text-gray-400">Advanced Blog Summarizer & Webhook System</p>
              </div>
              <div className="text-sm text-gray-400">
                <p>Built with ❤️ by <strong className="text-white">Muhammad Abdul Raheem Khan</strong></p>
                <p>Nexium Internship Program - Enterprise Platform</p>
                <div className="flex gap-4 mt-2 justify-center">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Production Ready
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Fully Documented
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    Enterprise Grade
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                <p>Tech Stack: Next.js 15, TypeScript, Supabase, MongoDB</p>
                <p>Features: AI Summarization, n8n Webhooks, Real-time Analytics</p>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-6 pt-6 text-xs text-gray-500">
              <p>© 2025 Nexium Internship Program. This project demonstrates advanced full-stack development skills.</p>
            </div>
          </div>
        </footer>
        
        {/* Performance monitoring script (placeholder) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Performance monitoring
              if (typeof window !== 'undefined') {
                window.addEventListener('load', function() {
                  // Monitor Core Web Vitals
                  try {
                    new PerformanceObserver((list) => {
                      for (const entry of list.getEntries()) {
                        console.log('Performance metric:', entry.name, entry.value);
                      }
                    }).observe({entryTypes: ['measure', 'navigation']});
                  } catch (e) {
                    console.log('Performance monitoring not supported');
                  }
                });
              }
            `
          }}
        />
      </body>
    </html>
  );
}
