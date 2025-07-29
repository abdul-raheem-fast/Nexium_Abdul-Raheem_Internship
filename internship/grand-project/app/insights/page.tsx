"use client";

import React, { useEffect, useState } from 'react';
import { getAIInsights } from '../lib/api';
import withAuth from '../lib/withAuth';

function InsightsPage() {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    getAIInsights()
      .then((insightsData) => {
        setInsights(insightsData);
        setError('');
      })
      .catch((err) => {
        setError(err.message || 'Failed to load AI insights.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-primary-blue mb-2">AI Insights</h1>
      {loading ? (
        <div className="text-neutral-500">Loading...</div>
      ) : error ? (
        <div className="text-error font-medium">{error}</div>
      ) : (
        <>
          <section className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Personalized Recommendations</h2>
            {insights?.recommendations?.length ? (
              <ul className="list-disc pl-6 text-neutral-700">
                {insights.recommendations.map((rec: any, i: number) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            ) : (
              <div className="text-neutral-500">No recommendations available.</div>
            )}
          </section>
          <section className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Your Mental Health Insights</h2>
            {insights?.summary ? (
              <div className="text-neutral-700">{insights.summary}</div>
            ) : (
              <div className="text-neutral-500">No insights available.</div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default withAuth(InsightsPage); 