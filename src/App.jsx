import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AuthView from './components/AuthView';
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
import { getCurrentUser, logoutUser } from './utils/auth';

import { 
  FAMILY_MEMBERS, 
  INITIAL_PATIENT, 
  INITIAL_RECORDS, 
  PAPA_RECORDS, 
  MAA_RECORDS, 
  SELF_RECORDS 
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
  ArrowLeft,
  TrendingUp,
  FileText,
  Printer,
  Award,
  CheckSquare,
  GitCompare,
  Users,
  Volume2,
  Languages,
  Presentation,
  Check
} from 'lucide-react';

// The 11 core feature cards required on the main dashboard
const FEATURE_MODULES = [
  {
    id: 'dashboard',
    title: "Health Dashboard",
    description: "Summary of patient health records, vital indicators, recent clinical activity, and record statistics.",
    icon: HeartPulse,
    badge: "Module 1",
    tag: "Core Overview"
  },
  {
    id: 'compare',
    title: "Compare & Flag Conflicts",
    description: "Compare prescriptions across dates to flag dosage changes, drug interactions, and conflicting medicines.",
    icon: GitCompare,
    badge: "Module 2",
    tag: "Safety Check"
  },
  {
    id: 'verify',
    title: "Verify Review",
    description: "Review extracted doctor notes, correct medicine names, and confirm data with original document evidence.",
    icon: CheckSquare,
    badge: "Module 3",
    tag: "Human-in-the-Loop"
  },
  {
    id: 'timeline',
    title: "Records Timeline",
    description: "Chronological history of all medical visits, prescriptions, and lab reports with date & type filters.",
    icon: FileText,
    badge: "Module 4",
    tag: "History"
  },
  {
    id: 'trends',
    title: "Biomarker Trends",
    description: "Visual charts of blood sugar, HbA1c, cholesterol, and BP over time against laboratory reference bounds.",
    icon: TrendingUp,
    badge: "Module 5",
    tag: "Serial Charts"
  },
  {
    id: 'medications',
    title: "Medications",
    description: "Active medication list, strength, frequency, timings (morning, afternoon, night), and food instructions.",
    icon: Pill,
    badge: "Module 6",
    tag: "Prescriptions"
  },
  {
    id: 'converter',
    title: "Language & Voice",
    description: "Translate medical advice into 8 Indian regional languages with clear text-to-speech voice pronunciation.",
    icon: Languages,
    badge: "Module 7",
    tag: "8 Languages"
  },
  {
    id: 'visitprep',
    title: "Visit-Prep Brief",
    description: "Generate a concise 1-page summary with history, active meds, and questions to ask your doctor.",
    icon: Printer,
    badge: "Module 8",
    tag: "Doctor Visit"
  },
  {
    id: 'accuracy',
    title: "Accuracy Benchmark",
    description: "Compare extraction accuracy against verified clinical ground truth test datasets with precision metrics.",
    icon: Award,
    badge: "Module 9",
    tag: "Evaluation"
  },
  {
    id: 'slides',
    title: "Demo Slides",
    description: "Slide deck presenting project problem statement, architecture, implementation workflow, and future scope.",
    icon: Presentation,
    badge: "Module 10",
    tag: "Presentation"
  },
  {
    id: 'abha',
    title: "ABHA & FHIR Locker",
    description: "Understand national health-record interoperability and inspect standard ABDM FHIR R4 JSON bundles.",
    icon: ShieldCheck,
    badge: "Module 11",
    tag: "ABDM Standards"
  }
];

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
    setToastMessage(`✓ Record confirmed and saved to health timeline!`);
    setTimeout(() => setToastMessage(''), 5000);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setToastMessage('You have logged out.');
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setCurrentTab('dashboard');
    setToastMessage(`Welcome back, ${user.name}!`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const currentModule = FEATURE_MODULES.find(m => m.id === currentTab);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-slate-800 flex items-center gap-2.5 text-xs animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage('')} className="ml-2 text-slate-400 hover:text-white font-bold cursor-pointer">✕</button>
        </div>
      )}

      {/* Navigation Drawer (Sidebar with 11 Feature Cards) */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        pendingVerificationCount={pendingVerificationRecord ? 1 : 0}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuth={(mode) => setCurrentTab(mode || 'login')}
      />

      {/* Navigation Header */}
      <Navbar
        onOpenSidebar={() => setIsSidebarOpen(true)}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        language={language}
        setLanguage={setLanguage}
        patient={patient}
        currentFamilyKey={currentFamilyKey}
        onFamilyMemberChange={handleFamilyMemberChange}
        onOpenUpload={() => setIsUploadOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuth={(mode) => setCurrentTab(mode || 'login')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Breadcrumb Bar when viewing any non-dashboard tab (except login/signup) */}
        {currentTab !== 'dashboard' && currentTab !== 'login' && currentTab !== 'signup' && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-white border border-emerald-100 rounded-xl px-4 py-2.5 shadow-2xs">
            <div className="flex items-center gap-2 text-xs">
              <button 
                onClick={() => setCurrentTab('dashboard')} 
                className="text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                title="Return to main dashboard"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>
              <span className="text-slate-300">/</span>
              <span className="text-slate-800 font-bold">
                {currentModule?.title || currentTab}
              </span>
              {currentModule?.badge && (
                <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-semibold ml-1">
                  {currentModule.badge}
                </span>
              )}
            </div>

            <button 
              onClick={() => setCurrentTab('dashboard')}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
            >
              ✕ Back to Dashboard
            </button>
          </div>
        )}

        {/* Authentication View (Login or Sign Up) */}
        {(currentTab === 'login' || currentTab === 'signup') && (
          <AuthView
            initialMode={currentTab === 'signup' ? 'signup' : 'login'}
            onAuthSuccess={handleAuthSuccess}
            onCancel={() => setCurrentTab('dashboard')}
          />
        )}

        {/* 1. Health Dashboard Tab */}
        {currentTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Student Project Context Banner */}
            <div className="bg-emerald-800 text-white rounded-2xl p-5 border border-emerald-700 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-emerald-700/80 border border-emerald-600 text-xl flex items-center justify-center shrink-0">
                    {patient.avatarIcon || "👨‍🦳"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-emerald-900 text-emerald-200 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-emerald-700">
                        Caregiver Healthcare Project
                      </span>
                      <span className="text-xs text-emerald-100 font-medium">
                        Patient Profile: <strong>{patient.name}</strong> ({patient.relation}, {patient.age}y)
                      </span>
                    </div>
                    <p className="text-xs text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
                      MEDCHECK organizes medical records, explains clinical terms in regional languages, flags conflicting doses, and assists in doctor visit preparation.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={() => setCurrentTab('compare')}
                    className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer border border-emerald-600"
                  >
                    <GitCompare className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Check Conflicts</span>
                  </button>

                  <button
                    onClick={() => setCurrentTab('visitprep')}
                    className="inline-flex items-center gap-1.5 bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-bold px-3 py-2 rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Visit Brief</span>
                  </button>
                </div>
              </div>
            </div>

            {/* SECTION: 11 Features & Modules Grid */}
            <section className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>MEDCHECK Features & Modules</span>
                    <span className="text-xs font-semibold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full border border-emerald-200">
                      11 Modules
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Click any module card below to open its dedicated healthcare tool or review records
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {FEATURE_MODULES.map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={card.id}
                      onClick={() => setCurrentTab(card.id)}
                      className="group bg-white rounded-xl border border-slate-200 hover:border-emerald-400 p-4 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            #{idx + 1}
                          </span>
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                          {card.title}
                        </h3>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                          {card.description}
                        </p>
                      </div>

                      <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                          {card.tag}
                        </span>
                        <span className="text-xs font-semibold text-emerald-700 group-hover:text-emerald-900 flex items-center gap-1 group-hover:translate-x-0.5 transition-all">
                          <span>Open</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Top Patient Profile Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                {/* Left: Patient Info */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-bold text-lg flex items-center justify-center shadow-xs">
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-lg sm:text-xl font-bold text-slate-900">{patient.name}</h1>
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified Profile</span>
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
                      <span>{patient.age} years • {patient.gender}</span>
                      <span>•</span>
                      <span>Blood Group: <strong className="text-slate-700">{patient.bloodGroup}</strong></span>
                      <span>•</span>
                      <span className="font-mono text-slate-700">ABHA: {patient.abhaId}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mr-1">
                        Active Conditions:
                      </span>
                      {patient.activeConditions.map((cond, i) => (
                        <span key={i} className="bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-medium px-2 py-0.5 rounded">
                          {cond}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Record Statistics */}
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <div className="font-bold text-slate-900 text-base">{records.length}</div>
                    <div className="text-[10px] text-slate-500">Stored Records</div>
                  </div>
                  <div className="w-px h-7 bg-slate-200" />
                  <div>
                    <div className="font-bold text-emerald-700 text-base">
                      {records.reduce((acc, r) => acc + (r.medications?.length || 0), 0)}
                    </div>
                    <div className="text-[10px] text-slate-500">Total Medications</div>
                  </div>
                  <div className="w-px h-7 bg-slate-200" />
                  <div>
                    <div className="font-bold text-teal-700 text-base">8</div>
                    <div className="text-[10px] text-slate-500">Languages Ready</div>
                  </div>
                </div>
              </div>

              {/* Vitals Quick Gauge Row (Labeled as Demo Data) */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Recent Vital Indicators & Lab Findings</span>
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                      Demo Data
                    </span>
                  </span>
                  <span className="text-[11px] text-slate-400">Apollo Diagnostics • Latest report</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {currentFamilyKey === 'papa' && (
                    <>
                      <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3">
                        <div className="flex items-center justify-between text-xs text-rose-800 font-semibold mb-0.5">
                          <span>HbA1c (3-Mo Sugar)</span>
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                        </div>
                        <div className="text-lg font-bold text-rose-950">8.2 %</div>
                        <div className="text-[10px] text-rose-700">Above Ref (&lt; 5.7%)</div>
                      </div>

                      <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3">
                        <div className="flex items-center justify-between text-xs text-rose-800 font-semibold mb-0.5">
                          <span>Fasting Blood Sugar</span>
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                        </div>
                        <div className="text-lg font-bold text-rose-950">142 mg/dL</div>
                        <div className="text-[10px] text-rose-700">Above Ref (70-100)</div>
                      </div>

                      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3">
                        <div className="flex items-center justify-between text-xs text-amber-800 font-semibold mb-0.5">
                          <span>LDL Cholesterol</span>
                          <Activity className="w-3 h-3 text-amber-600" />
                        </div>
                        <div className="text-lg font-bold text-amber-950">154 mg/dL</div>
                        <div className="text-[10px] text-amber-700">Above Ref (&lt; 100)</div>
                      </div>

                      <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3">
                        <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold mb-0.5">
                          <span>Kidney Creatinine</span>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        </div>
                        <div className="text-lg font-bold text-emerald-950">1.05 mg/dL</div>
                        <div className="text-[10px] text-emerald-700">Within Ref (0.7-1.3)</div>
                      </div>
                    </>
                  )}

                  {currentFamilyKey === 'maa' && (
                    <>
                      <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3">
                        <div className="flex items-center justify-between text-xs text-rose-800 font-semibold mb-0.5">
                          <span>TSH (Thyroid)</span>
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                        </div>
                        <div className="text-lg font-bold text-rose-950">7.8 uIU/mL</div>
                        <div className="text-[10px] text-rose-700">Elevated (0.4 - 4.2)</div>
                      </div>

                      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3">
                        <div className="flex items-center justify-between text-xs text-amber-800 font-semibold mb-0.5">
                          <span>Vitamin D Total</span>
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                        </div>
                        <div className="text-lg font-bold text-amber-950">14.2 ng/mL</div>
                        <div className="text-[10px] text-amber-700">Deficient (30 - 100)</div>
                      </div>

                      <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3">
                        <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold mb-0.5">
                          <span>Serum Calcium</span>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        </div>
                        <div className="text-lg font-bold text-emerald-950">9.2 mg/dL</div>
                        <div className="text-[10px] text-emerald-700">Normal (8.5 - 10.5)</div>
                      </div>

                      <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3">
                        <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold mb-0.5">
                          <span>Blood Pressure</span>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        </div>
                        <div className="text-lg font-bold text-emerald-950">130/84 mmHg</div>
                        <div className="text-[10px] text-emerald-700">Controlled</div>
                      </div>
                    </>
                  )}

                  {currentFamilyKey === 'self' && (
                    <>
                      <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3">
                        <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold mb-0.5">
                          <span>HbA1c</span>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        </div>
                        <div className="text-lg font-bold text-emerald-950">5.2 %</div>
                        <div className="text-[10px] text-emerald-700">Optimal (&lt; 5.7%)</div>
                      </div>

                      <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3">
                        <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold mb-0.5">
                          <span>Fasting Glucose</span>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        </div>
                        <div className="text-lg font-bold text-emerald-950">88 mg/dL</div>
                        <div className="text-[10px] text-emerald-700">Optimal (70-100)</div>
                      </div>

                      <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3">
                        <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold mb-0.5">
                          <span>Blood Pressure</span>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        </div>
                        <div className="text-lg font-bold text-emerald-950">118/76 mmHg</div>
                        <div className="text-[10px] text-emerald-700">Optimal Healthy</div>
                      </div>

                      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3">
                        <div className="flex items-center justify-between text-xs text-amber-800 font-semibold mb-0.5">
                          <span>Vitamin D</span>
                          <Activity className="w-3 h-3 text-amber-600" />
                        </div>
                        <div className="text-lg font-bold text-amber-950">22.4 ng/mL</div>
                        <div className="text-[10px] text-amber-700">Mild Insufficiency</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Health Summary with Plain-Language Explanations */}
            <HealthSummary records={records} patient={patient} language={language} />

            {/* Recent Timeline Preview */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  Recent Health Timeline for {patient.name}
                </h3>
                <button
                  onClick={() => setCurrentTab('timeline')}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                >
                  <span>View All Records ({records.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <HealthTimeline records={records.slice(0, 2)} patient={patient} language={language} />
            </div>
          </div>
        )}

        {/* 2. Compare & Flag Conflicts */}
        {currentTab === 'compare' && (
          <MedicineConflictDetector 
            currentFamilyKey={currentFamilyKey}
            records={records}
            language={language}
          />
        )}

        {/* 3. Verify Review Screen */}
        {currentTab === 'verify' && (
          <VerifyScreen
            rawExtractedData={pendingVerificationRecord}
            onConfirmSave={handleVerifyConfirmed}
            onCancel={() => {
              setPendingVerificationRecord(null);
              setCurrentTab('dashboard');
            }}
            language={language}
            isModal={false}
          />
        )}

        {/* 4. Records Timeline */}
        {currentTab === 'timeline' && (
          <HealthTimeline records={records} patient={patient} language={language} />
        )}

        {/* 5. Biomarker Trends */}
        {currentTab === 'trends' && (
          <BiomarkerTrends language={language} currentFamilyKey={currentFamilyKey} />
        )}

        {/* 6. Medications */}
        {currentTab === 'medications' && (
          <MedicationTracker records={records} language={language} />
        )}

        {/* 7. Language & Voice */}
        {currentTab === 'converter' && (
          <LanguageConverter />
        )}

        {/* 8. Visit-Prep Brief */}
        {currentTab === 'visitprep' && (
          <VisitPrepBrief patient={patient} records={records} />
        )}

        {/* 9. Accuracy Benchmark */}
        {currentTab === 'accuracy' && (
          <AccuracyDashboard />
        )}

        {/* 10. Demo Slides */}
        {currentTab === 'slides' && (
          <PresentationSlides />
        )}

        {/* 11. ABHA & FHIR Locker */}
        {currentTab === 'abha' && (
          <AbhaLocker patient={patient} records={records} setRecords={setRecords} language={language} />
        )}

        {/* Optional Secondary Tools */}
        {currentTab === 'copilot' && (
          <CopilotChat records={records} patient={patient} language={language} />
        )}

        {currentTab === 'architecture' && (
          <ArchitectureView language={language} />
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
      <footer className="mt-12 bg-white border-t border-slate-200 py-5 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-slate-800">MEDCHECK</span>
            <span>• Student Healthcare Project for Altrix Labs Innovation Challenge</span>
          </div>
          <div className="flex items-center gap-3 text-slate-500 text-[11px]">
            <span>11 Feature Modules</span>
            <span>•</span>
            <span>8 Indian Languages</span>
            <span>•</span>
            <span>Zero-Diagnosis Safe Protocol</span>
            <span>•</span>
            <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Demo Data</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
