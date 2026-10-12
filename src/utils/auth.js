const STORAGE_SESSION_KEY = 'medcheck_demo_session';
const STORAGE_TOKEN_KEY = 'medcheck_auth_token';
const LEGACY_USERS_KEY = 'medcheck_demo_users';
const API_BASE_URL = `${import.meta.env?.VITE_API_URL || ''}/api`;

const DEMO_USERS = [
  {
    name: 'Rahul Sharma',
    email: 'rahul.caregiver@medcheck.org',
    password: 'password123',
    role: 'Primary Caregiver',
    createdAt: '2026-01-15'
  },
  {
    name: 'Student Demo User',
    email: 'demo@medcheck.org',
    password: 'demo123',
    role: 'Student Researcher',
    createdAt: '2026-03-01'
  }
];

export class ApiUnavailableError extends Error {
  constructor(message = 'The MedCheck API is unavailable.') {
    super(message);
    this.name = 'ApiUnavailableError';
  }
}

async function apiRequest(path, { method = 'GET', body, authenticated = false } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (authenticated) {
    const token = getAuthToken();
    if (!token) throw new ApiUnavailableError('No server session is available.');
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      ...(body === undefined ? {} : { body: JSON.stringify(body) })
    });
  } catch {
    throw new ApiUnavailableError();
  }

  let result = {};
  try {
    result = await response.json();
  } catch {
    if (!response.ok) throw new Error(`API request failed with status ${response.status}.`);
  }

  if (response.status === 503) {
    throw new ApiUnavailableError(result.error || 'The database service is unavailable.');
  }
  if (!response.ok) {
    const error = new Error(result.error || `API request failed with status ${response.status}.`);
    error.status = response.status;
    throw error;
  }
  return result;
}

function saveSession(user, token = '') {
  localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(user));
  if (token) localStorage.setItem(STORAGE_TOKEN_KEY, token);
  else localStorage.removeItem(STORAGE_TOKEN_KEY);
}

export function getUsers() {
  return DEMO_USERS.map(({ password, ...user }) => user);
}

export function getAuthToken() {
  try {
    return localStorage.getItem(STORAGE_TOKEN_KEY);
  } catch (error) {
    console.error('Failed reading authentication token from localStorage', error);
    return null;
  }
}

export function getCurrentUser() {
  try {
    localStorage.removeItem(LEGACY_USERS_KEY);
    const raw = localStorage.getItem(STORAGE_SESSION_KEY);
    if (!raw) return null;
    const storedUser = JSON.parse(raw);
    const { password: storedPassword, ...user } = storedUser;
    if (storedPassword) localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(user));
    return user;
  } catch (error) {
    console.error('Failed reading session from localStorage', error);
    return null;
  }
}

export async function loginUser(email, password) {
  try {
    const result = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password }
    });
    saveSession(result.user, result.token);
    return { success: true, user: result.user };
  } catch (error) {
    if (!(error instanceof ApiUnavailableError)) {
      return { success: false, error: error.message };
    }

    const normalizedEmail = (email || '').trim().toLowerCase();
    const demoUser = DEMO_USERS.find(user => (
      user.email.toLowerCase() === normalizedEmail && user.password === password
    ));
    if (!demoUser) {
      return {
        success: false,
        error: 'Database unavailable. Offline access is limited to the built-in demo accounts.'
      };
    }

    const user = { ...demoUser };
    delete user.password;
    saveSession(user);
    return { success: true, user, offlineDemo: true };
  }
}

export async function registerUser(name, email, password) {
  try {
    const result = await apiRequest('/auth/register', {
      method: 'POST',
      body: { name, email, password }
    });
    saveSession(result.user, result.token);
    return { success: true, user: result.user };
  } catch (error) {
    return {
      success: false,
      error: error instanceof ApiUnavailableError
        ? 'Database unavailable. Account registration requires a connection; no password was saved locally.'
        : error.message
    };
  }
}

export async function getCurrentUserSession() {
  const result = await apiRequest('/auth/me', { authenticated: true });
  return result.user;
}

export async function getMedicalRecords() {
  const result = await apiRequest('/records', { authenticated: true });
  return result.records;
}

export async function saveMedicalRecord(record) {
  const result = await apiRequest('/records', {
    method: 'POST',
    authenticated: true,
    body: record
  });
  return result.record;
}

export async function deleteMedicalRecord(id) {
  await apiRequest(`/records/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    authenticated: true
  });
}

export function logoutUser() {
  try {
    localStorage.removeItem(STORAGE_SESSION_KEY);
    localStorage.removeItem(STORAGE_TOKEN_KEY);
  } catch (error) {
    console.error('Failed removing authentication session', error);
  }
  return { success: true };
}
