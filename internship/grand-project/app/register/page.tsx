import React, { useState } from 'react';
import { FiUser, FiLock, FiMail, FiAlertCircle, FiUserPlus } from 'react-icons/fi';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Registration failed');
      const data = await res.json();
      localStorage.setItem('token', data.token);
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 md:p-10 transform transition-all duration-300 hover:shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-blue mb-2">Create Account</h1>
          <p className="text-neutral-500">Join us on your journey to better mental wellness</p>
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
              <FiUser className="h-5 w-5 text-neutral-400" />
            </div>
            <input 
              type="text" 
              placeholder="Full name" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
              className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue transition-all outline-none" 
            />
          </div>
          
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
            <p className="mt-1 text-xs text-neutral-500">Password must be at least 8 characters long</p>
          </div>
          
          <div className="flex items-center mt-2">
            <input 
              id="terms" 
              name="terms" 
              type="checkbox" 
              required
              className="h-4 w-4 text-primary-blue focus:ring-primary-blue border-neutral-300 rounded" 
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-neutral-700">
              I agree to the <a href="/terms" className="text-primary-blue hover:underline">Terms of Service</a> and <a href="/privacy" className="text-primary-blue hover:underline">Privacy Policy</a>
            </label>
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className="mt-4 w-full bg-primary-blue text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary-blue/90 transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <FiUserPlus className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-neutral-200 text-center">
          <p className="text-neutral-600">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-primary-blue hover:text-primary-teal transition-colors">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}