// Demo authentication utility for MEDCHECK Student Project
// Stores registered users and session in browser localStorage

const STORAGE_USERS_KEY = 'medcheck_demo_users';
const STORAGE_SESSION_KEY = 'medcheck_demo_session';

// Pre-seeded demo user
const INITIAL_DEMO_USERS = [
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

export function getUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(INITIAL_DEMO_USERS));
      return INITIAL_DEMO_USERS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed reading users from localStorage', err);
    return INITIAL_DEMO_USERS;
  }
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(STORAGE_SESSION_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
    // Default to Rahul Sharma as pre-logged-in caregiver for seamless showcase
    const defaultUser = INITIAL_DEMO_USERS[0];
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(defaultUser));
    return defaultUser;
  } catch (err) {
    console.error('Failed reading session from localStorage', err);
    return INITIAL_DEMO_USERS[0];
  }
}

export function loginUser(email, password) {
  const users = getUsers();
  const normalizedEmail = (email || '').trim().toLowerCase();
  const found = users.find(u => u.email.toLowerCase() === normalizedEmail);

  if (!found) {
    return { success: false, error: 'No account found with this email address.' };
  }

  if (found.password !== password) {
    return { success: false, error: 'Incorrect password. Please try again.' };
  }

  const sessionUser = {
    name: found.name,
    email: found.email,
    role: found.role || 'Caregiver',
    createdAt: found.createdAt
  };

  try {
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sessionUser));
  } catch (e) {
    console.error('Error saving session:', e);
  }

  return { success: true, user: sessionUser };
}

export function registerUser(name, email, password) {
  const users = getUsers();
  const normalizedEmail = (email || '').trim().toLowerCase();

  if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
    return { success: false, error: 'An account with this email already exists. Please log in.' };
  }

  const newUser = {
    name: name.trim(),
    email: normalizedEmail,
    password: password,
    role: 'Caregiver / Patient',
    createdAt: new Date().toISOString().split('T')[0]
  };

  users.push(newUser);
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    const sessionUser = {
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt
    };
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sessionUser));
    return { success: true, user: sessionUser };
  } catch (err) {
    console.error('Failed writing user to localStorage', err);
    return { success: false, error: 'Failed to save account to browser storage.' };
  }
}

export function logoutUser() {
  try {
    localStorage.removeItem(STORAGE_SESSION_KEY);
  } catch (err) {
    console.error('Failed removing session', err);
  }
  return { success: true };
}
