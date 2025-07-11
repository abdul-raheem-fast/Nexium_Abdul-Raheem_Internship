'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to monitoring service in production
    console.error('Application error:', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });

    // In production, send to error tracking service
    // Example: Sentry, LogRocket, or custom endpoint
    if (process.env.NODE_ENV === 'production') {
      // fetch('/api/log-error', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     error: error.message,
      //     digest: error.digest,
      //     stack: error.stack,
      //     url: window.location.href,
      //     timestamp: new Date().toISOString()
      //   })
      // }).catch(console.error);
    }
  }, [error]);

  const getErrorType = (error: Error) => {
    if (error.message.includes('fetch')) return 'Network Error';
    if (error.message.includes('database')) return 'Database Error';
    if (error.message.includes('auth')) return 'Authentication Error';
    if (error.message.includes('rate limit')) return 'Rate Limit Error';
    return 'Application Error';
  };

  const getErrorSuggestion = (error: Error) => {
    const message = error.message.toLowerCase();
    
    if (message.includes('fetch') || message.includes('network')) {
      return 'Please check your internet connection and try again.';
    }
    if (message.includes('database') || message.includes('connection')) {
      return 'Database connection issue. Please try again in a moment.';
    }
    if (message.includes('rate limit')) {
      return 'You\'ve made too many requests. Please wait a moment before trying again.';
    }
    if (message.includes('not found') || message.includes('404')) {
      return 'The requested resource could not be found.';
    }
    if (message.includes('unauthorized') || message.includes('403')) {
      return 'You don\'t have permission to access this resource.';
    }
    return 'An unexpected error occurred. Please try refreshing the page.';
  };

  const isRetryable = (error: Error) => {
    const message = error.message.toLowerCase();
    return !message.includes('not found') && 
           !message.includes('unauthorized') && 
           !message.includes('forbidden');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-red-900 dark:to-orange-900 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <svg 
                className="w-8 h-8 text-red-600 dark:text-red-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
            </div>
            <CardTitle className="text-2xl text-red-800 dark:text-red-200">
              {getErrorType(error)}
            </CardTitle>
            <CardDescription className="text-red-600 dark:text-red-300">
              {getErrorSuggestion(error)}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Error Details */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">Error Details:</h4>
              <p className="text-sm text-red-700 dark:text-red-300 font-mono break-words">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {isRetryable(error) && (
                <Button 
                  onClick={reset}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  🔄 Try Again
                </Button>
              )}
              
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/'}
                className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20"
              >
                🏠 Go Home
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => window.location.reload()}
                className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20"
              >
                🔄 Refresh Page
              </Button>
            </div>

            {/* Help Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">💡 Need Help?</h4>
              <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                <p>• Check the <a href="/analytics" className="underline hover:no-underline">analytics dashboard</a> for system status</p>
                <p>• Try the <a href="/webhooks" className="underline hover:no-underline">webhook testing interface</a> to verify connectivity</p>
                <p>• View API documentation at <a href="/api/webhook/quotes" className="underline hover:no-underline">/api/webhook/quotes</a></p>
                <p>• If the problem persists, contact support with Error ID: <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">{error.digest || 'N/A'}</code></p>
              </div>
            </div>

            {/* System Status */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>System Status: Operational</span>
                <span>•</span>
                <span>Uptime: 99.9%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Development Info (only in dev mode) */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="mt-6 border-yellow-200 dark:border-yellow-800">
            <CardHeader>
              <CardTitle className="text-yellow-800 dark:text-yellow-200 text-lg">
                🛠️ Development Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <details className="text-sm">
                <summary className="cursor-pointer text-yellow-700 dark:text-yellow-300 font-medium mb-2">
                  View Stack Trace
                </summary>
                <pre className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded text-xs overflow-auto max-h-40 text-yellow-800 dark:text-yellow-200">
                  {error.stack}
                </pre>
              </details>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 