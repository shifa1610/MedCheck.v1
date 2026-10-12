// Test suite for Sidebar 11 Feature Modules and Demo Authentication
import assert from 'assert';

console.log('======================================================');
console.log('  MEDCHECK SIDEBAR & AUTHENTICATION TEST SUITE');
console.log('======================================================\n');

let passCount = 0;
function pass(desc) {
  passCount++;
  console.log(`  ✓ PASS: ${desc}`);
}

// 1. Mock localStorage for Node test environment
const mockStorage = {};
global.localStorage = {
  getItem: (key) => mockStorage[key] || null,
  setItem: (key, val) => { mockStorage[key] = String(val); },
  removeItem: (key) => { delete mockStorage[key]; },
  clear: () => {
    for (const k in mockStorage) delete mockStorage[k];
  }
};

// Import modules to test
const { SIDEBAR_MODULES } = await import('../src/data/sidebarModules.js');
const {
  getAuthToken,
  getCurrentUser,
  getUsers,
  loginUser,
  registerUser,
  logoutUser
} = await import('../src/utils/auth.js');

console.log('[TEST GROUP 1] Sidebar 11 Feature Cards Verification:');
assert.strictEqual(SIDEBAR_MODULES.length, 11, 'Sidebar must contain exactly 11 feature cards');
pass('Sidebar contains exactly 11 feature cards');

const EXPECTED_IDS = [
  'dashboard',
  'compare',
  'verify',
  'timeline',
  'trends',
  'medications',
  'converter',
  'visitprep',
  'accuracy',
  'slides',
  'abha'
];

EXPECTED_IDS.forEach((id, index) => {
  const mod = SIDEBAR_MODULES.find(m => m.id === id);
  assert.ok(mod, `Module ${id} must exist in SIDEBAR_MODULES`);
  assert.ok(mod.title && mod.title.length > 0, `Module ${id} must have a non-empty title`);
  assert.ok(mod.description && mod.description.length > 0, `Module ${id} must have a description`);
  assert.ok(mod.icon, `Module ${id} must have an icon`);
  pass(`Module #${index + 1} [${id}] - "${mod.title}" verified with icon & description`);
});

console.log('\n[TEST GROUP 2] Demo Authentication Flow:');

// Test 2.1: Authentication uses the backend API and stores a JWT session
const initialUsers = getUsers();
assert.ok(initialUsers.length >= 2, 'Should have initial demo users');
pass('Default initial demo users seeded');

const serverUsers = new Map();
const originalFetch = global.fetch;
global.fetch = async (url, options = {}) => {
  const body = options.body ? JSON.parse(options.body) : {};
  if (String(url).endsWith('/auth/login')) {
    const seeded = [
      { name: 'Rahul Sharma', email: 'rahul.caregiver@medcheck.org', password: 'password123', role: 'Primary Caregiver' },
      { name: 'Student Demo User', email: 'demo@medcheck.org', password: 'demo123', role: 'Student Researcher' }
    ];
    const user = [...seeded, ...serverUsers.values()].find(entry => (
      entry.email.toLowerCase() === String(body.email).toLowerCase() && entry.password === body.password
    ));
    return user
      ? { ok: true, status: 200, json: async () => ({ token: 'test-jwt-token', user: { name: user.name, email: user.email, role: user.role } }) }
      : { ok: false, status: 401, json: async () => ({ error: 'Invalid email or password.' }) };
  }
  if (String(url).endsWith('/auth/register')) {
    if (serverUsers.has(String(body.email).toLowerCase())) {
      return { ok: false, status: 409, json: async () => ({ error: 'An account with this email already exists.' }) };
    }
    const user = { ...body, email: body.email.toLowerCase(), role: 'Caregiver / Patient' };
    serverUsers.set(user.email, user);
    return { ok: true, status: 201, json: async () => ({ token: 'registered-jwt-token', user }) };
  }
  throw new Error(`Unexpected auth test URL: ${url}`);
};

// Test 2.2: Login with valid credentials
const loginRes = await loginUser('demo@medcheck.org', 'demo123');
assert.strictEqual(loginRes.success, true);
assert.strictEqual(loginRes.user.email, 'demo@medcheck.org');
assert.strictEqual(getAuthToken(), 'test-jwt-token');
pass('Successful API login stores JWT and public user session');

// Test 2.3: Login with invalid password
const badPassRes = await loginUser('demo@medcheck.org', 'wrongpass');
assert.strictEqual(badPassRes.success, false);
pass('Rejected login with invalid password');

// Test 2.4: Login with nonexistent email
const badEmailRes = await loginUser('nonexistent@domain.com', 'password123');
assert.strictEqual(badEmailRes.success, false);
pass('Rejected login with nonexistent email');

// Test 2.5: User Registration
const regRes = await registerUser('Priya Sharma', 'priya@example.com', 'mypassword');
assert.strictEqual(regRes.success, true);
assert.strictEqual(regRes.user.name, 'Priya Sharma');
assert.strictEqual(regRes.user.email, 'priya@example.com');
assert.strictEqual(getAuthToken(), 'registered-jwt-token');
pass('Successful API registration stores JWT and user session');

// Test 2.6: Prevent duplicate email registration
const dupRes = await registerUser('Duplicate User', 'priya@example.com', 'anotherpass');
assert.strictEqual(dupRes.success, false);
pass('Prevented duplicate registration for existing email');

// Test 2.7: Session storage & Logout
localStorage.setItem('medcheck_demo_users', JSON.stringify([{ email: 'legacy@example.com', password: 'legacy-secret' }]));
const sessionUser = getCurrentUser();
assert.strictEqual(sessionUser.email, 'priya@example.com');
assert.strictEqual(JSON.stringify(sessionUser).includes('mypassword'), false);
assert.strictEqual(localStorage.getItem('medcheck_demo_users'), null);
pass('Current session contains public user details without a password');

logoutUser();
assert.strictEqual(localStorage.getItem('medcheck_demo_session'), null);
assert.strictEqual(getAuthToken(), null);
assert.strictEqual(getCurrentUser(), null);
pass('Logout clears the session and JWT');

// Test 2.8: Backend outage keeps demo mode available without persisting passwords
global.fetch = async () => { throw new Error('API offline'); };
const offlineDemoRes = await loginUser('demo@medcheck.org', 'demo123');
assert.strictEqual(offlineDemoRes.success, true);
assert.strictEqual(offlineDemoRes.offlineDemo, true);
assert.strictEqual(getAuthToken(), null);
assert.strictEqual(JSON.stringify(getCurrentUser()).includes('demo123'), false);
const offlineRegisterRes = await registerUser('Offline User', 'offline@example.com', 'secret123');
assert.strictEqual(offlineRegisterRes.success, false);
pass('Offline demo fallback works without locally storing passwords or registrations');

global.fetch = async () => ({
  ok: false,
  status: 503,
  json: async () => ({ error: 'Database is unavailable.' })
});
const unavailableDatabaseDemo = await loginUser('demo@medcheck.org', 'demo123');
assert.strictEqual(unavailableDatabaseDemo.success, true);
assert.strictEqual(unavailableDatabaseDemo.offlineDemo, true);
pass('HTTP database-unavailable responses activate demo fallback');

global.fetch = originalFetch;

console.log('\n======================================================');
console.log(`  ALL SIDEBAR & AUTH TESTS PASSED: ${passCount} checks successful!`);
console.log('======================================================\n');
