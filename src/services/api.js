// Central API service for all HTTP calls with JWT Authorization

const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const response = await fetch(`${API_BASE_URL}${cleanEndpoint}`, config);
    
    // Check if token expired / unauthorized
    if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth:unauthorized'));
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (err) {
    throw err;
  }
}

export const api = {
  get: (endpoint, options = {}) => apiRequest(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) => apiRequest(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body, options = {}) => apiRequest(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint, options = {}) => apiRequest(endpoint, { ...options, method: 'DELETE' }),
};
