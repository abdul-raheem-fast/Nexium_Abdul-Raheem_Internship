import React from 'react';

export default function HomePage() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary-blue">Empower Your Mental Wellness</h1>
        <p className="text-lg md:text-xl text-neutral-700 max-w-2xl mx-auto mb-6">
          An AI-powered platform for proactive mental health tracking, personalized insights, and actionable analytics. Take control of your wellbeing—at work and in life.
        </p>
        <a href="/dashboard" className="inline-block bg-primary-blue text-white px-8 py-3 rounded-lg font-semibold text-lg shadow hover:bg-primary-teal transition-colors">Get Started</a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 w-full max-w-4xl">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-3xl mb-2">🤖</span>
          <h2 className="text-xl font-semibold mb-2">AI-Powered Analytics</h2>
          <p className="text-neutral-700">Detect mood patterns, predict stress, and receive intelligent recommendations with advanced machine learning.</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-3xl mb-2">📈</span>
          <h2 className="text-xl font-semibold mb-2">Mood Tracking</h2>
          <p className="text-neutral-700">Track your mood, energy, sleep, and more. Visualize your journey and discover what drives your wellbeing.</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-3xl mb-2">✨</span>
          <h2 className="text-xl font-semibold mb-2">Personalized Insights</h2>
          <p className="text-neutral-700">Get actionable, personalized insights and tips to improve your mental health every day.</p>
        </div>
      </div>
    </section>
  );
} 