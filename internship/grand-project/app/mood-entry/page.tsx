'use client';

import React, { useState } from 'react';
import { FiSave, FiX, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import withAuth from '../lib/withAuth';
import { postMoodEntry } from '../lib/api';
import { useRouter } from 'next/navigation';

const moodOptions = [
  { value: 10, label: 'Excellent', emoji: '😁', color: 'bg-green-500' },
  { value: 8, label: 'Good', emoji: '🙂', color: 'bg-green-400' },
  { value: 6, label: 'Okay', emoji: '😐', color: 'bg-yellow-400' },
  { value: 4, label: 'Not Great', emoji: '🙁', color: 'bg-orange-400' },
  { value: 2, label: 'Poor', emoji: '😞', color: 'bg-red-400' },
];

const activityOptions = [
  { id: 'exercise', label: 'Exercise', icon: '🏃‍♂️' },
  { id: 'meditation', label: 'Meditation', icon: '🧘‍♀️' },
  { id: 'reading', label: 'Reading', icon: '📚' },
  { id: 'social', label: 'Social Activity', icon: '👥' },
  { id: 'work', label: 'Work', icon: '💼' },
  { id: 'hobby', label: 'Hobby', icon: '🎨' },
  { id: 'nature', label: 'Nature', icon: '🌳' },
  { id: 'rest', label: 'Rest', icon: '😴' },
];

function MoodEntryPage() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [sleepHours, setSleepHours] = useState<number>(7);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleActivityToggle = (activityId: string) => {
    setSelectedActivities(prev => 
      prev.includes(activityId) 
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  const getMoodType = (score: number): string => {
    if (score >= 9) return 'GREAT'; // Changed from 'EXCELLENT' to 'GREAT'
    if (score >= 7) return 'GOOD';
    if (score >= 5) return 'OKAY';
    if (score >= 3) return 'BAD';
    return 'TERRIBLE';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedMood === null) {
      setError('Please select your mood');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await postMoodEntry({
        moodScore: selectedMood,
        moodType: getMoodType(selectedMood),
        activities: selectedActivities,
        notes,
        sleep: sleepHours,
        energy: 5, // Default values for required fields
        anxiety: 3,
        stress: 3,
      });
      
      setSuccess(true);
      
      // Redirect to dashboard after 2 seconds to show updated entries
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setSelectedMood(null);
        setSelectedActivities([]);
        setNotes('');
        setSleepHours(7);
        setSuccess(false);
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || 'Failed to save mood entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <h1 className="text-3xl font-bold text-primary-blue mb-2">How are you feeling today?</h1>
        <p className="text-neutral-500 mb-8">Track your mood and activities to gain insights into your mental wellbeing</p>
        
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <FiAlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <FiCheckCircle className="h-5 w-5 flex-shrink-0" />
            <span>Your mood entry has been saved successfully!</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Mood Selection */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-primary-blue">Select your mood</h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {moodOptions.map(mood => (
                <button
                  key={mood.value}
                  type="button"
                  onClick={() => setSelectedMood(mood.value)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${selectedMood === mood.value ? `border-${mood.color.replace('bg-', '')} ring-2 ring-${mood.color.replace('bg-', '')} ring-opacity-50` : 'border-neutral-200 hover:border-neutral-300'}`}
                >
                  <span className="text-3xl mb-2">{mood.emoji}</span>
                  <span className="font-medium">{mood.label}</span>
                  <span className="text-sm text-neutral-500">{mood.value}/10</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Activities */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-primary-blue">What have you done today?</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {activityOptions.map(activity => (
                <button
                  key={activity.id}
                  type="button"
                  onClick={() => handleActivityToggle(activity.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${selectedActivities.includes(activity.id) ? 'border-primary-teal bg-primary-teal/5' : 'border-neutral-200 hover:border-neutral-300'}`}
                >
                  <span className="text-2xl">{activity.icon}</span>
                  <span className="font-medium">{activity.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Sleep Hours */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-primary-blue">Hours of sleep last night</h2>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-blue"
              />
              <span className="text-xl font-semibold min-w-[3rem] text-center">{sleepHours}</span>
            </div>
            <div className="flex justify-between text-sm text-neutral-500 mt-1">
              <span>0h</span>
              <span>6h</span>
              <span>12h</span>
            </div>
          </div>
          
          {/* Notes */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-primary-blue">Additional notes</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How was your day? Any specific thoughts or feelings you'd like to record?"
              rows={4}
              className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue transition-all outline-none"
            />
          </div>
          
          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || selectedMood === null}
              className="flex-1 bg-primary-blue text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary-blue/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FiSave className="h-5 w-5" />
                  <span>Save Entry</span>
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => {
                setSelectedMood(null);
                setSelectedActivities([]);
                setNotes('');
                setSleepHours(7);
              }}
              className="px-4 py-3 border-2 border-neutral-300 rounded-lg font-medium text-neutral-700 hover:bg-neutral-100 transition-all"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withAuth(MoodEntryPage);