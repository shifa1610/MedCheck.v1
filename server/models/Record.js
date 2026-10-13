import mongoose from 'mongoose';

const medicationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  dosage: { type: String, default: '' },
  frequency: { type: String, default: '' },
  duration: { type: String, default: '' },
  instructions: { type: String, default: '' },
  confidence: { type: String, default: 'low' },
  status: { type: String, default: 'Needs Review' }
}, { _id: false });

const recordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  patientProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'PatientProfile', default: null, index: true },
  patientName: { type: String, required: true, trim: true },
  scanId: { type: String, default: '' },
  sourceFilename: { type: String, default: '' },
  recordType: {
    type: String,
    required: true,
    enum: ['prescription', 'lab_report', 'discharge_summary']
  },
  recordDate: { type: Date, default: Date.now },
  doctorName: { type: String, default: '' },
  clinicHospital: { type: String, default: '' },
  rawText: { type: String, default: '' },
  plainSummary: { type: String, default: '' },
  medications: { type: [medicationSchema], default: [] },
  abnormalFindings: { type: [mongoose.Schema.Types.Mixed], default: [] },
  title: { type: String, default: '' },
  category: { type: String, default: '' },
  summary: { type: mongoose.Schema.Types.Mixed, default: null },
  biomarkers: { type: [mongoose.Schema.Types.Mixed], default: [] },
  testValues: { type: [mongoose.Schema.Types.Mixed], default: [] },
  verificationStatus: { type: String, default: '' },
  verificationProvenance: { type: mongoose.Schema.Types.Mixed, default: null },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Record || mongoose.model('Record', recordSchema);
