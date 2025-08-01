"use client";

import React, { useEffect, useState } from 'react';
import { getMoodEntries } from '../lib/api';
import withAuth from '../lib/withAuth';
import { FiArrowLeft, FiCalendar, FiActivity, FiFileText } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

function MoodHistoryPage() {
  const router = useRouter();
  const [moodEntries, setMoodEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMoodEntries();
  }, []);

  // Refresh data when component becomes visible (for when returning from mood entry)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadMoodEntries();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const loadMoodEntries = async () => {
    try {
      setLoading(true);
      const data = await getMoodEntries();
      // Ensure data is always an array
      setMoodEntries(Array.isArray(data) ? data : []);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load mood entries');
      setMoodEntries([]); // Set empty array on error
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

  const handleViewEntryDetails = (entryId: string) => {
    router.push(`/mood-entry/${entryId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
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
            <h1 className="text-3xl font-bold text-gray-900">Mood History</h1>
          </div>
          <button
            onClick={loadMoodEntries}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            {error}
          </div>
        ) : moodEntries.length === 0 ? (
          <div className="text-center py-12">
            <FiCalendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No mood entries yet</h3>
            <p className="text-gray-500 mb-6">Start tracking your mood to see your history here.</p>
            <button
              onClick={() => router.push('/mood-entry')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Add Your First Entry
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                All Mood Entries ({moodEntries.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mood
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activities
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {moodEntries.map((entry, index) => (
                    <tr key={entry.id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="h-4 w-4 text-gray-400" />
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(entry.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getMoodDotColor(entry.moodScore)}`}></div>
                          <span className={`font-medium ${getMoodColor(entry.moodScore)}`}>
                            {entry.moodType} ({entry.moodScore}/10)
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.activities && entry.activities.length > 0 ? (
                          <div className="flex items-center gap-2">
                            <FiActivity className="h-4 w-4 text-gray-400" />
                            <span>{entry.activities.join(', ')}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">None recorded</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                        {entry.notes ? (
                          <div className="flex items-start gap-2">
                            <FiFileText className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">{entry.notes}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">No notes</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleViewEntryDetails(entry.id || `entry-${index}`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(MoodHistoryPage);
