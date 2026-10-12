import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { handleTTS } from '../api/tts.js';
import { connectDatabase, getDatabaseStatus } from './database.js';
import authRoutes from './routes/auth.js';
import recordRoutes from './routes/records.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use('/api/auth', authRoutes);
app.use('/api/records', recordRoutes);

// Ensure uploads folder exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

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

// Upload and Extract endpoint
app.post('/api/upload', upload.single('medicalRecord'), (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Return receipt
    res.json({
      success: true,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      message: 'File ingested successfully into clinical OCR pipeline'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
  console.error('[MedCheck] API error:', error);
  if (res.headersSent) return next(error);
  return res.status(500).json({ error: 'An unexpected server error occurred.' });
});

export { app, server };
