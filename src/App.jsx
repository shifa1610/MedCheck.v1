import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HealthSummary from './components/HealthSummary';
import HealthTimeline from './components/HealthTimeline';
import BiomarkerTrends from './components/BiomarkerTrends';
import MedicationTracker from './components/MedicationTracker';
import AbhaLocker from './components/AbhaLocker';
import CopilotChat from './components/CopilotChat';
import ArchitectureView from './components/ArchitectureView';
import PresentationSlides from './components/PresentationSlides';
import UploadModal from './components/UploadModal';
import VerifyScreen from './components/VerifyScreen';
import AccuracyDashboard from './components/AccuracyDashboard';
import VisitPrepBrief from './components/VisitPrepBrief';
import LanguageConverter from './components/LanguageConverter';
import MedicineConflictDetector from './components/MedicineConflictDetector';

import { 
  FAMILY_MEMBERS, 
  INITIAL_PATIENT, 
  INITIAL_RECORDS, 
  PAPA_RECORDS, 
  MAA_RECORDS, 
  SELF_RECORDS,
  PAPA_TREND_SERIES,
  MAA_TREND_SERIES,
  SELF_TREND_SERIES
} from './data/mockRecords';
import { TRANSLATIONS } from './data/translations';
import { 
  HeartPulse, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Pill, 
  ShieldCheck, 
  Upload, 
  Sparkles,
  ArrowRight, 
  TrendingUp,
  FileText,
  Printer,
  Award,
  CheckSquare,
  GitCompare,
  Users,
  Volume2
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [currentFamilyKey, setCurrentFamilyKey] = useState('papa');
  const [patient, setPatient] = useState(FAMILY_MEMBERS.papa);
  const [records, setRecords] = useState(PAPA_RECORDS);
  const [language, setLanguage] = useState(FAMILY_MEMBERS.papa.preferredLanguage || 'en');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [pendingVerificationRecord, setPendingVerificationRecord] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Handle switching family profiles (Papa -> Maa -> Self)
  const handleFamilyMemberChange = (key) => {
    setCurrentFamilyKey(key);
    const selected = FAMILY_MEMBERS[key] || FAMILY_MEMBERS.papa;
    setPatient(selected);
    if (key === 'papa') {
      setRecords(PAPA_RECORDS);
      setLanguage(selected.preferredLanguage || 'te');
    } else if (key === 'maa') {
      setRecords(MAA_RECORDS);
      setLanguage(selected.preferredLanguage || 'hi');
    } else {
      setRecords(SELF_RECORDS);
      setLanguage(selected.preferredLanguage || 'en');
    }
    setToastMessage(`Switched profile to ${selected.name} (${selected.relation})`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Called when raw OCR finishes -> sends record to Human-in-the-Loop Verify Screen
  const handleRawRecordExtracted = (rawRecord) => {
    setPendingVerificationRecord(rawRecord);
    setCurrentTab('verify');
    setToastMessage(`Record extracted! Please review on the Verify Screen before saving.`);
    setTimeout(() => setToastMessage(''), 5000);
  };

  // Called when user clicks "Confirm & Save" on the Verify Screen
  const handleVerifyConfirmed = (verifiedRecord) => {
    setRecords(prev => [verifiedRecord, ...prev]);
    setPendingVerificationRecord(null);
    setCurrentTab('timeline');
    setToastMessage(`✓ Record confirmed and saved as ABDM FHIR resource!`);
    setTimeout(() => setToastMessage(''), 6000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-800 flex items-center gap-3 text-xs animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage('')} className="ml-2 text-slate-400 hover:text-white font-bold">✕</button>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        language={language}
        setLanguage={setLanguage}
        patient={patient}
        currentFamilyKey={currentFamilyKey}
        onFamilyMemberChange={handleFamilyMemberChange}
        onOpenUpload={() => setIsUploadOpen(true)}
        pendingVerificationCount={pendingVerificationRecord ? 1 : 0}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Verification Screen Modal or Tab */}
        {currentTab === 'verify' && pendingVerificationRecord && (
          <VerifyScreen
            rawExtractedData={pendingVerificationRecord}
            onConfirmSave={handleVerifyConfirmed}
            onCancel={() => {
              setPendingVerificationRecord(null);
              setCurrentTab('dashboard');
            }}
            language={language}
          />
        )}

        {currentTab === 'verify' && !pendingVerificationRecord && (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
              <CheckSquare className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">No Pending Clinical Records for Review</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Upload a prescription or lab report to experience MedCheck's side-by-side verification workflow with confidence scoring and candidate drug suggestions.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setIsUploadOpen(true)}
                className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
              >
                + Upload or Test Sample
              </button>
              <button
                onClick={() => handleRawRecordExtracted(records[1] || records[0])}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
              >
                Review Sample Rx (Bilingual)
              </button>
            </div>
          </div>
        )}

        {/* Tab: Dashboard */}
        {currentTab === 'dashboard' && (
          <div className="mb-8 space-y-6">
            
            {/* Family Caregiver Context Banner */}
            <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-sky-950 text-white rounded-3xl p-5 sm:p-6 shadow-md border border-teal-800/40">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/30 text-2xl flex items-center justify-center shrink-0">
                    {patient.avatarIcon || "👨‍🦳"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-teal-400 text-slate-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider">
                        Family Caregiver Mode
                      </span>
                      <span className="text-xs text-teal-200">
                        Managing {patient.relation}: <strong>{patient.name}</strong> ({patient.age}y)
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
                      {patient.caregiverSummary || "MedCheck helps you organize and understand health records in simple language, with voice, and flags conflicting doses across medical papers without ever diagnosing."}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => setCurrentTab('compare')}
                    className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold px-3.5 py-2.5 rounded-xl transition-all shadow-sm"
                  >
                    <GitCompare className="w-4 h-4 text-amber-950" />
                    <span>Compare Documents & Conflicts</span>
                  </button>

                  <button
                    onClick={() => setCurrentTab('converter')}
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl border border-white/20 transition-all"
                  >
                    <Volume2 className="w-4 h-4 text-teal-300" />
                    <span>Regional Voice</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Top Patient Profile Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Left: Patient Info */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-700 text-white font-bold text-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h1 className="text-xl font-bold text-slate-900">{patient.name}</h1>
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        ABDM-Ready (Mock ABHA)
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500">
                      <span>{patient.age} {t.patient?.yearsOld || "years"} • {patient.gender}</span>
                      <span>•</span>
                      <span>{t.patient?.bloodGroup || "Blood Group"}: <strong className="text-slate-800">{patient.bloodGroup}</strong></span>
                      <span>•</span>
                      <span className="font-mono text-slate-700">{patient.abhaAddress}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                        {t.patient?.activeConditions || "Active Conditions"}:
                      </span>
                      {patient.activeConditions.map((cond, i) => (
                        <span key={i} className="bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-medium px-2 py-0.5 rounded-md">
                          {cond}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Quick Action Cards */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => setCurrentTab('visitprep')}
                    className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all shadow-xs"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Visit-Prep Brief</span>
                  </button>

                  <button
                    onClick={() => setCurrentTab('accuracy')}
                    className="inline-flex items-center gap-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-colors"
                  >
                    <Award className="w-4 h-4 text-teal-600" />
                    <span>Accuracy Benchmark</span>
                  </button>

                  <button
                    onClick={() => setCurrentTab('copilot')}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-xs transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Ask Copilot</span>
                  </button>
                </div>
              </div>

              {/* Vitals Quick Gauge Row */}
              <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {currentFamilyKey === 'papa' && (
                  <>
                    <div className="bg-rose-50/60 border border-rose-200/80 rounded-2xl p-3.5">
                      <div className="flex items-center justify-between text-xs text-rose-800 font-semibold mb-1">
                        <span>HbA1c (3-Mo Sugar)</span>
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      </div>
                      <div className="text-xl font-extrabold text-rose-900">8.2 %</div>
                      <div className="text-[10px] text-rose-700 font-medium mt-1">Above Printed Ref (&lt; 5.7%)</div>
                    </div>

                    <div className="bg-rose-50/60 border border-rose-200/80 rounded-2xl p-3.5">
                      <div className="flex items-center justify-between text-xs text-rose-800 font-semibold mb-1">
                        <span>Fasting Blood Sugar</span>
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      </div>
                      <div className="text-xl font-extrabold text-rose-900">142 mg/dL</div>
                      <div className="text-[10px] text-rose-700 font-medium mt-1">Above Printed Ref (70-100)</div>
                    </div>

                    <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-3.5">
                      <div className="flex items-center justify-between text-xs text-amber-800 font-semibold mb-1">
                        <span>LDL Bad Cholesterol</span>
                        <Activity className="w-3.5 h-3.5 text-amber-600" />
                      </div>
                      <div className="text-xl font-extrabold text-amber-900">154 mg/dL</div>
                      <div className="text-[10px] text-amber-700 font-medium mt-1">Above Printed Ref (&lt; 100)</div>
                    </div>

                    <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-3.5">
                      <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold mb-1">
                        <span>Kidney Creatinine</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <div className="text-xl font-extrabold text-emerald-900">1.05 mg/dL</div>
                      <div className="text-[10px] text-emerald-700 font-medium mt-1">Within Printed Ref (0.7 - 1.3)</div>
                    </div>
                  </>
                )}

                {currentFamilyKey === 'maa' && (
                  <>
                    <div className="bg-rose-50/60 border border-rose-200/80 rounded-2xl p-3.5">
                      <div className="flex items-center justify-between text-xs text-rose-800 font-semibold mb-1">
                        <span>TSH (Thyroid)</span>
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      </div>
                      <div className="text-xl font-extrabold text-rose-900">7.8 uIU/mL</div>
                      <div className="text-[10px] text-rose-700 font-medium mt-1">Elevated Ref (0.4 - 4.2)</div>
                    </div>

                    <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-3.5">
                      <div className="flex items-center justify-between text-xs text-amber-800 font-semibold mb-1">
                        <span>Vitamin D Total</span>
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      </div>
                      <div className="text-xl font-extrabold text-amber-900">14.2 ng/mL</div>
                      <div className="text-[10px] text-amber-700 font-medium mt-1">Deficient Ref (30 - 100)</div>
                    </div>

                    <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-3.5">
                      <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold mb-1">
                        <span>Serum Calcium</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <div className="text-xl font-extrabold text-emerald-900">9.2 mg/dL</div>
                      <div className="text-[10px] text-emerald-700 font-medium mt-1">Normal Ref (8.5 - 10.5)</div>
                    </div>

                    <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-3.5">
                      <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold mb-1">
                        <span>Blood Pressure</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <div className="text-xl font-extrabold text-emerald-900">130/84 mmHg</div>
                      <div className="text-[10px] text-emerald-700 font-medium mt-1">Controlled</div>
                    </div>
                  </>
                )}

                {currentFamilyKey === 'self' && (
                  <>
                    <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-3.5">
                      <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold mb-1">
                        <span>HbA1c</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <div className="text-xl font-extrabold text-emerald-900">5.2 %</div>
                      <div className="text-[10px] text-emerald-700 font-medium mt-1">Optimal (&lt; 5.7%)</div>
                    </div>

                    <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-3.5">
                      <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold mb-1">
                        <span>Fasting Glucose</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <div className="text-xl font-extrabold text-emerald-900">88 mg/dL</div>
                      <div className="text-[10px] text-emerald-700 font-medium mt-1">Optimal (70-100)</div>
                    </div>

                    <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-3.5">
                      <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold mb-1">
                        <span>Blood Pressure</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <div className="text-xl font-extrabold text-emerald-900">118/76 mmHg</div>
                      <div className="text-[10px] text-emerald-700 font-medium mt-1">Optimal Healthy</div>
                    </div>

                    <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-3.5">
                      <div className="flex items-center justify-between text-xs text-amber-800 font-semibold mb-1">
                        <span>Vitamin D</span>
                        <Activity className="w-3.5 h-3.5 text-amber-600" />
                      </div>
                      <div className="text-xl font-extrabold text-amber-900">22.4 ng/mL</div>
                      <div className="text-[10px] text-amber-700 font-medium mt-1">Mild Insufficiency</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Health Summary with Plain-Language Explanations */}
            <HealthSummary records={records} patient={patient} language={language} />

            {/* Recent Timeline Preview */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-teal-600" />
                  Recent Health Timeline for {patient.name}
                </h3>
                <button
                  onClick={() => setCurrentTab('timeline')}
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 hover:underline flex items-center gap-1"
                >
                  <span>View All Records ({records.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <HealthTimeline records={records.slice(0, 2)} patient={patient} language={language} />
            </div>
          </div>
        )}

        {/* Tab: Medicine Conflict & Difference Scanner */}
        {currentTab === 'compare' && (
          <MedicineConflictDetector 
            currentFamilyKey={currentFamilyKey}
            records={records}
            language={language}
          />
        )}

        {/* Tab: Full Timeline */}
        {currentTab === 'timeline' && (
          <HealthTimeline records={records} patient={patient} language={language} />
        )}

        {/* Tab: Biomarker Longitudinal Trends */}
        {currentTab === 'trends' && (
          <BiomarkerTrends language={language} currentFamilyKey={currentFamilyKey} />
        )}

        {/* Tab: Medications & Daily Schedule */}
        {currentTab === 'medications' && (
          <MedicationTracker records={records} language={language} />
        )}

        {/* Tab: Language Converter & Voice Over */}
        {currentTab === 'converter' && (
          <LanguageConverter />
        )}

        {/* Tab: Physician Visit-Prep Brief */}
        {currentTab === 'visitprep' && (
          <VisitPrepBrief patient={patient} records={records} />
        )}

        {/* Tab: Accuracy Benchmark Dashboard */}
        {currentTab === 'accuracy' && (
          <AccuracyDashboard />
        )}

        {/* Tab: ABHA & ABDM FHIR Locker */}
        {currentTab === 'abha' && (
          <AbhaLocker patient={patient} records={records} setRecords={setRecords} language={language} />
        )}

        {/* Tab: Conversational Health Copilot */}
        {currentTab === 'copilot' && (
          <CopilotChat records={records} patient={patient} language={language} />
        )}

        {/* Tab: System Architecture */}
        {currentTab === 'architecture' && (
          <ArchitectureView language={language} />
        )}

        {/* Tab: Presentation Slides for Judges */}
        {currentTab === 'slides' && (
          <PresentationSlides />
        )}
      </main>

      {/* Upload Document Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onRecordAdded={handleRawRecordExtracted}
        language={language}
      />

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-teal-600" />
            <span className="font-bold text-slate-800">MedCheck</span>
            <span>• Built for Altrix Labs AI Innovation Challenge (Round 1 Hackathon)</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500 text-[11px]">
            <span>Family Caregiver Engine</span>
            <span>•</span>
            <span>Medicine Conflict Scanner</span>
            <span>•</span>
            <span>Zero-Diagnosis Safe Protocol</span>
            <span>•</span>
            <span>Hindi / Telugu / Tamil Voice</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
