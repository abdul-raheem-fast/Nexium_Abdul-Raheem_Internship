import React, { useEffect, useState } from 'react';
import withAuth from '../lib/withAuth';
import { getUserInfo, updateUserSettings } from '../lib/api';

function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(false);

  useEffect(() => {
    setLoading(true);
    getUserInfo()
      .then((data) => {
        setUser(data.user);
        setAiEnabled(!!data.user?.settings?.aiInsightsEnabled);
        setError('');
      })
      .catch((err) => setError(err.message || 'Failed to load user info.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await updateUserSettings({ aiInsightsEnabled: aiEnabled });
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to update settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-primary-blue mb-2">Profile</h1>
      {loading ? (
        <div className="text-neutral-500">Loading...</div>
      ) : error ? (
        <div className="text-error font-medium">{error}</div>
      ) : (
        <>
          <section className="bg-white rounded-xl shadow p-6 mb-4">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="flex flex-col gap-2">
              <div><span className="font-medium">Name:</span> {user?.name}</div>
              <div><span className="font-medium">Email:</span> {user?.email}</div>
            </div>
          </section>
          <section className="bg-white rounded-xl shadow p-6 mb-4">
            <h2 className="text-xl font-semibold mb-4">AI Settings</h2>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={aiEnabled} onChange={e => setAiEnabled(e.target.checked)} />
              Enable AI Insights
            </label>
            <button onClick={handleSave} className="mt-4" disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</button>
          </section>
          <section className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
            <h2 className="text-xl font-semibold mb-4">Account Actions</h2>
            <button onClick={handleLogout} className="bg-error text-white font-semibold py-2 rounded">Logout</button>
          </section>
        </>
      )}
    </div>
  );
}

export default withAuth(ProfilePage); 