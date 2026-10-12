import { Router } from 'express';
import mongoose from 'mongoose';
import Record from '../models/Record.js';
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
    const records = await Record.find({ userId: req.auth.sub }).sort({ recordDate: -1, createdAt: -1 });
    return res.json({ records });
  } catch (error) {
    return next(error);
  }
});

router.post('/', async (req, res, next) => {
  const payload = req.body || {};
  const validTypes = ['prescription', 'lab_report', 'discharge_summary'];
  if (!validTypes.includes(payload.recordType)) {
    return res.status(400).json({ error: 'recordType must be prescription, lab_report, or discharge_summary.' });
  }
  if (typeof payload.patientName !== 'string' || !payload.patientName.trim()) {
    return res.status(400).json({ error: 'patientName is required.' });
  }
  if (payload.recordDate && Number.isNaN(Date.parse(payload.recordDate))) {
    return res.status(400).json({ error: 'recordDate must be a valid date.' });
  }
  if (payload.medications !== undefined && !Array.isArray(payload.medications)) {
    return res.status(400).json({ error: 'medications must be an array.' });
  }

  try {
    const record = await Record.create({
      ...payload,
      userId: req.auth.sub,
      patientName: payload.patientName.trim()
    });
    return res.status(201).json({ record });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ error: error.message });
    }
    return next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid record id.' });
  }

  try {
    const deleted = await Record.findOneAndDelete({
      _id: req.params.id,
      userId: req.auth.sub
    });
    if (!deleted) return res.status(404).json({ error: 'Record not found.' });
    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
});

export default router;
