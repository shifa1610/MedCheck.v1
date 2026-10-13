import assert from 'node:assert/strict';
import http from 'node:http';
import express from 'express';
import jwt from 'jsonwebtoken';
import handwritingRoutes from '../server/routes/handwriting.js';

const originalJwtSecret = process.env.JWT_SECRET;
const originalVisionKey = process.env.GOOGLE_CLOUD_VISION_API_KEY;
const originalFetch = globalThis.fetch;
const testSecret = 'handwriting-route-test-secret';
process.env.JWT_SECRET = testSecret;
process.env.GOOGLE_CLOUD_VISION_API_KEY = 'vision-test-key';

const app = express();
app.use(express.json({ limit: '25mb' }));
app.use('/api/recognition', handwritingRoutes);
const server = app.listen(0, '127.0.0.1');
await new Promise(resolve => server.once('listening', resolve));
const token = jwt.sign({ sub: 'test-user' }, testSecret);
const address = server.address();
const image = Buffer.from('test image bytes').toString('base64');

function request(body, authorization = `Bearer ${token}`) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const req = http.request({
      hostname: '127.0.0.1',
      port: address.port,
      path: '/api/recognition/handwriting',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        ...(authorization ? { Authorization: authorization } : {})
      }
    }, response => {
      let data = '';
      response.setEncoding('utf8');
      response.on('data', chunk => { data += chunk; });
      response.on('end', () => resolve({ status: response.statusCode, body: JSON.parse(data) }));
    });
    req.on('error', reject);
    req.end(payload);
  });
}

try {
  const unauthenticated = await request({ image, mimeType: 'image/png' }, '');
  assert.equal(unauthenticated.status, 401, 'Cloud recognition must require authentication');

  let forwardedRequest;
  globalThis.fetch = async (url, options) => {
    forwardedRequest = { url: String(url), body: JSON.parse(options.body) };
    return {
      ok: true,
      status: 200,
      json: async () => ({
        responses: [{
          fullTextAnnotation: {
            text: 'Tab Amoxicillin 500 mg 1-0-1',
            pages: [{
              blocks: [{
                paragraphs: [{
                  words: [{ confidence: 0.91 }, { confidence: 0.79 }]
                }]
              }]
            }]
          }
        }]
      })
    };
  };

  const recognized = await request({ image, mimeType: 'image/png' });
  assert.equal(recognized.status, 200);
  assert.equal(recognized.body.text, 'Tab Amoxicillin 500 mg 1-0-1');
  assert.equal(recognized.body.confidence, 85);
  assert.equal(forwardedRequest.body.requests[0].features[0].type, 'DOCUMENT_TEXT_DETECTION');
  assert.equal(forwardedRequest.body.requests[0].image.content, image);
  assert.match(forwardedRequest.url, /vision-test-key/);

  const invalidMime = await request({ image, mimeType: 'application/pdf' });
  assert.equal(invalidMime.status, 400, 'Only supported image types should be accepted');

  delete process.env.GOOGLE_CLOUD_VISION_API_KEY;
  const missingConfiguration = await request({ image, mimeType: 'image/png' });
  assert.equal(missingConfiguration.status, 503, 'Missing provider configuration should be explicit');

  process.env.GOOGLE_CLOUD_VISION_API_KEY = 'vision-test-key';
  globalThis.fetch = async () => ({ ok: false, status: 403 });
  const providerFailure = await request({ image, mimeType: 'image/png' });
  assert.equal(providerFailure.status, 502, 'Provider errors should be surfaced without hiding failure');

  console.log('Handwriting recognition tests passed: authentication, Vision request, confidence, validation, and provider errors.');
} finally {
  globalThis.fetch = originalFetch;
  if (originalJwtSecret === undefined) delete process.env.JWT_SECRET;
  else process.env.JWT_SECRET = originalJwtSecret;
  if (originalVisionKey === undefined) delete process.env.GOOGLE_CLOUD_VISION_API_KEY;
  else process.env.GOOGLE_CLOUD_VISION_API_KEY = originalVisionKey;
  await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
}
