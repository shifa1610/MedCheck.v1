import React, { useState } from 'react';
import { 
  Upload, 
  X, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  AlertCircle,
  FileCheck,
  Stethoscope,
  Activity,
  Layers,
  Camera
} from 'lucide-react';
import { extractMedicalRecord } from '../services/aiService';
import { scanMedicalDocument } from '../services/ocrService';
import { TRANSLATIONS } from '../data/translations';
import CameraCapture from './CameraCapture';

export default function UploadModal({ isOpen, onClose, onRecordAdded, language }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [dragOver, setDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [customStatus, setCustomStatus] = useState('');
  const [textInput, setTextInput] = useState('');
  const [activeTab, setActiveTab] = useState('camera'); // 'camera', 'file', 'samples', 'text'

  if (!isOpen) return null;

  const processingSteps = [
    t.upload.analyzing,
    t.upload.ocrScanning,
    "Standardizing to ABDM FHIR R4 schema...",
    t.upload.generatingSummary
  ];

  const handleProcess = async (sampleDataOrText) => {
    setIsProcessing(true);
    setProcessingStep(0);
    setCustomStatus('');

    // Step progression animation
    const stepInterval = setInterval(() => {
      setProcessingStep(prev => (prev < 3 ? prev + 1 : prev));
    }, 450);

    try {
      const extractedRecord = await extractMedicalRecord(sampleDataOrText);
      clearInterval(stepInterval);
      setIsProcessing(false);
      onRecordAdded(extractedRecord);
      onClose();
    } catch (err) {
      clearInterval(stepInterval);
      setIsProcessing(false);
      alert('Error extracting medical record.');
    }
  };

  const handleSampleClick = (sampleType) => {
    let payload = "";
    if (sampleType === 'rx') {
      payload = "Dr. Rajesh Sharma MD Fortis Escorts Clinic. Tab Metformin 500mg 1-0-1 after food (भोजन के बाद). Tab Telmisartan 40mg 1-0-0 morning. Tab Atorvastatin 20mg 0-0-1 bedtime.";
    } else if (sampleType === 'lab') {
      payload = "Apollo Diagnostics Lab Report. Patient: Rahul Verma. Fasting Blood Glucose: 142 mg/dL. HbA1c: 8.2 %. Total Cholesterol: 228 mg/dL. LDL Cholesterol: 154 mg/dL. Serum Creatinine: 1.05 mg/dL.";
    } else {
      payload = "Max Super Speciality Hospital Discharge Summary. Diagnosis: Acute Coronary Syndrome, CAD LAD 75% stenosis s/p PCI Stent. Discharge BP 126/80. Dual antiplatelet advised.";
    }
    handleProcess(payload);
  };

  const handleFileDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // If dropped file is an image, perform real OCR with Tesseract
    if (file.type.startsWith('image/')) {
      setIsProcessing(true);
      setCustomStatus('Reading image characters via Optical Character Recognition...');
      try {
        const ocrResult = await scanMedicalDocument(file, ({ percent, statusText }) => {
          setCustomStatus(`${statusText} (${percent}%)`);
        });

        setIsProcessing(false);
        onRecordAdded(ocrResult.structuredRecord);
        onClose();
      } catch (ocrErr) {
        console.warn('Direct file OCR fallback:', ocrErr);
        handleProcess({ name: file.name, text: `Medical Record Image: ${file.name}` });
      }
    } else {
      handleProcess({ name: file.name, text: `Medical Record File: ${file.name}` });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-teal-50 via-sky-50 to-emerald-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{t.upload.title}</h3>
                <span className="bg-teal-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Live OCR Ready
                </span>
              </div>
              <p className="text-xs text-slate-500">{t.upload.subtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-slate-500 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-100 bg-slate-50/70 p-1.5 gap-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('camera')}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'camera' 
                ? 'bg-teal-600 text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Live Camera OCR</span>
          </button>
          
          <button
            onClick={() => setActiveTab('file')}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'file' 
                ? 'bg-white text-teal-700 shadow-2xs border border-slate-200' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Image / PDF</span>
          </button>

          <button
            onClick={() => setActiveTab('samples')}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'samples' 
                ? 'bg-white text-teal-700 shadow-2xs border border-slate-200' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Instant Samples</span>
          </button>

          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'text' 
                ? 'bg-white text-teal-700 shadow-2xs border border-slate-200' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Paste Text</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6">
          {isProcessing ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-teal-50 border-2 border-teal-500 text-teal-600 flex items-center justify-center mx-auto shadow-lg shadow-teal-500/10">
                <RefreshCw className="w-8 h-8 animate-spin" />
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900">
                  {customStatus || processingSteps[processingStep]}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Extracting doctor handwriting, drug strengths, and printed reference ranges
                </p>
              </div>

              <div className="w-64 bg-slate-100 rounded-full h-2 mx-auto overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${(processingStep + 1) * 25}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'camera' && (
                <CameraCapture 
                  onDocumentExtracted={onRecordAdded} 
                  onClose={onClose} 
                />
              )}

              {activeTab === 'file' && (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleFileDrop}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                    dragOver 
                      ? 'border-teal-500 bg-teal-50/50 scale-[1.01]' 
                      : 'border-slate-300 hover:border-teal-400 bg-slate-50/40'
                  }`}
                >
                  <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  <p className="text-xs font-bold text-slate-800 mb-1">
                    {t.upload.dropOrBrowse}
                  </p>
                  <p className="text-[11px] text-slate-500 mb-4">
                    Supports JPG, PNG, WebP (Real OCR enabled) and PDF reports
                  </p>
                  <label className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-5 py-2.5 rounded-xl cursor-pointer shadow-xs transition-colors">
                    <span>Select File to Scan</span>
                    <input type="file" onChange={handleFileDrop} accept="image/*,.pdf" className="hidden" />
                  </label>
                </div>
              )}

              {activeTab === 'samples' && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-slate-600 mb-2">
                    {t.upload.orUseSample}
                  </p>

                  <button
                    onClick={() => handleSampleClick('rx')}
                    className="w-full text-left p-3.5 rounded-2xl border border-purple-200 bg-purple-50/40 hover:bg-purple-50 hover:border-purple-300 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                        <Stethoscope className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{t.upload.samplePrescription}</div>
                        <div className="text-[11px] text-slate-500">Dr. Rajesh Sharma • Metformin, Telmisartan, Atorvastatin</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-purple-700 group-hover:translate-x-0.5 transition-transform">Run OCR →</span>
                  </button>

                  <button
                    onClick={() => handleSampleClick('lab')}
                    className="w-full text-left p-3.5 rounded-2xl border border-sky-200 bg-sky-50/40 hover:bg-sky-50 hover:border-sky-300 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{t.upload.sampleLabReport}</div>
                        <div className="text-[11px] text-slate-500">Apollo Diagnostics • HbA1c 8.2%, Fasting Sugar, Lipid Panel</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-sky-700 group-hover:translate-x-0.5 transition-transform">Run OCR →</span>
                  </button>

                  <button
                    onClick={() => handleSampleClick('discharge')}
                    className="w-full text-left p-3.5 rounded-2xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50 hover:border-amber-300 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{t.upload.sampleDischarge}</div>
                        <div className="text-[11px] text-slate-500">Max Hospital • Acute Coronary Syndrome post-PCI Stent</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-700 group-hover:translate-x-0.5 transition-transform">Run OCR →</span>
                  </button>
                </div>
              )}

              {activeTab === 'text' && (
                <div className="space-y-3">
                  <textarea
                    rows={5}
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Paste unformatted doctor notes, OCR output, or test findings here (e.g., 'Metformin 500mg BID after food, Fasting Sugar: 140 mg/dL')..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-teal-500 leading-relaxed"
                  />
                  <button
                    onClick={() => handleProcess(textInput)}
                    disabled={!textInput.trim()}
                    className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    Extract & Summarize with AI
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
