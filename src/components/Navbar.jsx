import React from 'react';
import { 
  GitCompare, 
  Upload, 
  Languages, 
  ShieldCheck, 
  FileText, 
  TrendingUp, 
  Pill, 
  Sparkles, 
  Layers, 
  Presentation,
  CheckCircle2,
  Award,
  Printer,
  CheckSquare,
  Users,
  HeartPulse
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';
import { FAMILY_MEMBERS } from '../data/mockRecords';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  language, 
  setLanguage, 
  patient,
  currentFamilyKey,
  onFamilyMemberChange,
  onOpenUpload,
  pendingVerificationCount = 0
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const tabs = [
    { id: 'dashboard', label: "Health Dashboard", icon: HeartPulse },
    { id: 'compare', label: "Compare & Flag Conflicts", icon: GitCompare },
    { id: 'verify', label: `Verify Review ${pendingVerificationCount > 0 ? `(${pendingVerificationCount})` : ''}`, icon: CheckSquare, badge: pendingVerificationCount > 0 },
    { id: 'timeline', label: "Records Timeline", icon: FileText },
    { id: 'trends', label: "Biomarker Trends", icon: TrendingUp },
    { id: 'medications', label: "Medications", icon: Pill },
    { id: 'converter', label: "Language & Voice", icon: Languages },
    { id: 'visitprep', label: "Visit-Prep Brief", icon: Printer },
    { id: 'accuracy', label: "Accuracy Benchmark", icon: Award },
    { id: 'slides', label: "Demo Slides", icon: Presentation },
    { id: 'abha', label: "ABHA & FHIR Locker", icon: ShieldCheck }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-emerald-100 shadow-xs">
      {/* Top Banner: Project Context & Family Switcher */}
      <div className="bg-emerald-900 text-emerald-50 px-4 py-1.5 text-xs flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-800 text-emerald-200 border border-emerald-700 px-2 py-0.5 rounded text-[10px] uppercase font-semibold">
            Healthcare Project
          </span>
          <span className="hidden sm:inline text-emerald-200 text-xs">
            MEDCHECK — Personal Health Record & Verification System
          </span>
        </div>

        {/* Family Member Caregiver Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-emerald-950/70 px-2.5 py-0.5 rounded-lg border border-emerald-800">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] text-emerald-200 font-medium">Record Profile:</span>
            <select
              value={currentFamilyKey}
              onChange={(e) => onFamilyMemberChange(e.target.value)}
              className="bg-transparent text-[11px] font-bold text-white focus:outline-hidden cursor-pointer"
              aria-label="Select family profile"
            >
              <option value="papa" className="bg-slate-900 text-white">Papa (Ramesh, 62y)</option>
              <option value="maa" className="bg-slate-900 text-white">Maa (Sunita, 58y)</option>
              <option value="self" className="bg-slate-900 text-white">Self (Rahul, 32y)</option>
            </select>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-emerald-300 bg-emerald-950/70 px-2.5 py-0.5 rounded-lg border border-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span className="text-[11px] font-mono">ABHA: {patient.abhaId}</span>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo - cleanly branded with NO version label */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer" 
            onClick={() => setCurrentTab('dashboard')}
            title="Go to Health Dashboard"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <HeartPulse className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-lg font-bold text-emerald-950 tracking-tight">
                MEDCHECK
              </span>
              <p className="text-[10px] text-slate-500 hidden sm:block -mt-0.5">
                Medical Language Converter & Health Copilot
              </p>
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg px-2 py-1">
              <Languages className="w-3.5 h-3.5 text-emerald-700 mr-1.5" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-xs font-medium text-slate-800 focus:outline-hidden cursor-pointer"
                aria-label="Select language"
              >
                <option value="en">English (EN)</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="ml">മലയാളം (Malayalam)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="gu">ગુજરાતી (Gujarati)</option>
              </select>
            </div>

            {/* Simplified Upload Record Button */}
            <button
              onClick={onOpenUpload}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs active:scale-95"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Record</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Row */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 pt-1 border-t border-slate-100 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-emerald-100 text-emerald-900 font-semibold border border-emerald-300'
                    : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-700' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
