'use client';

import React, { useState, useEffect } from 'react';
import './globals.css';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { ToastProvider } from './components/Toast';

// Metadata moved to a constant since we can't export it with 'use client'
const siteMetadata = {
  title: 'Mental Health Tracker',
  description: 'AI-powered platform for proactive mental wellness',
};

function LayoutContent({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Close mobile menu when resizing to desktop
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // Trigger auth change event
    window.dispatchEvent(new Event('authChange'));
    
    window.location.href = '/login';
  };

  return (
    <>
        <header className="w-full bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600 tracking-tight">🧠 Mental Health Tracker</span>
            </div>
            
            {/* Mobile menu button */}
            <button
              className="md:hidden flex items-center p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            
            {/* Desktop navigation */}
            <nav className="hidden md:flex gap-4 lg:gap-6 text-sm lg:text-base font-medium items-center">
              <a href="/dashboard" className="hover:text-blue-600 transition-colors px-2 py-1 rounded">Dashboard</a>
              <a href="/mood" className="hover:text-blue-600 transition-colors px-2 py-1 rounded">Mood</a>
              <a href="/insights" className="hover:text-blue-600 transition-colors px-2 py-1 rounded">AI Insights</a>
                             <a href="/profile" className="hover:text-blue-600 transition-colors px-2 py-1 rounded">Profile</a>
               {isAuthenticated && (
                 <button
                   onClick={handleLogout}
                   className="ml-2 lg:ml-4 px-3 lg:px-4 py-1.5 lg:py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors text-sm lg:text-base"
                 >
                   Logout
                 </button>
               )}
            </nav>
          </div>
          
          {/* Mobile navigation */}
          {isMenuOpen && (
            <nav className="md:hidden flex flex-col bg-white py-4 px-4 border-t border-neutral-200 shadow-lg">
              <a href="/dashboard" className="py-3 px-2 hover:text-blue-600 hover:bg-neutral-50 transition-colors rounded text-base">Dashboard</a>
              <a href="/mood" className="py-3 px-2 hover:text-blue-600 hover:bg-neutral-50 transition-colors rounded text-base">Mood</a>
              <a href="/insights" className="py-3 px-2 hover:text-blue-600 hover:bg-neutral-50 transition-colors rounded text-base">AI Insights</a>
                             <a href="/profile" className="py-3 px-2 hover:text-blue-600 hover:bg-neutral-50 transition-colors rounded text-base">Profile</a>
               {isAuthenticated && (
                 <button
                   onClick={handleLogout}
                   className="mt-3 mx-2 px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors text-left text-base"
                 >
                   Logout
                 </button>
               )}
            </nav>
          )}
        </header>
        <main className="max-w-6xl mx-auto px-4 py-8 w-full">
          {children}
        </main>
        <footer className="bg-white border-t border-neutral-200 mt-8 sm:mt-12 py-6 sm:py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-base sm:text-lg font-semibold text-blue-600">Mental Health Tracker</h3>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1">AI-powered platform for proactive mental wellness</p>
              </div>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                <a href="/" className="text-xs sm:text-sm text-neutral-700 hover:text-blue-600 transition-colors px-2 py-1 rounded">Home</a>
                <a href="/dashboard" className="text-xs sm:text-sm text-neutral-700 hover:text-blue-600 transition-colors px-2 py-1 rounded">Dashboard</a>
                <a href="/profile" className="text-xs sm:text-sm text-neutral-700 hover:text-blue-600 transition-colors px-2 py-1 rounded">Profile</a>
              </div>
            </div>
            <div className="mt-4 sm:mt-6 text-center text-xs text-neutral-500">
              © {new Date().getFullYear()} Mental Health Tracker. All rights reserved.
            </div>
          </div>
        </footer>
      </>
    );
  }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        <meta name="theme-color" content="#3B82F6" />
      </head>
      <body className="font-sans bg-neutral-50 text-neutral-900 min-h-screen">
        <AuthProvider>
          <ToastProvider>
            <LayoutContent>
              {children}
            </LayoutContent>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}