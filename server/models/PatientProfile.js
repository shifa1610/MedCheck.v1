import mongoose from 'mongoose';

const patientProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  relationship: { type: String, required: true, trim: true, maxlength: 40 },
  age: { type: Number, min: 0, max: 125, default: null },
  gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'], default: 'Prefer not to say' },
  bloodGroup: { type: String, default: '' },
  preferredLanguage: {
    type: String,
    enum: ['en', 'hi', 'te', 'ta', 'kn', 'ml', 'mr', 'gu'],
    default: 'en'
  },
  dob: { type: Date, default: null },
  abhaId: { type: String, default: '' },
  abhaAddress: { type: String, default: '' },
  activeConditions: { type: [String], default: [] },
  allergies: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

patientProfileSchema.index({ userId: 1, createdAt: 1 });

export default mongoose.models.PatientProfile || mongoose.model('PatientProfile', patientProfileSchema);
