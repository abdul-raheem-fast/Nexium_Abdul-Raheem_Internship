import React, { useState, useEffect } from 'react';
import { postMoodEntry, getMoodEntries } from '../lib/api';
import withAuth from '../lib/withAuth';

const initialForm = {
  moodScore: '',
  moodType: '',
  energy: '',
  anxiety: '',
  stress: '',
  sleep: '',
  activities: '',
  notes: '',
};

function MoodPage() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<any[]>([]);
  const [entriesLoading, setEntriesLoading] = useState(true);

  useEffect(() => {
    setEntriesLoading(true);
    getMoodEntries()
      .then((data) => setEntries(data.entries || []))
      .catch(() => setEntries([]))
      .finally(() => setEntriesLoading(false));
  }, [success]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await postMoodEntry({
        ...form,
        activities: form.activities.split(',').map((a) => a.trim()).filter(Boolean),
      });
      setSuccess('Mood entry submitted!');
      setForm(initialForm);
    } catch (err: any) {
      setError(err.message || 'Failed to submit mood entry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-primary-blue mb-2">Track Your Mood</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Mood Score (1-10)</label>
            <input type="number" name="moodScore" min="1" max="10" value={form.moodScore} onChange={handleChange} required className="w-full" />
          </div>
          <div>
            <label className="block font-medium mb-1">Mood Type</label>
            <select name="moodType" value={form.moodType} onChange={handleChange} required className="w-full">
              <option value="">Select</option>
              <option value="GREAT">Great</option>
              <option value="GOOD">Good</option>
              <option value="OKAY">Okay</option>
              <option value="BAD">Bad</option>
              <option value="TERRIBLE">Terrible</option>
              <option value="EXCITED">Excited</option>
              <option value="CALM">Calm</option>
              <option value="ANXIOUS">Anxious</option>
              <option value="SAD">Sad</option>
              <option value="ANGRY">Angry</option>
              <option value="CONFUSED">Confused</option>
              <option value="GRATEFUL">Grateful</option>
              <option value="HOPEFUL">Hopeful</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Energy (1-10)</label>
            <input type="number" name="energy" min="1" max="10" value={form.energy} onChange={handleChange} required className="w-full" />
          </div>
          <div>
            <label className="block font-medium mb-1">Anxiety (1-10)</label>
            <input type="number" name="anxiety" min="1" max="10" value={form.anxiety} onChange={handleChange} required className="w-full" />
          </div>
          <div>
            <label className="block font-medium mb-1">Stress (1-10)</label>
            <input type="number" name="stress" min="1" max="10" value={form.stress} onChange={handleChange} required className="w-full" />
          </div>
          <div>
            <label className="block font-medium mb-1">Sleep (hours)</label>
            <input type="number" name="sleep" min="0" max="24" value={form.sleep} onChange={handleChange} required className="w-full" />
          </div>
        </div>
        <div>
          <label className="block font-medium mb-1">Activities (comma separated)</label>
          <input type="text" name="activities" value={form.activities} onChange={handleChange} className="w-full" />
        </div>
        <div>
          <label className="block font-medium mb-1">Notes</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} className="w-full" />
        </div>
        {error && <div className="text-error font-medium">{error}</div>}
        {success && <div className="text-success font-medium">{success}</div>}
        <button type="submit" className="mt-2" disabled={loading}>{loading ? 'Submitting...' : 'Submit Mood'}</button>
      </form>
      <section className="bg-white rounded-xl shadow p-6 mt-4">
        <h2 className="text-xl font-semibold mb-4">Your Recent Mood Entries</h2>
        {entriesLoading ? (
          <div className="text-neutral-500">Loading...</div>
        ) : entries.length === 0 ? (
          <div className="text-neutral-500">No entries yet.</div>
        ) : (
          <ul className="divide-y divide-neutral-200">
            {entries.slice(0, 5).map((entry, i) => (
              <li key={entry.id || i} className="py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <span className="font-medium text-primary-blue">{entry.moodType} ({entry.moodScore})</span>
                <span className="text-neutral-500 text-sm">{new Date(entry.createdAt).toLocaleDateString()}</span>
                <span className="text-neutral-700 text-sm">{entry.notes}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default withAuth(MoodPage); 