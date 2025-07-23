import React, { useEffect, useState } from 'react';
import { getDashboardAnalytics, getAIInsights } from '../lib/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import withAuth from '../lib/withAuth';

function DashboardPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [aiInsights, setAIInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getDashboardAnalytics(),
      getAIInsights(),
    ])
      .then(([analyticsData, aiData]) => {
        setAnalytics(analyticsData);
        setAIInsights(aiData);
        setError('');
      })
      .catch((err) => {
        setError(err.message || 'Failed to load dashboard data.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-primary-blue mb-2">Dashboard</h1>
      {loading ? (
        <div className="text-neutral-500">Loading...</div>
      ) : error ? (
        <div className="text-error font-medium">{error}</div>
      ) : (
        <>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Mood Trends</h2>
              {analytics?.moodHistory?.length ? (
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.moodHistory} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis domain={[1, 10]} tickCount={10} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="moodScore" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : analytics?.moodStats ? (
                <div className="flex flex-col gap-2">
                  <div>Average Mood: <span className="font-semibold">{analytics.moodStats.avgMood}</span></div>
                  <div>Best Day: <span className="font-semibold">{analytics.moodStats.bestDay}</span></div>
                  <div>Worst Day: <span className="font-semibold">{analytics.moodStats.worstDay}</span></div>
                  <div>Total Entries: <span className="font-semibold">{analytics.moodStats.totalEntries}</span></div>
                </div>
              ) : (
                <div className="text-neutral-500">No analytics data.</div>
              )}
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4">AI Insights</h2>
              {aiInsights?.summary ? (
                <div className="text-neutral-700">{aiInsights.summary}</div>
              ) : (
                <div className="text-neutral-500">No AI insights available.</div>
              )}
            </div>
          </section>
          <section className="bg-white rounded-xl shadow p-6 mt-4">
            <h2 className="text-xl font-semibold mb-4">Recent Mood Entries</h2>
            {analytics?.recentEntries?.length ? (
              <ul className="divide-y divide-neutral-200">
                {analytics.recentEntries.slice(0, 5).map((entry: any, i: number) => (
                  <li key={entry.id || i} className="py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <span className="font-medium text-primary-blue">{entry.moodType} ({entry.moodScore})</span>
                    <span className="text-neutral-500 text-sm">{new Date(entry.createdAt).toLocaleDateString()}</span>
                    <span className="text-neutral-700 text-sm">{entry.notes}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-neutral-500">No recent entries.</div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default withAuth(DashboardPage); 