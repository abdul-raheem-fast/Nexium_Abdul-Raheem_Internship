import React from 'react';

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8 sm:gap-12 lg:gap-16">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-[60vh] sm:min-h-[70vh] text-center gap-6 sm:gap-8 py-8 sm:py-12 px-4">
        <div className="animate-fadeIn max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-primary-blue leading-tight">
            Empower Your <span className="text-primary-teal">Mental Wellness</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-neutral-700 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4">
            An AI-powered platform for proactive mental health tracking, personalized insights, and actionable analytics.
            Take control of your wellbeing—at work and in life.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-md sm:max-w-none mx-auto">
            <a
              href="/dashboard"
              className="w-full sm:w-auto inline-block bg-primary-blue text-white px-6 sm:px-8 py-3 rounded-lg font-semibold text-base sm:text-lg shadow-lg hover:bg-primary-teal transition-all transform hover:scale-105 text-center"
            >
              Get Started
            </a>
            <a
              href="/login"
              className="w-full sm:w-auto inline-block border-2 border-primary-blue text-primary-blue px-6 sm:px-8 py-3 rounded-lg font-semibold text-base sm:text-lg hover:bg-primary-blue hover:text-white transition-all text-center"
            >
              Sign In
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 sm:py-12 bg-neutral-100 rounded-2xl sm:rounded-3xl mx-2 sm:mx-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-primary-blue">Key Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 flex flex-col items-center transform transition-all hover:scale-105 hover:shadow-xl">
              <div className="bg-primary-blue/10 p-3 sm:p-4 rounded-full mb-3 sm:mb-4">
                <span className="text-3xl sm:text-4xl">🤖</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-primary-blue text-center">AI-Powered Analytics</h3>
              <p className="text-sm sm:text-base text-neutral-700 text-center leading-relaxed">Detect mood patterns, predict stress, and receive intelligent recommendations with advanced machine learning.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 flex flex-col items-center transform transition-all hover:scale-105 hover:shadow-xl">
              <div className="bg-primary-teal/10 p-3 sm:p-4 rounded-full mb-3 sm:mb-4">
                <span className="text-3xl sm:text-4xl">📈</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-primary-teal text-center">Mood Tracking</h3>
              <p className="text-sm sm:text-base text-neutral-700 text-center leading-relaxed">Track your mood, energy, sleep, and more. Visualize your journey and discover what drives your wellbeing.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 flex flex-col items-center transform transition-all hover:scale-105 hover:shadow-xl sm:col-span-2 lg:col-span-1">
              <div className="bg-secondary-purple/10 p-3 sm:p-4 rounded-full mb-3 sm:mb-4">
                <span className="text-3xl sm:text-4xl">✨</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-secondary-purple text-center">Personalized Insights</h3>
              <p className="text-sm sm:text-base text-neutral-700 text-center leading-relaxed">Get actionable, personalized insights and tips to improve your mental health every day.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-8 sm:py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-primary-blue">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 w-full max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center p-4 sm:p-0">
              <div className="bg-primary-blue text-white w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold mb-3 sm:mb-4 shadow-lg">1</div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-neutral-900">Track Daily</h3>
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">Log your mood, activities, and thoughts in just 30 seconds a day.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 sm:p-0">
              <div className="bg-primary-teal text-white w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold mb-3 sm:mb-4 shadow-lg">2</div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-neutral-900">Analyze Patterns</h3>
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">Our AI identifies trends and correlations in your mental wellbeing.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 sm:p-0">
              <div className="bg-secondary-purple text-white w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold mb-3 sm:mb-4 shadow-lg">3</div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-neutral-900">Get Insights</h3>
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">Receive personalized recommendations based on your unique patterns.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 sm:p-0">
              <div className="bg-secondary-orange text-white w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold mb-3 sm:mb-4 shadow-lg">4</div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-neutral-900">Improve Wellbeing</h3>
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">Take action with practical steps to enhance your mental health.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-8 sm:py-12 bg-neutral-100 rounded-2xl sm:rounded-3xl mx-2 sm:mx-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-primary-blue">What Users Say</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 transform transition-all hover:shadow-xl">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-blue/20 rounded-full flex items-center justify-center text-primary-blue font-bold text-sm sm:text-base">S</div>
                <div className="ml-3 sm:ml-4">
                  <h3 className="font-semibold text-sm sm:text-base">Sarah K.</h3>
                  <p className="text-xs sm:text-sm text-neutral-500">Software Developer</p>
                </div>
              </div>
              <p className="text-sm sm:text-base text-neutral-700 italic leading-relaxed">"This app has helped me identify my stress triggers and develop better coping strategies. The AI insights are surprisingly accurate!"</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 transform transition-all hover:shadow-xl">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-teal/20 rounded-full flex items-center justify-center text-primary-teal font-bold text-sm sm:text-base">M</div>
                <div className="ml-3 sm:ml-4">
                  <h3 className="font-semibold text-sm sm:text-base">Michael T.</h3>
                  <p className="text-xs sm:text-sm text-neutral-500">Team Lead</p>
                </div>
              </div>
              <p className="text-sm sm:text-base text-neutral-700 italic leading-relaxed">"As a manager, I've seen my team's wellbeing improve significantly since we started using this platform. The analytics provide valuable insights."</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 transform transition-all hover:shadow-xl sm:col-span-2 lg:col-span-1">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary-purple/20 rounded-full flex items-center justify-center text-secondary-purple font-bold text-sm sm:text-base">L</div>
                <div className="ml-3 sm:ml-4">
                  <h3 className="font-semibold text-sm sm:text-base">Dr. Lisa R.</h3>
                  <p className="text-xs sm:text-sm text-neutral-500">Wellness Consultant</p>
                </div>
              </div>
              <p className="text-sm sm:text-base text-neutral-700 italic leading-relaxed">"The data-driven approach to mental wellness is exactly what my clients need. The platform provides actionable insights that make a real difference."</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-primary-blue text-white rounded-2xl sm:rounded-3xl mx-2 sm:mx-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 leading-tight">Ready to Transform Your Mental Wellness?</h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90 leading-relaxed max-w-2xl mx-auto">Join thousands of users who are taking control of their mental health with our AI-powered platform.</p>
          <a
            href="/register"
            className="inline-block bg-white text-primary-blue px-6 sm:px-8 py-3 rounded-lg font-semibold text-base sm:text-lg shadow-lg hover:bg-neutral-100 transition-all transform hover:scale-105 w-full sm:w-auto max-w-xs sm:max-w-none mx-auto"
          >
            Create Free Account
          </a>
        </div>
      </section>
    </div>
  );
}