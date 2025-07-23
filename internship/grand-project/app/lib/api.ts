// API utility for frontend

const API_BASE = '/api'; // Adjust if needed for deployment

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'API error');
  }
  return res.json();
}

// Mood APIs
export function getMoodEntries() {
  return fetchWithAuth(`${API_BASE}/moods`);
}
export function postMoodEntry(data: any) {
  return fetchWithAuth(`${API_BASE}/moods`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Analytics APIs
export function getDashboardAnalytics() {
  return fetchWithAuth(`${API_BASE}/analytics/dashboard`);
}

// AI APIs
export function getAIInsights() {
  return fetchWithAuth(`${API_BASE}/ai/insights`);
}
export function getAIRecommendations() {
  return fetchWithAuth(`${API_BASE}/ai/recommendations`);
}

// User APIs
export function getUserInfo() {
  return fetchWithAuth(`${API_BASE}/auth/me`);
}
export function updateUserSettings(data: any) {
  return fetchWithAuth(`${API_BASE}/auth/settings`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
} 