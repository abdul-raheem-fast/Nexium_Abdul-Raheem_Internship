import React from 'react';
import './globals.css';

export const metadata = {
  title: 'Mental Health Tracker',
  description: 'AI-powered platform for proactive mental wellness',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans bg-neutral-50 text-neutral-900 min-h-screen">
        <header className="w-full bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary-blue tracking-tight">🧠 Mental Health Tracker</span>
            </div>
            <nav className="flex gap-6 text-base font-medium items-center">
              <a href="/dashboard" className="hover:text-primary-blue transition-colors">Dashboard</a>
              <a href="/mood" className="hover:text-primary-blue transition-colors">Mood</a>
              <a href="/insights" className="hover:text-primary-blue transition-colors">AI Insights</a>
              <a href="/profile" className="hover:text-primary-blue transition-colors">Profile</a>
              {typeof window !== 'undefined' && localStorage.getItem('token') && (
                <button
                  onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}
                  className="ml-4 px-4 py-1 rounded bg-error text-white font-semibold hover:bg-error/90 transition-colors"
                >
                  Logout
                </button>
              )}
            </nav>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-8 w-full">
          {children}
        </main>
      </body>
    </html>
  );
} 