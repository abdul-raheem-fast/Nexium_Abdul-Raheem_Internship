'use client';

import React, { useState, useEffect } from 'react';
import './globals.css';

export const metadata = {
  title: 'Mental Health Tracker',
  description: 'AI-powered platform for proactive mental wellness',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

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
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="font-sans bg-neutral-50 text-neutral-900 min-h-screen">
        <header className="w-full bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl font-bold text-primary-blue tracking-tight">🧠 Mental Health Tracker</span>
            </div>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden flex items-center p-2"
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
            <nav className="hidden md:flex gap-6 text-base font-medium items-center">
              <a href="/dashboard" className="hover:text-primary-blue transition-colors">Dashboard</a>
              <a href="/mood" className="hover:text-primary-blue transition-colors">Mood</a>
              <a href="/insights" className="hover:text-primary-blue transition-colors">AI Insights</a>
              <a href="/profile" className="hover:text-primary-blue transition-colors">Profile</a>
              {isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="ml-4 px-4 py-1 rounded bg-error text-white font-semibold hover:bg-error/90 transition-colors"
                >
                  Logout
                </button>
              )}
            </nav>
          </div>
          
          {/* Mobile navigation */}
          {isMenuOpen && (
            <nav className="md:hidden flex flex-col bg-white py-4 px-4 border-t border-neutral-200">
              <a href="/dashboard" className="py-2 hover:text-primary-blue transition-colors">Dashboard</a>
              <a href="/mood" className="py-2 hover:text-primary-blue transition-colors">Mood</a>
              <a href="/insights" className="py-2 hover:text-primary-blue transition-colors">AI Insights</a>
              <a href="/profile" className="py-2 hover:text-primary-blue transition-colors">Profile</a>
              {isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="mt-2 px-4 py-1 rounded bg-error text-white font-semibold hover:bg-error/90 transition-colors text-left"
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
        <footer className="bg-white border-t border-neutral-200 mt-12 py-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <h3 className="text-lg font-semibold text-primary-blue">Mental Health Tracker</h3>
                <p className="text-sm text-neutral-500">AI-powered platform for proactive mental wellness</p>
              </div>
              <div className="flex gap-6">
                <a href="/" className="text-sm text-neutral-700 hover:text-primary-blue">Home</a>
                <a href="/dashboard" className="text-sm text-neutral-700 hover:text-primary-blue">Dashboard</a>
                <a href="/profile" className="text-sm text-neutral-700 hover:text-primary-blue">Profile</a>
              </div>
            </div>
            <div className="mt-6 text-center text-xs text-neutral-500">
              © {new Date().getFullYear()} Mental Health Tracker. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}