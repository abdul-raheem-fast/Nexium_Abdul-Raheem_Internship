'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { FiCheckCircle, FiAlertCircle, FiLoader } from 'react-icons/fi';
import { verifyMagicLink } from '../../lib/api';

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. Please try signing in again.');
      return;
    }

    const verify = async () => {
      try {
        const response = await verifyMagicLink(token);
        
        // Store tokens
        localStorage.setItem('accessToken', response.tokens.accessToken);
        localStorage.setItem('refreshToken', response.tokens.refreshToken);
        
        // Store user info if provided
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
        
        setStatus('success');
        setMessage('Successfully signed in! Redirecting to dashboard...');
        
        // Trigger auth change event and redirect
        window.dispatchEvent(new Event('authChange'));
        
        // Redirect to dashboard after a brief delay
        setTimeout(() => {
          window.location.replace('/dashboard');
        }, 800);
        
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'Failed to verify magic link. Please try signing in again.');
      }
    };

    verify();
  }, [searchParams]);

  const handleRetry = () => {
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-10 text-center">
        <div className="mb-8">
          {status === 'loading' && (
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <FiLoader className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
          )}
          
          {status === 'success' && (
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <FiCheckCircle className="h-8 w-8 text-green-600" />
            </div>
          )}
          
          {status === 'error' && (
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <FiAlertCircle className="h-8 w-8 text-red-600" />
            </div>
          )}
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {status === 'loading' && 'Verifying...'}
            {status === 'success' && 'Welcome Back!'}
            {status === 'error' && 'Verification Failed'}
          </h1>
          
          <p className="text-gray-600 mb-6">
            {message}
          </p>
        </div>

        {status === 'loading' && (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-500">Please wait while we sign you in...</span>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              🎉 You're all set! Taking you to your dashboard...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800 mb-2">
                This magic link may have expired or already been used.
              </p>
              <p className="text-xs text-red-600">
                Magic links are valid for 15 minutes and can only be used once for security.
              </p>
            </div>
            
            <button
              onClick={handleRetry}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Back to Sign In
            </button>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Mental Health Tracker - Supporting your wellness journey
          </p>
        </div>
      </div>
    </div>
  );
}
