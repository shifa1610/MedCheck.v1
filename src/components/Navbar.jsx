import React from 'react';
import { 
  Menu, 
  Upload, 
  Languages, 
  CheckCircle2, 
  Users, 
  HeartPulse,
  User,
  LogOut,
  LogIn
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export default function Navbar({ 
  onOpenSidebar,
  currentTab, 
  setCurrentTab, 
  language, 
  setLanguage, 
  patient,
  currentFamilyKey,
  onFamilyMemberChange,
  onOpenUpload,
  currentUser,
  onLogout,
  onOpenAuth
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-emerald-100 shadow-xs">
      {/* Top Banner: Project Context & Family Switcher */}
      <div className="bg-emerald-900 text-emerald-50 px-4 py-1.5 text-xs flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-800 text-emerald-200 border border-emerald-700 px-2 py-0.5 rounded text-[10px] uppercase font-semibold">
            Healthcare Project
          </span>
          <span className="hidden sm:inline text-emerald-200 text-xs">
            MEDCHECK — Personal Health Record & Multilingual Voice-Over
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

      {/* Main Nav Bar: Clean & Minimal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Left: 3-line Hamburger Menu Icon + MEDCHECK Logo */}
          <div className="flex items-center gap-3">
            {/* Hamburger Button (☰) */}
            <button
              onClick={onOpenSidebar}
              className="p-2 rounded-lg text-slate-700 hover:text-emerald-900 hover:bg-emerald-50 border border-slate-200 transition-colors cursor-pointer flex items-center justify-center"
              aria-label="Open navigation menu"
              title="Open feature menu"
            >
              <Menu className="w-5 h-5 text-emerald-800" />
            </button>

            {/* Logo */}
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
                <p className="text-[10px] text-slate-500 hidden md:block -mt-0.5">
                  Medical Language & Health Copilot
                </p>
              </div>
            </div>
          </div>

          {/* Right Action Tools: Language, Upload Record, and Login/Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Selector */}
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg px-2 py-1">
              <Languages className="w-3.5 h-3.5 text-emerald-700 mr-1.5 shrink-0" />
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

            {/* Upload Record Button */}
            <button
              onClick={onOpenUpload}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs active:scale-95"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Upload Record</span>
              <span className="sm:hidden">Upload</span>
            </button>

            {/* Login / Profile Controls */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg p-1 sm:px-2 sm:py-1">
                <div className="w-6 h-6 rounded-full bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-xs font-semibold text-slate-800 hidden sm:inline max-w-[90px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
                <button
                  onClick={onLogout}
                  title="Logout"
                  className="text-slate-400 hover:text-rose-600 p-1 rounded cursor-pointer transition-colors ml-0.5"
                  aria-label="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth('login')}
                className="inline-flex items-center gap-1.5 border border-emerald-600 text-emerald-800 hover:bg-emerald-50 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            )}

          </div>
        </div>
      </div>
    </header>
  );
}
