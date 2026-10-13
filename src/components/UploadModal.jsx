import React, { useEffect, useRef, useState } from 'react';
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
  Camera,
  Check
} from 'lucide-react';
import { extractMedicalRecord } from '../services/aiService';
import { scanHandwrittenPrescription, scanMedicalDocument } from '../services/ocrService';
import { TRANSLATIONS } from '../data/translations';
import { getAuthToken } from '../utils/auth';
import CameraCapture from './CameraCapture';

export default function UploadModal({ isOpen, onClose, onRecordAdded, onScanStart, language }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [customStatus, setCustomStatus] = useState('');
  const [textInput, setTextInput] = useState('');
  const [cloudIcrConsent, setCloudIcrConsent] = useState(false);
  const [activeTab, setActiveTab] = useState('file'); // 'file', 'camera', 'samples', 'text'
  const [previewUrl, setPreviewUrl] = useState('');
  const selectedScanId = useRef('');
  const activeRequest = useRef(0);

  useEffect(() => {
    if (!selectedFile || !(selectedFile.type.startsWith('image/') || /\.(png|jpe?g|webp)$/i.test(selectedFile.name))) {
      setPreviewUrl('');
      return undefined;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    if (!isOpen) {
      activeRequest.current += 1;
      setIsProcessing(false);
      setSelectedFile(null);
      setFileError('');
      setCloudIcrConsent(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  const maxSizeBytes = 15 * 1024 * 1024; // 15 MB

  const validateFile = (file) => {
    setFileError('');
    if (!file) return false;

    // Check extension / type
    const isAllowed = allowedTypes.includes(file.type) || 
      /\.(pdf|png|jpe?g|webp)$/i.test(file.name);

    if (!isAllowed) {
      setFileError('Invalid file type. Please upload a medical document in PDF, JPG, PNG, or WebP format.');
      return false;
    }

    if (file.size > maxSizeBytes) {
      setFileError('File exceeds 15 MB size limit. Please upload a smaller document or image.');
      return false;
    }

    return true;
  };

  const handleFileSelect = (e) => {
    const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
    const file = files?.[0];
    if (e.target?.type === 'file') e.target.value = '';
    if (!file) return;
    activeRequest.current += 1;
    setFileError('');
    setIsProcessing(false);
    setCustomStatus('');
    setCloudIcrConsent(false);
    onScanStart?.();
    if (validateFile(file)) {
      setSelectedFile(file);
      selectedScanId.current = globalThis.crypto?.randomUUID?.() || `scan-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    } else {
      setSelectedFile(null);
      selectedScanId.current = '';
    }
  };

  const handleProcessHandwrittenFile = async () => {
    if (!selectedFile || isProcessing || !cloudIcrConsent) return;
    if (/\.pdf$/i.test(selectedFile.name) || selectedFile.type === 'application/pdf') {
      setFileError('Cloud handwriting recognition supports image files only. Upload a prescription page as JPG, PNG, or WebP.');
      return;
    }

    const requestNumber = ++activeRequest.current;
    setIsProcessing(true);
    setFileError('');
    setCustomStatus('Sending the image to Google Cloud Vision for handwriting recognition...');
    onScanStart?.();

    try {
      const result = await scanHandwrittenPrescription(selectedFile, {
        scanId: selectedScanId.current,
        sourceFilename: selectedFile.name
      });
      if (requestNumber !== activeRequest.current) return;
      onRecordAdded(result.structuredRecord);
      onClose();
    } catch (error) {
      if (requestNumber === activeRequest.current) {
        setFileError(error.message || 'Handwriting recognition failed. Please try a clearer image.');
      }
    } finally {
      if (requestNumber === activeRequest.current) setIsProcessing(false);
    }
  };

  const handleProcessSelectedFile = async () => {
    if (!selectedFile || isProcessing) return;

    const file = selectedFile;
    const scanId = selectedScanId.current;
    const requestNumber = ++activeRequest.current;
    setIsProcessing(true);
    setProcessingStep(0);
    setFileError('');

    if (/\.pdf$/i.test(file.name) || file.type === 'application/pdf') {
      setIsProcessing(false);
      setFileError('PDF text recognition is not configured yet. Upload a page as an image (JPG, PNG, or WebP) instead.');
      return;
    }

    if (!(file.type.startsWith('image/') || /\.(png|jpe?g|webp)$/i.test(file.name))) {
      setIsProcessing(false);
      setFileError('This file type cannot be scanned. Choose a JPG, PNG, or WebP image.');
      return;
    }

    try {
      setCustomStatus(`Scanning ${file.name} with local Tesseract OCR...`);
      const ocrResult = await scanMedicalDocument(file, ({ percent, statusText }) => {
        if (requestNumber === activeRequest.current) {
          setCustomStatus(`${statusText} (${percent}%)`);
        }
      }, { scanId, sourceFilename: file.name });

      if (requestNumber !== activeRequest.current) return;
      onRecordAdded(ocrResult.structuredRecord);
      onClose();
    } catch (error) {
      if (requestNumber === activeRequest.current) {
        setFileError(error.message || 'Could not recognize text in this image. Please try a clearer image.');
      }
    } finally {
      if (requestNumber === activeRequest.current) setIsProcessing(false);
    }
  };

  const handleProcess = async (sampleDataOrText, sourceFilename = 'Pasted text') => {
    if (isProcessing) return;
    const requestNumber = ++activeRequest.current;
    const scanId = globalThis.crypto?.randomUUID?.() || `scan-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setIsProcessing(true);
    setProcessingStep(0);
    setFileError('');
    setCustomStatus(activeTab === 'samples' ? 'Processing labelled demo sample...' : 'Extracting fields from supplied text...');
    onScanStart?.(scanId);

    const stepInterval = setInterval(() => {
      setProcessingStep(prev => (prev < 3 ? prev + 1 : prev));
    }, 450);

    try {
      const extractedRecord = await extractMedicalRecord(sampleDataOrText, { scanId, sourceFilename });
      clearInterval(stepInterval);
      if (requestNumber !== activeRequest.current) return;
      onRecordAdded(extractedRecord);
      onClose();
    } catch (err) {
      clearInterval(stepInterval);
      if (requestNumber === activeRequest.current) {
        setFileError(err.message || 'Could not extract text from this input.');
      }
    } finally {
      if (requestNumber === activeRequest.current) setIsProcessing(false);
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
    handleProcess(payload, `Demo sample — ${sampleType}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Upload Record</h3>
              <p className="text-xs text-slate-500">Scan prescription, lab report, or discharge document</p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="w-7 h-7 rounded-lg hover:bg-slate-200/80 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-1.5 gap-1 text-xs">
          <button
            onClick={() => setActiveTab('file')}
            className={`flex-1 py-1.5 px-2.5 font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'file' 
                ? 'bg-white text-emerald-800 shadow-2xs font-semibold border border-slate-200' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Select File</span>
          </button>

          <button
            onClick={() => setActiveTab('camera')}
            className={`flex-1 py-1.5 px-2.5 font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'camera' 
                ? 'bg-white text-emerald-800 shadow-2xs font-semibold border border-slate-200' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Camera</span>
          </button>

          <button
            onClick={() => setActiveTab('samples')}
            className={`flex-1 py-1.5 px-2.5 font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'samples' 
                ? 'bg-white text-emerald-800 shadow-2xs font-semibold border border-slate-200' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Samples</span>
          </button>

          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-1.5 px-2.5 font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'text' 
                ? 'bg-white text-emerald-800 shadow-2xs font-semibold border border-slate-200' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Paste Text</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {isProcessing ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto">
                <RefreshCw className="w-6 h-6 animate-spin" />
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {customStatus || "Processing medical record..."}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Parsing medications, dosages, lab findings, and reference ranges
                </p>
              </div>

              <div className="w-48 bg-slate-100 rounded-full h-1.5 mx-auto overflow-hidden">
                <div 
                  className="bg-emerald-600 h-full transition-all duration-300"
                  style={{ width: `${(processingStep + 1) * 25}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'file' && (
                <div className="space-y-4">
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOver(false);
                      handleFileSelect(e);
                    }}
                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                      dragOver 
                        ? 'border-emerald-500 bg-emerald-50/50' 
                        : 'border-slate-300 hover:border-emerald-400 bg-slate-50'
                    }`}
                  >
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-800 mb-1">
                      Drag and drop medical document here, or browse
                    </p>
                    <p className="text-[11px] text-slate-500 mb-3">
                      Supports PDF, PNG, JPG, JPEG, and WebP (up to 15 MB)
                    </p>
                    
                    <label className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-4 py-2 rounded-lg cursor-pointer transition-colors shadow-xs">
                      <span>Choose File</span>
                      <input 
                        type="file" 
                        onChange={handleFileSelect} 
                        accept=".pdf,image/png,image/jpeg,image/jpg,image/webp" 
                        className="hidden" 
                      />
                    </label>
                  </div>

                  {/* Validation Error Message */}
                  {fileError && (
                    <div className="flex items-center gap-2 p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{fileError}</span>
                    </div>
                  )}

                  {/* Selected File Card */}
                  {selectedFile && (
                    <div className="space-y-2">
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <FileCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                          <div className="truncate">
                            <p className="text-xs font-bold text-slate-900 truncate">{selectedFile.name}</p>
                            <p className="text-[10px] text-slate-500">
                              {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type || 'Document'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleProcessSelectedFile}
                          disabled={isProcessing || !!fileError}
                          className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ml-2"
                        >
                          Extract Data →
                        </button>
                      </div>

                      {previewUrl && (
                        <img src={previewUrl} alt={`Preview of ${selectedFile.name}`} className="max-h-56 w-full rounded-xl border border-slate-200 bg-slate-50 object-contain" />
                      )}

                      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 space-y-2">
                        <label className="flex items-start gap-2 text-xs text-amber-950">
                          <input
                            type="checkbox"
                            checked={cloudIcrConsent}
                            onChange={event => setCloudIcrConsent(event.target.checked)}
                            className="mt-0.5 rounded border-amber-400 text-amber-700 focus:ring-amber-500"
                          />
                          <span>I agree to send this image to Google Cloud Vision through the MedCheck server for handwritten-text recognition. The image is not saved by this recognition route.</span>
                        </label>
                        {!getAuthToken() && (
                          <p className="text-[11px] text-amber-900">Sign in with a server account to use cloud handwriting recognition.</p>
                        )}
                        <button
                          onClick={handleProcessHandwrittenFile}
                          disabled={!cloudIcrConsent || !getAuthToken() || isProcessing || !!fileError}
                          className="w-full rounded-lg bg-amber-700 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Recognize Handwriting with Cloud ICR
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'camera' && (
                <CameraCapture 
                  onDocumentExtracted={onRecordAdded} 
                  onScanStart={onScanStart}
                  onClose={onClose} 
                />
              )}

              {activeTab === 'samples' && (
                <div className="space-y-2.5">
                  <p className="text-xs text-slate-600 font-medium mb-1">
                    Select a sample record to test extraction immediately:
                  </p>

                  <button
                    onClick={() => handleSampleClick('rx')}
                    className="w-full text-left p-3 rounded-xl border border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                        <Stethoscope className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-900">Sample Prescription (Bilingual)</div>
                        <div className="text-[11px] text-slate-500">Metformin 500mg, Telmisartan 40mg, Atorvastatin 20mg</div>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-emerald-700">Test →</span>
                  </button>

                  <button
                    onClick={() => handleSampleClick('lab')}
                    className="w-full text-left p-3 rounded-xl border border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-900">Sample Lab Report (Blood Sugar & Lipids)</div>
                        <div className="text-[11px] text-slate-500">HbA1c 8.2%, Fasting Sugar 142 mg/dL, LDL 154 mg/dL</div>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-emerald-700">Test →</span>
                  </button>

                  <button
                    onClick={() => handleSampleClick('discharge')}
                    className="w-full text-left p-3 rounded-xl border border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-900">Hospital Discharge Summary (Cardiology)</div>
                        <div className="text-[11px] text-slate-500">Post-PCI LAD Stent, Aspirin + Clopidogrel protocol</div>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-emerald-700">Test →</span>
                  </button>
                </div>
              )}

              {activeTab === 'text' && (
                <div className="space-y-3">
                  <textarea
                    rows={4}
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Paste doctor prescription text, lab test values, or medicine notes..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-emerald-500 leading-relaxed"
                  />
                  <button
                    onClick={() => handleProcess(textInput)}
                    disabled={!textInput.trim()}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                  >
                    Extract & Summarize
                  </button>
                  {fileError && <p role="alert" className="text-xs text-rose-700">{fileError}</p>}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
