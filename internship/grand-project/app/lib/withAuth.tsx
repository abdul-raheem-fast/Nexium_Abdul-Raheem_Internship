"use client";

import React, { useEffect, useState } from 'react';
import { getUserInfo } from './api';

export default function withAuth<P>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
      const checkAuth = async () => {
        if (typeof window !== 'undefined') {
          const accessToken = localStorage.getItem('accessToken');
          
          if (!accessToken) {
            window.location.href = '/login';
            return;
          }

          try {
            // Verify token by making a request to get user info
            await getUserInfo();
            setIsAuthenticated(true);
          } catch (error) {
            // Token is invalid or expired, redirect to login
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
          }
        }
      };

      checkAuth();
    }, []);

    // Show loading state while checking authentication
    if (isAuthenticated === null) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue"></div>
        </div>
      );
    }

    return isAuthenticated ? <Component {...props} /> : null;
  };
}