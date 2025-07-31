"use client";

import React, { useEffect, useState } from 'react';

export default function withAuth<P>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
      const checkAuth = () => {
        if (typeof window !== 'undefined') {
          const accessToken = localStorage.getItem('accessToken');
          
          if (!accessToken) {
            // Only redirect if we're not already on the login page
            if (window.location.pathname !== '/login' && window.location.pathname !== '/auth/verify') {
              window.location.href = '/login';
            }
            setIsAuthenticated(false);
            return;
          }

          // Token exists, allow access
          setIsAuthenticated(true);
        }
      };

      checkAuth();
    }, []);

    // Show loading state while checking authentication
    if (isAuthenticated === null) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-blue-600 font-medium">Loading...</p>
          </div>
        </div>
      );
    }

    return isAuthenticated ? <Component {...props} /> : null;
  };
}
