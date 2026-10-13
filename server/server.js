import dotenv from 'dotenv';
import app from './app.js';
import { connectDatabase } from './database.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`[MedCheck] Backend server running on http://localhost:${PORT}`);
  if (!process.env.JWT_SECRET) {
    console.error('[MedCheck] JWT_SECRET is not configured; authentication routes will be unavailable.');
  }
  void connectDatabase();
});

export { app, server };
