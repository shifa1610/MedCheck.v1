import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import requireAuth from '../middleware/requireAuth.js';
import { getDatabaseStatus } from '../database.js';

const router = Router();
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ensureServiceReady(res) {
  if (getDatabaseStatus() !== 'connected') {
    res.status(503).json({ error: 'Database is unavailable. Please try again later.' });
    return false;
  }
  if (!process.env.JWT_SECRET) {
    res.status(503).json({ error: 'Authentication is not configured.' });
    return false;
  }
  return true;
}

function toPublicUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };
}

function createToken(user) {
  return jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

router.post('/register', async (req, res, next) => {
  if (!ensureServiceReady(res)) return;

  const { name, email, password } = req.body || {};
  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
    return res.status(400).json({ error: 'Name must be between 2 and 100 characters.' });
  }
  if (typeof email !== 'string' || !EMAIL_PATTERN.test(email.trim()) || email.trim().length > 254) {
    return res.status(400).json({ error: 'Enter a valid email address.' });
  }
  if (typeof password !== 'string' || password.length < 6 || Buffer.byteLength(password, 'utf8') > 72) {
    return res.status(400).json({ error: 'Password must be at least 6 characters and no more than 72 bytes.' });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail }).select('_id');
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: await bcrypt.hash(password, 12)
    });
    return res.status(201).json({ token: createToken(user), user: toPublicUser(user) });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }
    return next(error);
  }
});

router.post('/login', async (req, res, next) => {
  if (!ensureServiceReady(res)) return;

  const { email, password } = req.body || {};
  if (typeof email !== 'string' || !EMAIL_PATTERN.test(email.trim()) ||
      typeof password !== 'string' || password.length === 0) {
    return res.status(400).json({ error: 'Enter a valid email address and password.' });
  }

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    return res.json({ token: createToken(user), user: toPublicUser(user) });
  } catch (error) {
    return next(error);
  }
});

router.get('/me', requireAuth, async (req, res, next) => {
  if (getDatabaseStatus() !== 'connected') {
    return res.status(503).json({ error: 'Database is unavailable. Please try again later.' });
  }

  try {
    const user = await User.findById(req.auth.sub);
    if (!user) return res.status(401).json({ error: 'Account no longer exists.' });
    return res.json({ user: toPublicUser(user) });
  } catch (error) {
    return next(error);
  }
});

export default router;
