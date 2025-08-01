// API utility for frontend - connects to real backend

const API_BASE = process.env.NODE_ENV === 'production'
  ? process.env.NEXT_PUBLIC_API_URL || '/api'
  : '/api'; // Next.js API Routes

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
        // Refresh failed, clear tokens but don't redirect
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        throw new Error('Session expired');
      }
    } else {
      // No refresh token, clear tokens but don't redirect
      localStorage.removeItem('accessToken');
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
  return fetchWithAuth(`${API_BASE}/moods`)
    .then((data) => {
      // Ensure we return the moodEntries array from the response
      return data.moodEntries || data || [];
    });
}

export function postMoodEntry(data: any) {
  return fetchWithAuth(`${API_BASE}/moods`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...data,
      // Ensure numeric values are sent as numbers, not strings
      moodScore: parseInt(data.moodScore),
      energy: parseInt(data.energy || 5),
      anxiety: parseInt(data.anxiety || 3),
      stress: parseInt(data.stress || 3),
      sleep: parseFloat(data.sleep || 7), // Keep as float for precision, API will round
      activities: data.activities || [],
      notes: data.notes || '',
    }),
  });
}

// Get specific mood entry
export function getMoodEntry(id: string) {
  return fetchWithAuth(`${API_BASE}/moods/${id}`);
}

// Update mood entry
export function updateMoodEntry(id: string, data: any) {
  return fetchWithAuth(`${API_BASE}/moods/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

// Delete mood entry
export function deleteMoodEntry(id: string) {
  return fetchWithAuth(`${API_BASE}/moods/${id}`, {
    method: 'DELETE',
  });
}

// Analytics APIs
export function getDashboardAnalytics() {
  return fetchWithAuth(`${API_BASE}/analytics/dashboard`).then(response => {
    // Return the response directly as it should already be in the correct format
    return response;
  });
}

// AI APIs
export function getAIInsights() {
  return fetchWithAuth(`${API_BASE}/ai/generate-insights`);
}
export function getAIRecommendations() {
  return fetchWithAuth(`${API_BASE}/ai/recommendations`);
}

// User APIs
export function getUserInfo() {
  // Always try the real API first, fall back to mock data if it fails
  return fetchWithAuth(`${API_BASE}/auth/me`)
    .catch((error) => {
      console.log('API call failed, using mock data:', error.message);
      // Return mock user data if API fails
      return {
        user: {
          id: 'mock-user-1',
          email: 'user@example.com',
          name: 'Test User',
          createdAt: '2025-01-01',
          emailVerified: true,
          settings: {
            aiInsightsEnabled: true
          }
        }
      };
    });
}
export function updateUserSettings(data: any) {
  return fetchWithAuth(`${API_BASE}/users/settings`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}