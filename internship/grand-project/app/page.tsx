'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from './lib/AuthContext';

export default function HomePage() {
  // Remove the redirect logic that's causing the loop
  // Users can manually navigate to dashboard if they want
  return (
    <div className="flex flex-col gap-8 sm:gap-12 lg:gap-16">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-[60vh] sm:min-h-[70vh] text-center gap-6 sm:gap-8 py-8 sm:py-12 px-4">
        <div className="animate-fadeIn max-w-5xl mx-auto">
                     <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-blue-600 leading-tight">
             Empower Your <span className="text-primary-teal">Mental Wellness</span>
           </h1>
          <p className="text-base sm:text-lg md:text-xl text-neutral-700 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4">
            An AI-powered platform for proactive mental health tracking, personalized insights, and actionable analytics.
            Take control of your wellbeing—at work and in life.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-md sm:max-w-none mx-auto">
                         <a
               href="/login"
               className="w-full sm:w-auto inline-block bg-blue-600 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold text-base sm:text-lg shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-200 ease-in-out hover:translate-y-[-1px] text-center"
             >
               Get Started
             </a>
             <a
               href="/login"
               className="w-full sm:w-auto inline-block border-2 border-blue-600 text-blue-600 px-6 sm:px-8 py-3 rounded-lg font-semibold text-base sm:text-lg hover:bg-blue-600 hover:text-white hover:shadow-lg transition-all duration-200 ease-in-out hover:translate-y-[-1px] text-center"
             >
               Sign In
             </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 sm:py-12 bg-neutral-100 rounded-2xl sm:rounded-3xl mx-2 sm:mx-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-blue-600">Key Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 flex flex-col items-center transition-all duration-300 ease-in-out hover:shadow-xl hover:translate-y-[-2px]">
              <div className="bg-blue-100 p-3 sm:p-4 rounded-full mb-3 sm:mb-4">
                <span className="text-3xl sm:text-4xl">🤖</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-blue-600 text-center">AI-Powered Analytics</h3>
              <p className="text-sm sm:text-base text-neutral-700 text-center leading-relaxed">Detect mood patterns, predict stress, and receive intelligent recommendations with advanced machine learning.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 flex flex-col items-center transition-all duration-300 ease-in-out hover:shadow-xl hover:translate-y-[-2px]">
              <div className="bg-green-100 p-3 sm:p-4 rounded-full mb-3 sm:mb-4">
                <span className="text-3xl sm:text-4xl">📈</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-green-600 text-center">Mood Tracking</h3>
              <p className="text-sm sm:text-base text-neutral-700 text-center leading-relaxed">Track your mood, energy, sleep, and more. Visualize your journey and discover what drives your wellbeing.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 flex flex-col items-center transition-all duration-300 ease-in-out hover:shadow-xl hover:translate-y-[-2px] sm:col-span-2 lg:col-span-1">
              <div className="bg-purple-100 p-3 sm:p-4 rounded-full mb-3 sm:mb-4">
                <span className="text-3xl sm:text-4xl">✨</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-purple-600 text-center">Personalized Insights</h3>
              <p className="text-sm sm:text-base text-neutral-700 text-center leading-relaxed">Get actionable, personalized insights and tips to improve your mental health every day.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-8 sm:py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-blue-600">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 w-full max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center p-4 sm:p-0">
              <div className="bg-blue-600 text-white w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold mb-3 sm:mb-4 shadow-lg">1</div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-neutral-900">Track Daily</h3>
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">Log your mood, activities, and thoughts in just 30 seconds a day.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 sm:p-0">
              <div className="bg-green-600 text-white w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold mb-3 sm:mb-4 shadow-lg">2</div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-neutral-900">Analyze Patterns</h3>
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">Our AI identifies trends and correlations in your mental wellbeing.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 sm:p-0">
              <div className="bg-purple-600 text-white w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold mb-3 sm:mb-4 shadow-lg">3</div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-neutral-900">Get Insights</h3>
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">Receive personalized recommendations based on your unique patterns.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 sm:p-0">
              <div className="bg-orange-600 text-white w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold mb-3 sm:mb-4 shadow-lg">4</div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-neutral-900">Improve Wellbeing</h3>
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">Take action with practical steps to enhance your mental health.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-8 sm:py-12 bg-neutral-100 rounded-2xl sm:rounded-3xl mx-2 sm:mx-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-blue-600">What Users Say</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 transition-all duration-300 ease-in-out hover:shadow-xl hover:translate-y-[-2px]">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm sm:text-base">S</div>
                <div className="ml-3 sm:ml-4">
                  <h3 className="font-semibold text-sm sm:text-base">Sarah K.</h3>
                  <p className="text-xs sm:text-sm text-neutral-500">Software Developer</p>
                </div>
              </div>
              <p className="text-sm sm:text-base text-neutral-700 italic leading-relaxed">"This app has helped me identify my stress triggers and develop better coping strategies. The AI insights are surprisingly accurate!"</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 transition-all duration-300 ease-in-out hover:shadow-xl hover:translate-y-[-2px]">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm sm:text-base">M</div>
                <div className="ml-3 sm:ml-4">
                  <h3 className="font-semibold text-sm sm:text-base">Michael T.</h3>
                  <p className="text-xs sm:text-sm text-neutral-500">Team Lead</p>
                </div>
              </div>
              <p className="text-sm sm:text-base text-neutral-700 italic leading-relaxed">"As a manager, I've seen my team's wellbeing improve significantly since we started using this platform. The analytics provide valuable insights."</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 transition-all duration-300 ease-in-out hover:shadow-xl hover:translate-y-[-2px] sm:col-span-2 lg:col-span-1">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm sm:text-base">L</div>
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
             <section className="py-12 sm:py-16 bg-blue-600 text-white rounded-2xl sm:rounded-3xl mx-2 sm:mx-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 leading-tight">Ready to Transform Your Mental Wellness?</h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90 leading-relaxed max-w-2xl mx-auto">Join thousands of users who are taking control of their mental health with our AI-powered platform.</p>
                                             <a
               href="/login"
               className="inline-block bg-white text-blue-600 px-6 sm:px-8 py-3 rounded-lg font-semibold text-base sm:text-lg shadow-lg hover:bg-gray-50 hover:shadow-xl transition-all duration-200 ease-in-out hover:translate-y-[-1px] w-full sm:w-auto max-w-xs sm:max-w-none mx-auto"
             >
               Get Started Free
             </a>
        </div>
      </section>
    </div>
  );
}
