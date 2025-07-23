import React, { useEffect } from 'react';

export default function withAuth<P>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    useEffect(() => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/login';
        }
      }
    }, []);
    return <Component {...props} />;
  };
} 