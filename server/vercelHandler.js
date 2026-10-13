import app from './app.js';
import { connectDatabase, getDatabaseStatus } from './database.js';

export default async function vercelHandler(req, res) {
  const pathname = (req.url || '').split('?')[0];
  const usesDatabase = /^\/api\/(?:auth|profiles|records)(?:\/|$)/.test(pathname);

  if (usesDatabase && getDatabaseStatus() !== 'connected') {
    await connectDatabase();
  }
  return app(req, res);
}
