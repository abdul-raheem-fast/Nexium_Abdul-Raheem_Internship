import React, { useState } from 'react';

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
    <div className="max-w-sm mx-auto mt-16 bg-white rounded-xl shadow p-8">
      <h1 className="text-2xl font-bold text-primary-blue mb-6">Register</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required className="w-full" />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full" />
        {error && <div className="text-error font-medium">{error}</div>}
        <button type="submit" className="mt-2" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
      </form>
      <div className="mt-4 text-sm text-center">
        Already have an account? <a href="/login" className="text-primary-blue hover:underline">Sign In</a>
      </div>
    </div>
  );
} 