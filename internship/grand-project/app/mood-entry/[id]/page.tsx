"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import withAuth from '../../lib/withAuth';
import { FiArrowLeft, FiCalendar, FiActivity, FiFileText, FiEdit, FiTrash2 } from 'react-icons/fi';

function MoodEntryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [entry, setEntry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      loadMoodEntry(params.id as string);
    }
  }, [params.id]);

  const loadMoodEntry = async (id: string) => {
    try {
      setLoading(true);
      // For now, we'll simulate loading the entry
      // In a real app, you'd fetch from API
      const mockEntry = {
        id: id,
        moodScore: 8,
        moodType: 'GOOD',
        energy: 7,
        anxiety: 3,
        stress: 4,
        sleep: 8,
        activities: ['Exercise', 'Meditation'],
        notes: 'Great workout session, feeling energized!',
        tags: ['productive', 'active'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setEntry(mockEntry);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load mood entry');
    } finally {
      setLoading(false);
    }
  };

  const getMoodColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-blue-600';
    if (score >= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMoodDotColor = (score: number) => {
    if (score >= 8) return 'bg-green-500';
    if (score >= 6) return 'bg-blue-500';
    if (score >= 4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleEdit = () => {
    // Navigate to edit page (could be the same as mood-entry with pre-filled data)
    router.push(`/mood-entry?edit=${entry.id}`);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this mood entry?')) {
      // Delete logic here
      router.push('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Mood Entry Not Found</h2>
          <p className="text-gray-600 mb-4">The mood entry you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium transition-colors bg-white px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 shadow-sm"
            >
              <FiArrowLeft className="h-5 w-5" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Mood Entry Details</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FiEdit className="h-4 w-4" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FiTrash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>

        {/* Entry Details */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${getMoodDotColor(entry.moodScore)}`}></div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {entry.moodType} ({entry.moodScore}/10)
                </h2>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <FiCalendar className="h-4 w-4" />
                <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                <span>•</span>
                <span>{new Date(entry.createdAt).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Mood Score */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Mood Assessment</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{entry.moodScore}/10</div>
                  <div className="text-sm text-blue-600">Mood Score</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{entry.energy}/10</div>
                  <div className="text-sm text-green-600">Energy Level</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{entry.anxiety}/10</div>
                  <div className="text-sm text-yellow-600">Anxiety Level</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{entry.stress}/10</div>
                  <div className="text-sm text-red-600">Stress Level</div>
                </div>
              </div>
            </div>

            {/* Activities */}
            {entry.activities && entry.activities.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Activities</h3>
                <div className="flex items-center gap-2">
                  <FiActivity className="h-5 w-5 text-gray-400" />
                  <div className="flex flex-wrap gap-2">
                    {entry.activities.map((activity: string, index: number) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            {entry.notes && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Notes</h3>
                <div className="flex items-start gap-2">
                  <FiFileText className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="bg-gray-50 p-4 rounded-lg flex-1">
                    <p className="text-gray-700 leading-relaxed">{entry.notes}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tags */}
            {entry.tags && entry.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Sleep */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Sleep</h3>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{entry.sleep} hours</div>
                <div className="text-sm text-purple-600">Hours of sleep</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(MoodEntryDetailPage); 