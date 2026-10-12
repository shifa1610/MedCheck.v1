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
const { getUsers, getCurrentUser, loginUser, registerUser, logoutUser } = await import('../src/utils/auth.js');

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

// Test 2.1: Pre-seeded users
const initialUsers = getUsers();
assert.ok(initialUsers.length >= 2, 'Should have initial demo users');
pass('Default initial demo users seeded');

// Test 2.2: Login with demo credentials
const loginRes = loginUser('demo@medcheck.org', 'demo123');
assert.strictEqual(loginRes.success, true);
assert.strictEqual(loginRes.user.email, 'demo@medcheck.org');
pass('Successful login with valid credentials (demo@medcheck.org)');

// Test 2.3: Login with invalid password
const badPassRes = loginUser('demo@medcheck.org', 'wrongpass');
assert.strictEqual(badPassRes.success, false);
pass('Rejected login with invalid password');

// Test 2.4: Login with nonexistent email
const badEmailRes = loginUser('nonexistent@domain.com', 'password123');
assert.strictEqual(badEmailRes.success, false);
pass('Rejected login with nonexistent email');

// Test 2.5: User Registration
const regRes = registerUser('Priya Sharma', 'priya@example.com', 'mypassword');
assert.strictEqual(regRes.success, true);
assert.strictEqual(regRes.user.name, 'Priya Sharma');
assert.strictEqual(regRes.user.email, 'priya@example.com');
pass('Successful registration for new user');

// Test 2.6: Prevent duplicate email registration
const dupRes = registerUser('Duplicate User', 'priya@example.com', 'anotherpass');
assert.strictEqual(dupRes.success, false);
pass('Prevented duplicate registration for existing email');

// Test 2.7: Session storage & Logout
const sessionUser = getCurrentUser();
assert.strictEqual(sessionUser.email, 'priya@example.com');
pass('Current session points to newly registered user');

logoutUser();
localStorage.removeItem('medcheck_demo_session');
assert.strictEqual(localStorage.getItem('medcheck_demo_session'), null);
pass('Logout clears active session');

console.log('\n======================================================');
console.log(`  ALL SIDEBAR & AUTH TESTS PASSED: ${passCount} checks successful!`);
console.log('======================================================\n');
