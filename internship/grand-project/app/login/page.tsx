import React, { useState } from 'react';
import { FiLock, FiMail, FiAlertCircle, FiArrowRight } from 'react-icons/fi';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Login failed');
      const data = await res.json();
      localStorage.setItem('token', data.token);
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 md:p-10 transform transition-all duration-300 hover:shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-blue mb-2">Welcome Back</h1>
          <p className="text-neutral-500">Sign in to continue your wellness journey</p>
        </div>
        
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-fadeIn">
            <FiAlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="h-5 w-5 text-neutral-400" />
            </div>
            <input 
              type="email" 
              placeholder="Email address" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue transition-all outline-none" 
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="h-5 w-5 text-neutral-400" />
            </div>
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue transition-all outline-none" 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input 
                id="remember-me" 
                name="remember-me" 
                type="checkbox" 
                className="h-4 w-4 text-primary-blue focus:ring-primary-blue border-neutral-300 rounded" 
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-700">
                Remember me
              </label>
            </div>
            <a href="/forgot-password" className="text-sm font-medium text-primary-blue hover:text-primary-teal transition-colors">
              Forgot password?
            </a>
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className="mt-2 w-full bg-primary-blue text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary-blue/90 transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <FiArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-neutral-200 text-center">
          <p className="text-neutral-600">
            Don&apos;t have an account?{' '}
            <a href="/register" className="font-medium text-primary-blue hover:text-primary-teal transition-colors">
              Create account
            </a>
          </p>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-neutral-500">
            By signing in, you agree to our{' '}
            <a href="/terms" className="text-primary-blue hover:underline">Terms of Service</a>{' '}
            and{' '}
            <a href="/privacy" className="text-primary-blue hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}