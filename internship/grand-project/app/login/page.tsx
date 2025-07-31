'use client';

import React, { useState, useEffect } from 'react';
import { FiMail, FiAlertCircle, FiArrowRight, FiUser, FiCheckCircle } from 'react-icons/fi';
import { sendMagicLink } from '../lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await sendMagicLink(email);
      setSuccess(response.message);
      setEmailSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send magic link');
    } finally {
      setLoading(false);
    }
  };

  const handleTryAgain = () => {
    setEmailSent(false);
    setSuccess('');
    setError('');
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-10 transform transition-all duration-300 hover:shadow-2xl border border-neutral-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FiUser className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-blue-600 mb-2">
            {emailSent ? 'Check Your Email' : 'Welcome Back'}
          </h1>
          <p className="text-neutral-500">
            {emailSent ? 'We sent you a secure sign-in link' : 'Sign in to continue your wellness journey'}
          </p>
        </div>
        
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-fadeIn">
            <FiAlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-fadeIn">
            <FiCheckCircle className="h-5 w-5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {emailSent ? (
          <div className="text-center space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <FiMail className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Magic Link Sent!</h3>
              <p className="text-sm text-gray-600 mb-4">
                We've sent a secure sign-in link to:
              </p>
              <p className="font-medium text-blue-600 mb-4">{email}</p>
              <p className="text-xs text-gray-500">
                The link will expire in 15 minutes for security.
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleTryAgain}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Try Different Email
              </button>
              <p className="text-xs text-gray-500">
                Didn't receive the email? Check your spam folder or try again.
              </p>
            </div>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none group-focus-within:text-blue-600 transition-colors">
                  <FiMail className="h-5 w-5 text-neutral-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all outline-none bg-white/80 backdrop-blur-sm"
                />
                <label className={`absolute text-xs font-medium text-blue-600 ${email ? 'opacity-100 -top-2 left-2 px-1 bg-white' : 'opacity-0'} transition-all duration-200`}>Email</label>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Sending Magic Link...</span>
                  </>
                ) : (
                  <>
                    <span>Send Magic Link</span>
                    <FiArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-8 text-center">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  🔒 <strong>Secure Sign-In:</strong> We'll send you a secure link via email. No passwords needed!
                </p>
              </div>
            </div>
          </>
        )}
        
        <div className="mt-8 text-center">
          <p className="text-xs text-neutral-500">
            By signing in, you agree to our{' '}
                         <a href="/terms" className="text-blue-600 hover:underline underline-offset-4">Terms of Service</a>{' '}
             and{' '}
             <a href="/privacy" className="text-blue-600 hover:underline underline-offset-4">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}