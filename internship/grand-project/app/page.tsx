import React from 'react';

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-[70vh] text-center gap-8 py-12">
        <div className="animate-fadeIn">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-primary-blue">
            Empower Your <span className="text-primary-teal">Mental Wellness</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-700 max-w-3xl mx-auto mb-8 leading-relaxed">
            An AI-powered platform for proactive mental health tracking, personalized insights, and actionable analytics. 
            Take control of your wellbeing—at work and in life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/dashboard" 
              className="inline-block bg-primary-blue text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:bg-primary-teal transition-all transform hover:scale-105"
            >
              Get Started
            </a>
            <a 
              href="/login" 
              className="inline-block border-2 border-primary-blue text-primary-blue px-8 py-3 rounded-lg font-semibold text-lg hover:bg-primary-blue hover:text-white transition-all"
            >
              Sign In
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-neutral-100 rounded-3xl">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary-blue">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center transform transition-all hover:scale-105 hover:shadow-xl">
              <div className="bg-primary-blue/10 p-4 rounded-full mb-4">
                <span className="text-4xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-primary-blue">AI-Powered Analytics</h3>
              <p className="text-neutral-700 text-center">Detect mood patterns, predict stress, and receive intelligent recommendations with advanced machine learning.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center transform transition-all hover:scale-105 hover:shadow-xl">
              <div className="bg-primary-teal/10 p-4 rounded-full mb-4">
                <span className="text-4xl">📈</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-primary-teal">Mood Tracking</h3>
              <p className="text-neutral-700 text-center">Track your mood, energy, sleep, and more. Visualize your journey and discover what drives your wellbeing.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center transform transition-all hover:scale-105 hover:shadow-xl">
              <div className="bg-secondary-purple/10 p-4 rounded-full mb-4">
                <span className="text-4xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-secondary-purple">Personalized Insights</h3>
              <p className="text-neutral-700 text-center">Get actionable, personalized insights and tips to improve your mental health every day.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary-blue">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary-blue text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">1</div>
              <h3 className="text-lg font-semibold mb-2">Track Daily</h3>
              <p className="text-neutral-700">Log your mood, activities, and thoughts in just 30 seconds a day.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary-teal text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">2</div>
              <h3 className="text-lg font-semibold mb-2">Analyze Patterns</h3>
              <p className="text-neutral-700">Our AI identifies trends and correlations in your mental wellbeing.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-secondary-purple text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">3</div>
              <h3 className="text-lg font-semibold mb-2">Get Insights</h3>
              <p className="text-neutral-700">Receive personalized recommendations based on your unique patterns.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-secondary-orange text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">4</div>
              <h3 className="text-lg font-semibold mb-2">Improve Wellbeing</h3>
              <p className="text-neutral-700">Take action with practical steps to enhance your mental health.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 bg-neutral-100 rounded-3xl">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary-blue">What Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-blue/20 rounded-full flex items-center justify-center text-primary-blue font-bold">S</div>
                <div className="ml-4">
                  <h3 className="font-semibold">Sarah K.</h3>
                  <p className="text-sm text-neutral-500">Software Developer</p>
                </div>
              </div>
              <p className="text-neutral-700 italic">"This app has helped me identify my stress triggers and develop better coping strategies. The AI insights are surprisingly accurate!"</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-teal/20 rounded-full flex items-center justify-center text-primary-teal font-bold">M</div>
                <div className="ml-4">
                  <h3 className="font-semibold">Michael T.</h3>
                  <p className="text-sm text-neutral-500">Team Lead</p>
                </div>
              </div>
              <p className="text-neutral-700 italic">"As a manager, I've seen my team's wellbeing improve significantly since we started using this platform. The analytics provide valuable insights."</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-secondary-purple/20 rounded-full flex items-center justify-center text-secondary-purple font-bold">L</div>
                <div className="ml-4">
                  <h3 className="font-semibold">Dr. Lisa R.</h3>
                  <p className="text-sm text-neutral-500">Wellness Consultant</p>
                </div>
              </div>
              <p className="text-neutral-700 italic">"The data-driven approach to mental wellness is exactly what my clients need. The platform provides actionable insights that make a real difference."</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-blue text-white rounded-3xl">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Mental Wellness?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of users who are taking control of their mental health with our AI-powered platform.</p>
          <a 
            href="/register" 
            className="inline-block bg-white text-primary-blue px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:bg-neutral-100 transition-all transform hover:scale-105"
          >
            Create Free Account
          </a>
        </div>
      </section>
    </div>
  );
}