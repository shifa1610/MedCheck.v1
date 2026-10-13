import { Router } from 'express';
import mongoose from 'mongoose';
import PatientProfile from '../models/PatientProfile.js';
import requireAuth from '../middleware/requireAuth.js';
import { getDatabaseStatus } from '../database.js';

const router = Router();
router.use(requireAuth);
router.use((req, res, next) => {
  if (getDatabaseStatus() !== 'connected') {
    return res.status(503).json({ error: 'Database is unavailable. Please try again later.' });
  }
  return next();
});

router.get('/', async (req, res, next) => {
  try {
    const profiles = await PatientProfile.find({ userId: req.auth.sub }).sort({ createdAt: 1 });
    return res.json({ profiles });
  } catch (error) {
    return next(error);
  }
});

router.post('/', async (req, res, next) => {
  const { name, relationship, age, gender, bloodGroup, preferredLanguage, dob } = req.body || {};
  const validLanguages = ['en', 'hi', 'te', 'ta', 'kn', 'ml', 'mr', 'gu'];

  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
    return res.status(400).json({ error: 'Patient name must be between 2 and 100 characters.' });
  }
  if (typeof relationship !== 'string' || !relationship.trim() || relationship.trim().length > 40) {
    return res.status(400).json({ error: 'Relationship is required and must be under 40 characters.' });
  }
  if (age !== undefined && age !== null && (!Number.isInteger(Number(age)) || Number(age) < 0 || Number(age) > 125)) {
    return res.status(400).json({ error: 'Age must be a whole number between 0 and 125.' });
  }
  if (preferredLanguage !== undefined && !validLanguages.includes(preferredLanguage)) {
    return res.status(400).json({ error: 'Choose a supported language.' });
  }
  if (dob && Number.isNaN(Date.parse(dob))) {
    return res.status(400).json({ error: 'Date of birth must be a valid date.' });
  }

  try {
    const profile = await PatientProfile.create({
      userId: req.auth.sub,
      name: name.trim(),
      relationship: relationship.trim(),
      age: age === undefined || age === '' ? null : Number(age),
      gender: gender || 'Prefer not to say',
      bloodGroup: typeof bloodGroup === 'string' ? bloodGroup.trim() : '',
      preferredLanguage: preferredLanguage || 'en',
      dob: dob || null
    });
    return res.status(201).json({ profile });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ error: error.message });
    }
    return next(error);
  }
});

export default router;
