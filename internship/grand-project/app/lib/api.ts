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
  return fetchWithAuth(`${API_BASE}/analytics`);
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
  return fetchWithAuth(`${API_BASE}/users/settings`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}