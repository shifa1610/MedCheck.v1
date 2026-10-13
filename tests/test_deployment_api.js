import assert from 'node:assert/strict';
import http from 'node:http';

process.env.JWT_SECRET = 'deployment-route-test-secret';
const { default: apiHandler } = await import('../api/[...path].js');

const server = http.createServer((req, res) => apiHandler(req, res));
server.listen(0, '127.0.0.1');
await new Promise(resolve => server.once('listening', resolve));

try {
  const { port } = server.address();
  const health = await fetch(`http://127.0.0.1:${port}/api/health`);
  assert.equal(health.status, 200, 'Vercel catch-all should serve the health route');
  assert.equal((await health.json()).status, 'online');

  const login = await fetch(`http://127.0.0.1:${port}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'person@example.com', password: 'password123' })
  });
  assert.notEqual(login.status, 404, 'Login route should reach Express instead of returning Vercel 404');

  const chat = await fetch(`http://127.0.0.1:${port}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'user', content: 'Hello' }], language: 'en' })
  });
  assert.equal(chat.status, 401, 'Chat route should be reachable and enforce authentication');

  console.log('Deployment API routing tests passed: health, login routing, and authenticated chat route.');
} finally {
  await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
}
