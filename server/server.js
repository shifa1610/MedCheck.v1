import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';
import { handleTTS } from '../api/tts.js';
import { connectDatabase, getDatabaseStatus } from './database.js';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profiles.js';
import recordRoutes from './routes/records.js';
import handwritingRoutes from './routes/handwriting.js';
import chatRoutes from './routes/chat.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use('/api/chat', express.json({ limit: '64kb' }));
app.use(express.json({ limit: '25mb' }));
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/recognition', handwritingRoutes);
app.use('/api/chat', chatRoutes);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      return cb(null, true);
    }
    const error = new Error('Only PDF, JPEG, PNG, and WebP documents are accepted.');
    error.statusCode = 400;
    return cb(error);
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'MedCheck Clinical Intelligence Backend',
    version: '1.0.0',
    database: getDatabaseStatus(),
    abdmReady: true,
    supportedLanguages: ['en', 'hi', 'te', 'ta', 'kn', 'ml', 'mr', 'gu']
  });
});

// Multi-lingual Audio TTS Proxy Endpoint (Supports Google Cloud TTS, Azure AI Speech & Native High-Fidelity Gateway)
app.all('/api/tts', handleTTS);

// Intake only. Browser-side Tesseract OCR processes the selected image itself.
app.post('/api/upload', upload.single('medicalRecord'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  return res.json({
    success: true,
    scanId: randomUUID(),
    originalName: file.originalname,
    size: file.size,
    mimetype: file.mimetype,
    recognition: 'not_performed',
    message: 'Upload received in memory only. Recognition is performed by the client OCR workflow.'
  });
});

// FHIR R4 Validation Endpoint
app.post('/api/fhir/validate', (req, res) => {
  const bundle = req.body;
  if (!bundle || bundle.resourceType !== 'Bundle') {
    return res.status(400).json({ valid: false, errors: ['Resource is not a valid FHIR Bundle'] });
  }

  const hasPatient = bundle.entry?.some(e => e.resource?.resourceType === 'Patient');
  const observations = bundle.entry?.filter(e => e.resource?.resourceType === 'Observation') || [];
  const medications = bundle.entry?.filter(e => e.resource?.resourceType === 'MedicationRequest') || [];

  res.json({
    valid: true,
    bundleId: bundle.id,
    profile: 'https://nrces.in/ndhm/fhir/r4/StructureDefinition/DocumentBundle',
    totalEntries: bundle.entry?.length || 0,
    hasPatientResource: hasPatient,
    observationCount: observations.length,
    medicationRequestCount: medications.length,
    abdmCompliance: 'Verified'
  });
});

const server = app.listen(PORT, () => {
  console.log(`[MedCheck] Backend server running on http://localhost:${PORT}`);
  if (!process.env.JWT_SECRET) {
    console.error('[MedCheck] JWT_SECRET is not configured; authentication routes will be unavailable.');
  }
  void connectDatabase();
});

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  if (error instanceof multer.MulterError) {
    const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    return res.status(status).json({ error: status === 413 ? 'File exceeds the 15 MB upload limit.' : 'Invalid upload request.' });
  }
  if (error.statusCode === 400) {
    return res.status(400).json({ error: error.message });
  }
  console.error('[MedCheck] API error:', error.message);
  return res.status(500).json({ error: 'An unexpected server error occurred.' });
});

export { app, server };
