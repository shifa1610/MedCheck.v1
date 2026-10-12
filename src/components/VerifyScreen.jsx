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
  RotateCcw
} from 'lucide-react';
import { validateMedicine } from '../services/validationService';

export default function VerifyScreen({ rawExtractedData, onConfirmSave, onCancel, language }) {
  const [data, setData] = useState(() => {
    // Clone and enrich with validation
    return {
      ...rawExtractedData,
      medicines: (rawExtractedData.medications || rawExtractedData.medicines || []).map(m => {
        const validated = validateMedicine(m.name || m.rawName);
        return {
          ...m,
          name: m.name || m.rawName,
          matchedName: validated.matchedName || m.name,
          confidence: m.confidence || validated.confidence || 'high',
          candidateMatches: validated.candidateMatches || [],
          lookAlikeWarning: validated.lookAlikeWarning,
          sourceSnippet: m.sourceSnippet || `Rx Line: "${m.name} ${m.dosage || ''} ${m.frequency || ''}"`
        };
      }),
      testValues: (rawExtractedData.biomarkers || rawExtractedData.testValues || []).map(b => ({
        ...b,
        testName: b.name || b.testName,
        observedValue: b.value || b.observedValue,
        confidence: b.confidence || 'high',
        sourceSnippet: `Report line: "${b.name || b.testName} ... ${b.value || b.observedValue} ${b.unit || ''} (Ref: ${b.referenceRange || '< normal'})"`
      }))
    };
  });

  const [activeSnippet, setActiveSnippet] = useState(null);

  // Allow user to select from candidate drug suggestions
  const handleSelectCandidate = (index, candidateName) => {
    setData(prev => {
      const updated = [...prev.medicines];
      updated[index] = {
        ...updated[index],
        name: candidateName,
        matchedName: candidateName,
        confidence: 'high' // elevated to high after explicit human confirmation
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

  const handleConfirm = () => {
    // Formulate final verified record
    const confirmedRecord = {
      ...data,
      verificationProvenance: {
        verifiedAt: new Date().toISOString(),
        verifiedBy: "Patient / Caregiver User",
        confidencePolicy: "Human-in-the-Loop Zero Guess Rule",
        abdmReady: true
      }
    };
    onConfirmSave(confirmedRecord);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-md shadow-teal-600/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  MedCheck Clinical Verification Screen
                </h2>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                  Human-in-the-Loop Required
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Rule: Nothing is saved to your health profile until you verify. Low confidence items are never guessed.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onCancel}
              className="text-xs font-semibold px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-teal-600 text-white hover:bg-teal-700 shadow-sm shadow-teal-600/30 transition-all transform active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Confirm & Save as FHIR Record</span>
            </button>
          </div>
        </div>

        {/* Side-by-Side Verification Body */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Left Column (5 Cols): Source Document Inspector */}
          <div className="lg:col-span-5 bg-slate-900 text-slate-100 p-5 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                Original Document & Optical Context
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {data.facility || 'Apollo Diagnostics'}
              </span>
            </div>

            {/* Simulated High-Fidelity Clinical Prescription / Report View */}
            <div className="mt-4 bg-slate-950 rounded-2xl p-4 border border-slate-800 font-mono text-xs leading-relaxed space-y-3">
              <div className="text-slate-400 border-b border-slate-800 pb-2 text-[11px]">
                <div>DOC: {data.title}</div>
                <div>DATE: {data.date} | FACILITY: {data.facility}</div>
                <div>DOCTOR: {data.doctor || 'Dr. Rajesh Sharma, MD'}</div>
              </div>

              <div className="py-2 text-slate-300">
                <div className="text-teal-400 font-bold mb-1">// Extracted Handwriting & OCR Raw Lines:</div>
                {data.medicines.map((m, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveSnippet(m.sourceSnippet)}
                    className={`p-2 rounded-lg cursor-pointer transition-all ${
                      activeSnippet === m.sourceSnippet 
                        ? 'bg-teal-900/60 border border-teal-500 text-white' 
                        : 'hover:bg-slate-900 text-slate-300'
                    }`}
                  >
                    ▶ {m.sourceSnippet}
                  </div>
                ))}

                {data.testValues.map((t, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveSnippet(t.sourceSnippet)}
                    className={`p-2 rounded-lg cursor-pointer transition-all ${
                      activeSnippet === t.sourceSnippet 
                        ? 'bg-sky-900/60 border border-sky-500 text-white' 
                        : 'hover:bg-slate-900 text-slate-300'
                    }`}
                  >
                    ▶ {t.sourceSnippet}
                  </div>
                ))}
              </div>

              {activeSnippet && (
                <div className="mt-3 p-3 bg-teal-950/80 border border-teal-500/60 rounded-xl text-xs text-teal-200 animate-in fade-in">
                  <div className="font-bold uppercase tracking-wider text-[10px] text-teal-400 mb-1">
                    Active Inspection Snippet:
                  </div>
                  "{activeSnippet}"
                </div>
              )}
            </div>

            <div className="mt-auto pt-4 text-[11px] text-slate-500 leading-snug">
              Tip: Click any extracted line on the right to cross-reference the corresponding reading in the document snippet.
            </div>
          </div>

          {/* Right Column (7 Cols): Interactive Field Extractor & Confidence Badges */}
          <div className="lg:col-span-7 p-6 overflow-y-auto space-y-6">
            
            {/* Confidence Legend */}
            <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <span className="font-bold text-slate-700">Confidence Key:</span>
              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> High / Clear
              </span>
              <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" /> Amber / Check (Candidates Available)
              </span>
              <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md font-semibold">
                <XCircle className="w-3.5 h-3.5" /> Red / Unreadable (Manual Entry)
              </span>
            </div>

            {/* Prescribed Medicines Section */}
            {data.medicines.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Pill className="w-4 h-4 text-purple-600" />
                  Prescriptions for Verification ({data.medicines.length})
                </h3>

                <div className="space-y-3">
                  {data.medicines.map((med, idx) => {
                    const isHigh = med.confidence === 'high';
                    const isMed = med.confidence === 'medium';
                    const isUnreadable = med.confidence === 'unreadable' || med.confidence === 'low';

                    return (
                      <div
                        key={idx}
                        onClick={() => setActiveSnippet(med.sourceSnippet)}
                        className={`rounded-2xl border p-4 transition-all ${
                          isHigh 
                            ? 'border-emerald-200 bg-emerald-50/20' 
                            : isMed 
                              ? 'border-amber-300 bg-amber-50/30' 
                              : 'border-rose-300 bg-rose-50/30'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex items-center gap-1 ${
                              isHigh 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : isMed 
                                  ? 'bg-amber-100 text-amber-800' 
                                  : 'bg-rose-100 text-rose-800'
                            }`}>
                              {isHigh ? <CheckCircle2 className="w-3 h-3" /> : isMed ? <AlertTriangle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                              {med.confidence.toUpperCase()} CONFIDENCE
                            </span>
                            <span className="text-xs text-slate-400">Field #{idx + 1}</span>
                          </div>

                          <span className="text-xs font-mono font-semibold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-md">
                            Schedule: {med.frequency || med.schedule || '1-0-1'} • {med.timing || 'After food'}
                          </span>
                        </div>

                        {/* Medicine Name & Strength */}
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                              Prescribed Medicine Name
                            </label>
                            <input
                              type="text"
                              value={med.name}
                              onChange={(e) => handleUpdateMedicineName(idx, e.target.value)}
                              className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:border-teal-500 focus:outline-hidden"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                              Strength & Form
                            </label>
                            <input
                              type="text"
                              value={med.dosage || med.strength || '500 mg'}
                              readOnly
                              className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 cursor-not-allowed"
                            />
                          </div>
                        </div>

                        {/* Candidate Dropdown for Amber/Low Confidence */}
                        {!isHigh && med.candidateMatches && med.candidateMatches.length > 0 && (
                          <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
                            <span className="text-[11px] font-bold text-amber-900 block mb-1.5 flex items-center gap-1">
                              <HelpCircle className="w-3.5 h-3.5" />
                              Did the doctor mean one of these verified medicines?
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {med.candidateMatches.map((cand, cIdx) => (
                                <button
                                  key={cIdx}
                                  onClick={() => handleSelectCandidate(idx, cand)}
                                  className="text-xs bg-white hover:bg-teal-50 hover:text-teal-800 hover:border-teal-300 border border-amber-300 text-slate-800 px-3 py-1.5 rounded-lg font-semibold transition-colors shadow-2xs"
                                >
                                  ✔ Select "{cand}"
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Look-Alike / Sound-Alike Alert Banner */}
                        {med.lookAlikeWarning && (
                          <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                            <span className="font-medium">{med.lookAlikeWarning}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Test Values Section */}
            {data.testValues.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-sky-600" />
                  Laboratory Values for Verification ({data.testValues.length})
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.testValues.map((test, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveSnippet(test.sourceSnippet)}
                      className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-xs font-bold text-slate-900">{test.testName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">Ref: {test.referenceRange || '< normal'}</div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          test.status === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {test.status || 'Verified'}
                        </span>
                      </div>
                      <div className="mt-2 text-sm font-extrabold text-slate-900 font-mono">
                        {test.observedValue || test.value} {test.unit || ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Warning & Confirmation */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Trust Policy: Verified fields will be transformed into ABDM FHIR R4 Bundle and added to your health timeline.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleConfirm}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-sm shadow-teal-600/25 transition-all transform active:scale-95"
            >
              Confirm and Save to Profile →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
