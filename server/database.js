import mongoose from 'mongoose';

const DEFAULT_MONGODB_URI = 'mongodb://127.0.0.1:27017/medcheck';
let retryTimer;

function scheduleReconnect() {
  if (retryTimer) return;
  retryTimer = setTimeout(() => {
    retryTimer = undefined;
    void connectDatabase();
  }, 10000);
  retryTimer.unref();
}

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('[MedCheck] MongoDB connected');
    return true;
  } catch (error) {
    console.error(`[MedCheck] MongoDB unavailable: ${error.message}`);
    scheduleReconnect();
    return false;
  }
}

export function getDatabaseStatus() {
  return mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
}
