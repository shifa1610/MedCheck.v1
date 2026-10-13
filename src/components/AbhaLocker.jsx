import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Download, 
  Upload, 
  CheckCircle2, 
  ExternalLink, 
  Lock, 
  Key, 
  Server, 
  FileCheck, 
  ArrowRight, 
  RefreshCw,
  Copy,
  Check,
  AlertCircle
} from 'lucide-react';
import { recordToFHIRBundle } from '../types/fhir';
import { TRANSLATIONS } from '../data/translations';

export default function AbhaLocker({ patient, records, setRecords, language }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  
  const [abhaInput, setAbhaInput] = useState(patient.abhaId || '');
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLinked, setIsLinked] = useState(Boolean(patient.abhaId));
  const [consentGranted, setConsentGranted] = useState(Boolean(patient.abhaId));
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Generate FHIR bundle of all records
  const compositeBundle = {
    resourceType: "Bundle",
    id: `abdm-composite-${patient.id}`,
    meta: {
      lastUpdated: new Date().toISOString(),
      profile: ["https://nrces.in/ndhm/fhir/r4/StructureDefinition/DocumentBundle"]
    },
    type: "document",
    entry: records.flatMap(r => recordToFHIRBundle(r, patient).entry)
  };

  const handleSendOtp = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setOtpSent(true);
      setStatusMessage('Mock OTP sent to linked Aadhaar mobile (+91 ******456). Use mock code: 458921');
    }, 700);
  };

  const handleVerifyOtp = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsLinked(true);
      setOtpSent(false);
      setStatusMessage('ABHA ID successfully verified and linked with ABDM Health Locker!');
    }, 800);
  };

  const handleDownloadFhir = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(compositeBundle, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ABDM_FHIR_Records_${patient.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyBundle = () => {
    navigator.clipboard.writeText(JSON.stringify(compositeBundle, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImportFhir = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (json.resourceType === 'Bundle' || json.resourceType === 'DiagnosticReport') {
          setStatusMessage(`Successfully imported FHIR R4 Bundle with ${json.entry?.length || 1} entries!`);
        } else {
          setStatusMessage('File imported, but did not match standard FHIR Bundle schema.');
        }
      } catch (err) {
        setStatusMessage('Error parsing FHIR JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{t.abha.title}</h2>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  ABDM Sandbox Ready
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {t.abha.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadFhir}
              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>{t.abha.exportFhir}</span>
            </button>
          </div>
        </div>

        {/* Student Project Demonstration Disclaimer Banner */}
        <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Educational Demonstration Disclaimer:</strong> This module illustrates the data architecture of India's Ayushman Bharat Digital Mission (ABDM) and Fast Healthcare Interoperability Resources (FHIR R4). All ABHA numbers, OTP flows, and patient tokens shown are mock demo data. Live government ABDM integration requires official Sandbox certificates and certified cryptographic hardware.
          </div>
        </div>

        {/* Record Locker Interface (Listing available records & source) */}
        <div className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                Available Health Records Locker ({records.length})
              </h3>
              <p className="text-[11px] text-slate-500">Records currently indexed for {patient.name} with source provenance</p>
            </div>
            <button
              onClick={handleDownloadFhir}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export All as FHIR R4 Bundle</span>
            </button>
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2 px-3">Record Title</th>
                  <th className="py-2 px-3">Source Facility</th>
                  <th className="py-2 px-3">Clinician</th>
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">FHIR Resource</th>
                  <th className="py-2 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((r, i) => (
                  <tr key={i} className="hover:bg-white/80 transition-colors">
                    <td className="py-2 px-3 font-bold text-slate-900">{r.title}</td>
                    <td className="py-2 px-3 text-slate-600">{r.facility || 'Verified Clinic'}</td>
                    <td className="py-2 px-3 text-slate-600">{r.doctor || 'Registered Physician'}</td>
                    <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">{r.date}</td>
                    <td className="py-2 px-3 text-emerald-800 font-mono text-[11px]">
                      {r.type === 'prescription' ? 'MedicationRequest' : 'DiagnosticReport'}
                    </td>
                    <td className="py-2 px-3 text-right">
                      <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                        ABDM Ready (Mock)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {statusMessage && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{statusMessage}</span>
            </div>
            <button onClick={() => setStatusMessage('')} className="text-emerald-700 hover:text-emerald-900 text-xs font-bold cursor-pointer">Dismiss</button>
          </div>
        )}

        {/* ABHA Link & Verification Card */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-teal-600" />
                {t.abha.linkTitle}
              </h3>
              {isLinked && (
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {t.abha.verifiedBadge}
                </span>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  14-Digit ABHA Number
                </label>
                <input
                  type="text"
                  value={abhaInput}
                  onChange={(e) => setAbhaInput(e.target.value)}
                  placeholder="91-XXXX-XXXX-XXXX"
                  className="w-full text-xs font-mono px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  ABHA Address (PHR Handle)
                </label>
                <input
                  type="text"
                  value={patient.abhaAddress || 'Not linked'}
                  readOnly
                  className="w-full text-xs font-mono px-3 py-2 bg-slate-100/80 rounded-xl border border-slate-200 text-slate-600 cursor-not-allowed"
                />
              </div>

              {otpSent && (
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Enter Mock Aadhaar OTP (Enter: 458921)
                  </label>
                  <input
                    type="text"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="458921"
                    className="w-full text-xs font-mono px-3 py-2 bg-white rounded-xl border border-teal-400 focus:outline-hidden"
                  />
                </div>
              )}

              <div className="pt-2">
                {!otpSent ? (
                  <button
                    onClick={handleSendOtp}
                    disabled={isVerifying}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold py-2 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    {isVerifying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Key className="w-3.5 h-3.5" />}
                    <span>Simulate ABHA OTP Authentication</span>
                  </button>
                ) : (
                  <button
                    onClick={handleVerifyOtp}
                    disabled={isVerifying}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    {isVerifying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span>Confirm & Link ABHA ID</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ABDM Consent Manager Simulator */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Server className="w-4 h-4 text-indigo-600" />
                {t.abha.consentManager}
              </h3>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                consentGranted ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'
              }`}>
                {consentGranted ? 'Active Consent Artifact' : 'Consent Pending'}
              </span>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <div className="text-[11px] font-bold text-slate-900 mb-1">HIP & HIU Data Exchange Flow:</div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 py-1 border-b border-slate-100">
                  <span>Health Information Provider (HIP):</span>
                  <span className="font-semibold text-slate-800">Apollo / Fortis / Max</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 py-1 border-b border-slate-100">
                  <span>Health Information User (HIU):</span>
                  <span className="font-semibold text-slate-800">MedCheck AI Health Copilot</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 py-1">
                  <span>Consent Permission:</span>
                  <span className="font-semibold text-emerald-700">View & Encrypted Analysis</span>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setConsentGranted(!consentGranted)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-colors ${
                    consentGranted 
                      ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {consentGranted ? t.abha.revokeConsent : t.abha.grantConsent}
                </button>

                <label className="flex-1 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-center cursor-pointer transition-colors flex items-center justify-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t.abha.importFhir}</span>
                  <input type="file" accept=".json" onChange={handleImportFhir} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* FHIR Standard Specification Reference */}
        <div className="mt-8 bg-slate-950 text-slate-100 rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                FHIR R4 Standardized Schema Compliance
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {t.abha.fhirSpec}
              </div>
            </div>

            <button
              onClick={handleCopyBundle}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-xs px-3 py-1.5 rounded-lg text-slate-200 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Full Bundle'}</span>
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <span className="text-teal-400 font-mono font-bold block">Patient</span>
              <span className="text-[11px] text-slate-400">Identified via ABHA number & address</span>
            </div>
            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <span className="text-sky-400 font-mono font-bold block">DiagnosticReport</span>
              <span className="text-[11px] text-slate-400">Lab panels & discharge summaries</span>
            </div>
            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <span className="text-purple-400 font-mono font-bold block">MedicationRequest</span>
              <span className="text-[11px] text-slate-400">Dosages, timings, and durations</span>
            </div>
            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <span className="text-amber-400 font-mono font-bold block">Observation</span>
              <span className="text-[11px] text-slate-400">LOINC mapped biomarker values</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
