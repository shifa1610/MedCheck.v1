import app from '../server/app.js';
import { connectDatabase, getDatabaseStatus } from '../server/database.js';

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  const pathname = (req.url || '').split('?')[0];
  const usesDatabase = /^\/api\/(?:auth|profiles|records)(?:\/|$)/.test(pathname);

  if (usesDatabase && getDatabaseStatus() !== 'connected') {
    await connectDatabase();
  }
  return app(req, res);
}
