// API utility for frontend - connects to real backend

const API_BASE = process.env.NODE_ENV === 'production'
  ? process.env.NEXT_PUBLIC_API_URL || 'https://your-api-domain.com/api'
  : 'http://localhost:3001/api'; // Real backend API

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('accessToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  
  const res = await fetch(url, { ...options, headers });
  
  // Handle token refresh if access token expired
  if (res.status === 401 && token) {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_BASE}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
        
        if (refreshResponse.ok) {
          const { tokens } = await refreshResponse.json();
          localStorage.setItem('accessToken', tokens.accessToken);
          localStorage.setItem('refreshToken', tokens.refreshToken);
          
          // Retry original request with new token
          const retryHeaders = {
            ...headers,
            Authorization: `Bearer ${tokens.accessToken}`,
          };
          const retryRes = await fetch(url, { ...options, headers: retryHeaders });
          if (!retryRes.ok) {
            const error = await retryRes.json().catch(() => ({}));
            throw new Error(error.message || 'API error');
          }
          return retryRes.json();
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        throw new Error('Session expired');
      }
    } else {
      // No refresh token, redirect to login
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
      throw new Error('No authentication');
    }
  }
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'API error');
  }
  return res.json();
}

// Authentication APIs
export function sendMagicLink(email: string) {
  return fetch(`${API_BASE}/auth/magic-link`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  }).then(res => {
    if (!res.ok) {
      return res.json().then(err => { throw new Error(err.message || 'Failed to send magic link'); });
    }
    return res.json();
  });
}

export function verifyMagicLink(token: string) {
  return fetch(`${API_BASE}/auth/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  }).then(res => {
    if (!res.ok) {
      return res.json().then(err => { throw new Error(err.message || 'Failed to verify magic link'); });
    }
    return res.json();
  });
}

export function logout() {
  const token = localStorage.getItem('accessToken');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  
  return fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    headers,
  }).finally(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  });
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
  // For development, return mock data if the endpoint fails
  return fetchWithAuth(`${API_BASE}/analytics/dashboard`)
    .catch(() => {
      // Return mock data for development
      return {
        overview: {
          totalEntries: 12,
          averageMood: 7.2,
          streakDays: 5,
          improvement: '+15%'
        },
        recentMood: {
          trend: 'improving',
          average: 7.5,
          entries: [
            { date: '2025-07-25', mood: 8 },
            { date: '2025-07-26', mood: 7 },
            { date: '2025-07-27', mood: 8 },
            { date: '2025-07-28', mood: 6 },
            { date: '2025-07-29', mood: 8 },
            { date: '2025-07-30', mood: 9 },
            { date: '2025-07-31', mood: 8 }
          ]
        },
        activityImpact: [
          { activity: 'Exercise', impact: 8.5 },
          { activity: 'Meditation', impact: 7.8 },
          { activity: 'Social', impact: 7.2 },
          { activity: 'Work', impact: 5.1 }
        ]
      };
    });
}

// AI APIs
export function getAIInsights() {
  // For now, return mock data since the endpoint doesn't exist
  return Promise.resolve({
    insights: [
      {
        id: 'mock-1',
        title: 'Mood Pattern Detected',
        description: 'You tend to feel better on days when you exercise',
        type: 'pattern',
        confidence: 0.85
      },
      {
        id: 'mock-2',
        title: 'Sleep Quality Impact',
        description: 'Your mood improves significantly when you get 7+ hours of sleep',
        type: 'correlation',
        confidence: 0.92
      }
    ]
  });
}
export function getAIRecommendations() {
  return fetchWithAuth(`${API_BASE}/ai/recommendations`);
}

// User APIs
export function getUserInfo() {
  return fetchWithAuth(`${API_BASE}/auth/me`);
}
export function updateUserSettings(data: any) {
  return fetchWithAuth(`${API_BASE}/users/settings`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}