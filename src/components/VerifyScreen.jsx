import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ShieldCheck, 
  FileText, 
  ArrowRight, 
  Eye, 
  Pill, 
  Activity, 
  HelpCircle,
  AlertCircle,
  Save,
  RotateCcw,
  Check,
  Edit3
} from 'lucide-react';
import { validateMedicine } from '../services/validationService';

// Default sample data used if user opens Verify Review directly
const DEFAULT_SAMPLE_RECORD = {
  title: "Clinical Prescription & Lab Orders",
  facility: "Fortis Escorts Heart Clinic",
  doctor: "Dr. Rajesh Sharma, MD (Cardiology)",
  date: "2026-03-20",
  verificationStatus: "Pending Review",
  medications: [
    {
      name: "Metformin 500mg",
      dosage: "500mg",
      frequency: "1-0-1 after food (भोजन के बाद)",
      confidence: "high",
      status: "Verified",
      sourceSnippet: 'Rx Line 1: "Tab Metformin 500mg 1-0-1 after food (भोजन के बाद)"'
    },
    {
      name: "Telmisartan 40mg",
      dosage: "40mg",
      frequency: "1-0-0 morning",
      confidence: "medium",
      status: "Pending Review",
      candidateMatches: ["Telmisartan 40mg", "Telma 40mg", "Telmikem 40mg"],
      sourceSnippet: 'Rx Line 2: "Tab Telmisartn 40mg 1-0-0 morning - BP control"'
    },
    {
      name: "Atorvastatin 20mg",
      dosage: "20mg",
      frequency: "0-0-1 bedtime",
      confidence: "high",
      status: "Verified",
      sourceSnippet: 'Rx Line 3: "Tab Atorvastatin 20mg 0-0-1 QHS - Post Stent"'
    }
  ],
  biomarkers: [
    {
      name: "Fasting Blood Sugar",
      value: "142",
      unit: "mg/dL",
      referenceRange: "70 - 100",
      status: "Needs Correction",
      confidence: "medium",
      sourceSnippet: 'Lab Line 4: "FBS: 142 mg/dL (Reference Range: 70-100 mg/dL)"'
    },
    {
      name: "HbA1c",
      value: "8.2",
      unit: "%",
      referenceRange: "< 5.7",
      status: "Verified",
      confidence: "high",
      sourceSnippet: 'Lab Line 5: "HbA1c: 8.2% (Reference: < 5.7% Normal, 5.7-6.4% Prediabetes)"'
    }
  ]
};

export default function VerifyScreen({ 
  rawExtractedData, 
  onConfirmSave, 
  onCancel, 
  language,
  isModal = false 
}) {
  const [data, setData] = useState(() => {
    const base = rawExtractedData || DEFAULT_SAMPLE_RECORD;
    return {
      ...base,
      title: base.title || "Clinical Prescription & Lab Orders",
      facility: base.facility || "Fortis Escorts Heart Clinic",
      doctor: base.doctor || "Dr. Rajesh Sharma, MD",
      date: base.date || "2026-03-20",
      verificationStatus: base.verificationStatus || "Pending Review",
      medicines: (base.medications || base.medicines || []).map(m => {
        const validated = validateMedicine(m.name || m.rawName);
        return {
          ...m,
          name: m.name || m.rawName,
          dosage: m.dosage || '500mg',
          matchedName: validated.matchedName || m.name,
          confidence: m.confidence || validated.confidence || 'high',
          status: m.status || (m.confidence === 'high' ? 'Verified' : 'Pending Review'),
          candidateMatches: m.candidateMatches || validated.candidateMatches || [],
          lookAlikeWarning: validated.lookAlikeWarning,
          sourceSnippet: m.sourceSnippet || `Rx Line: "${m.name} ${m.dosage || ''} ${m.frequency || ''}"`
        };
      }),
      testValues: (base.biomarkers || base.testValues || []).map(b => ({
        ...b,
        testName: b.name || b.testName,
        observedValue: b.value || b.observedValue,
        confidence: b.confidence || 'high',
        status: b.status || 'Verified',
        sourceSnippet: b.sourceSnippet || `Report line: "${b.name || b.testName} ... ${b.value || b.observedValue} ${b.unit || ''} (Ref: ${b.referenceRange || '< normal'})"`
      }))
    };
  });

  const [activeSnippet, setActiveSnippet] = useState(null);
  const [overallStatus, setOverallStatus] = useState('Pending Review');
  const [saveToast, setSaveToast] = useState(false);

  const handleSelectCandidate = (index, candidateName) => {
    setData(prev => {
      const updated = [...prev.medicines];
      updated[index] = {
        ...updated[index],
        name: candidateName,
        matchedName: candidateName,
        confidence: 'high',
        status: 'Verified'
      };
      return { ...prev, medicines: updated };
    });
  };

  const handleUpdateMedicineName = (index, newName) => {
    setData(prev => {
      const updated = [...prev.medicines];
      updated[index] = { ...updated[index], name: newName };
      return { ...prev, medicines: updated };
    });
  };

  const handleUpdateMedicineStatus = (index, newStatus) => {
    setData(prev => {
      const updated = [...prev.medicines];
      updated[index] = { ...updated[index], status: newStatus };
      return { ...prev, medicines: updated };
    });
  };

  const handleUpdateTestStatus = (index, newStatus) => {
    setData(prev => {
      const updated = [...prev.testValues];
      updated[index] = { ...updated[index], status: newStatus };
      return { ...prev, testValues: updated };
    });
  };

  const handleConfirm = () => {
    const confirmedRecord = {
      ...data,
      verificationStatus: overallStatus,
      verificationProvenance: {
        verifiedAt: new Date().toISOString(),
        verifiedBy: "User (Human Verification)",
        confidencePolicy: "Human-in-the-Loop Zero Guess Rule",
        status: overallStatus
      }
    };
    if (onConfirmSave) {
      onConfirmSave(confirmedRecord);
    } else {
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 3000);
    }
  };

  const content = (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-emerald-50/50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Verify Review — Clinical Extracted Data
              </h2>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                overallStatus === 'Verified'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : overallStatus === 'Needs Correction'
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
              }`}>
                {overallStatus}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Check, correct, and confirm extracted fields against the original document evidence before saving
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status selector */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs">
            <span className="font-semibold text-slate-600">Review Status:</span>
            <select
              value={overallStatus}
              onChange={(e) => setOverallStatus(e.target.value)}
              className="font-bold text-slate-800 bg-transparent focus:outline-hidden cursor-pointer"
            >
              <option value="Pending Review">Pending Review</option>
              <option value="Verified">Verified</option>
              <option value="Needs Correction">Needs Correction</option>
            </select>
          </div>

          {onCancel && (
            <button
              onClick={onCancel}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Close
            </button>
          )}

          <button
            onClick={handleConfirm}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer shadow-xs"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Confirm & Save</span>
          </button>
        </div>
      </div>

      {saveToast && (
        <div className="bg-emerald-600 text-white text-xs px-4 py-2 font-medium flex items-center justify-between">
          <span>✓ Record verified and saved to personal health records.</span>
          <button onClick={() => setSaveToast(false)} className="text-white font-bold ml-2">✕</button>
        </div>
      )}

      {/* Side-by-Side Verification Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        
        {/* Left Column (5 Cols): Source Document Inspector */}
        <div className="lg:col-span-5 bg-slate-50 p-4 sm:p-5 flex flex-col space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-600" />
              Original Document Snippets
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              {data.facility}
            </span>
          </div>

          <div className="bg-white rounded-xl p-3.5 border border-slate-200 text-xs space-y-2">
            <div className="text-[11px] text-slate-500 pb-2 border-b border-slate-100">
              <span className="font-semibold text-slate-700">Document:</span> {data.title}
              <br />
              <span className="font-semibold text-slate-700">Doctor:</span> {data.doctor} • {data.date}
            </div>

            <div className="space-y-1.5 pt-1">
              <p className="text-[11px] font-bold text-slate-700">Click a snippet to inspect:</p>
              {data.medicines.map((m, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveSnippet(m.sourceSnippet)}
                  className={`p-2 rounded-lg cursor-pointer text-xs transition-colors font-mono ${
                    activeSnippet === m.sourceSnippet 
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold' 
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {m.sourceSnippet}
                </div>
              ))}

              {data.testValues.map((t, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveSnippet(t.sourceSnippet)}
                  className={`p-2 rounded-lg cursor-pointer text-xs transition-colors font-mono ${
                    activeSnippet === t.sourceSnippet 
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold' 
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {t.sourceSnippet}
                </div>
              ))}
            </div>
          </div>

          {activeSnippet && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950">
              <div className="font-bold text-[11px] text-emerald-800 mb-1">
                Active Cross-Reference Snippet:
              </div>
              <p className="font-mono text-[11px]">{activeSnippet}</p>
            </div>
          )}

          <div className="text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
            <strong>Human Verification Principle:</strong> Medical AI must never guess unreadable characters. If a medicine or dose is ambiguous, review the original snippet and correct it manually.
          </div>
        </div>

        {/* Right Column (7 Cols): Interactive Field Extractor */}
        <div className="lg:col-span-7 p-4 sm:p-5 space-y-5">
          
          {/* Prescriptions Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-emerald-600" />
                Prescribed Medications ({data.medicines.length})
              </h3>
              <span className="text-[11px] text-slate-500">Edit fields directly to correct errors</span>
            </div>

            <div className="space-y-3">
              {data.medicines.map((med, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-emerald-300 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700">Med #{idx + 1}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        med.confidence === 'high' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {med.confidence.toUpperCase()} CONFIDENCE
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-500">Status:</span>
                      <select
                        value={med.status}
                        onChange={(e) => handleUpdateMedicineStatus(idx, e.target.value)}
                        className={`text-xs font-semibold px-2 py-0.5 rounded border cursor-pointer ${
                          med.status === 'Verified'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : med.status === 'Needs Correction'
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        <option value="Pending Review">Pending Review</option>
                        <option value="Verified">Verified</option>
                        <option value="Needs Correction">Needs Correction</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Medicine Name
                      </label>
                      <input
                        type="text"
                        value={med.name}
                        onChange={(e) => handleUpdateMedicineName(idx, e.target.value)}
                        className="w-full text-xs font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Dosage & Schedule
                      </label>
                      <input
                        type="text"
                        value={`${med.dosage || ''} • ${med.frequency || ''}`}
                        readOnly
                        className="w-full text-xs text-slate-600 bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Candidate matches if confidence is not high */}
                  {med.candidateMatches && med.candidateMatches.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] text-slate-500">Suggestions:</span>
                      {med.candidateMatches.map((cand, cIdx) => (
                        <button
                          key={cIdx}
                          onClick={() => handleSelectCandidate(idx, cand)}
                          className="text-[11px] bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 px-2 py-0.5 rounded border border-slate-200 transition-colors cursor-pointer"
                        >
                          ✔ {cand}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Test Values Section */}
          {data.testValues.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  Extracted Lab Test Values ({data.testValues.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.testValues.map((test, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-200 bg-white shadow-2xs"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs font-bold text-slate-900">{test.testName}</div>
                        <div className="text-[10px] text-slate-500">Ref: {test.referenceRange || 'Standard'}</div>
                      </div>
                      <select
                        value={test.status}
                        onChange={(e) => handleUpdateTestStatus(idx, e.target.value)}
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border cursor-pointer ${
                          test.status === 'Verified'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}
                      >
                        <option value="Verified">Verified</option>
                        <option value="Pending Review">Pending Review</option>
                        <option value="Needs Correction">Needs Correction</option>
                      </select>
                    </div>

                    <div className="mt-2 text-sm font-bold text-slate-900">
                      {test.observedValue || test.value} {test.unit || ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        <div className="max-w-5xl w-full my-6">
          {content}
        </div>
      </div>
    );
  }

  return content;
}
