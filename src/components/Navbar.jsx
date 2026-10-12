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
    { id: 'dashboard', label: t.tabs.dashboard || "Health Dashboard", icon: HeartPulse },
    { id: 'compare', label: "Compare & Flag Conflicts", icon: GitCompare, highlight: true },
    { id: 'verify', label: `Verify Review ${pendingVerificationCount > 0 ? `(${pendingVerificationCount})` : ''}`, icon: CheckSquare, badge: pendingVerificationCount > 0 },
    { id: 'timeline', label: t.tabs.timeline || "Records Timeline", icon: FileText },
    { id: 'trends', label: t.tabs.trends || "Biomarker Trends", icon: TrendingUp },
    { id: 'medications', label: t.tabs.medications || "Medications", icon: Pill },
    { id: 'converter', label: "Language & Voice", icon: Languages },
    { id: 'visitprep', label: "Visit-Prep Brief", icon: Printer },
    { id: 'accuracy', label: "Accuracy Benchmark", icon: Award },
    { id: 'abha', label: t.tabs.abha || "ABHA Locker", icon: ShieldCheck },
    { id: 'copilot', label: t.tabs.copilot || "Ask Copilot", icon: Sparkles },
    { id: 'architecture', label: t.tabs.architecture || "Architecture", icon: Layers },
    { id: 'slides', label: t.tabs.slides || "Demo Slides", icon: Presentation }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner: Hackathon Context & Family Switcher */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-sky-950 text-white px-4 py-1.5 text-xs font-medium flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-teal-400/20 text-teal-300 border border-teal-400/30 px-2 py-0.5 rounded-full text-[10px] tracking-wide uppercase font-semibold">
            Altrix Labs Hackathon
          </span>
          <span className="hidden sm:inline text-slate-300">
            MedCheck • Family AI Health Copilot (ABDM-Ready)
          </span>
        </div>

        {/* Family Member Caregiver Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700">
            <Users className="w-3 h-3 text-teal-400" />
            <span className="text-[11px] text-slate-300 font-semibold">Family Profile:</span>
            <select
              value={currentFamilyKey}
              onChange={(e) => onFamilyMemberChange(e.target.value)}
              className="bg-transparent text-[11px] font-bold text-teal-300 focus:outline-hidden cursor-pointer"
              aria-label="Select family profile"
            >
              <option value="papa" className="bg-slate-900 text-white">👨‍🦳 Papa (Ramesh Sharma, 62y)</option>
              <option value="maa" className="bg-slate-900 text-white">👵 Maa (Sunita Sharma, 58y)</option>
              <option value="self" className="bg-slate-900 text-white">👤 Self (Rahul Sharma, 32y)</option>
            </select>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            <span className="text-[11px] font-mono font-medium">ABHA: {patient.abhaId}</span>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <HeartPulse className="w-6 h-6 stroke-[2.4]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold bg-gradient-to-r from-slate-900 via-teal-900 to-emerald-800 bg-clip-text text-transparent">
                  MedCheck
                </span>
                <span className="bg-teal-50 text-teal-700 border border-teal-200 text-[10px] px-1.5 py-0.5 rounded font-bold">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                AI explains records & flags medicine conflicts, without ever diagnosing
              </p>
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Compare Quick Shortcut Button */}
            <button
              onClick={() => setCurrentTab('compare')}
              className="hidden md:inline-flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-xs"
            >
              <GitCompare className="w-3.5 h-3.5 text-amber-600" />
              <span>Flag Conflicts</span>
            </button>

            {/* Language Selector */}
            <div className="relative flex items-center bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-xl p-1 transition-colors">
              <Languages className="w-3.5 h-3.5 text-slate-600 ml-1.5 mr-1" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-700 pr-2 py-0.5 focus:outline-hidden cursor-pointer"
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

            {/* Upload Button */}
            <button
              onClick={onOpenUpload}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm shadow-teal-600/25 transition-all transform active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>{t.upload?.button || "+ Upload Record"}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Row */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 pt-1 border-t border-slate-100 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            const isHighlight = tab.highlight;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-teal-50 text-teal-800 border border-teal-200 shadow-xs'
                    : isHighlight
                      ? 'bg-amber-50/60 text-amber-900 border border-amber-200 hover:bg-amber-100/70'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${
                  isActive 
                    ? 'text-teal-600' 
                    : isHighlight 
                      ? 'text-amber-600' 
                      : 'text-slate-500'
                }`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
