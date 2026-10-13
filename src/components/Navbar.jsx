import React from 'react';
import { 
  Menu, 
  Upload, 
  Languages, 
  Users, 
  Activity,
  LogOut,
  LogIn,
  Sparkles,
  Plus,
  MessageCircle
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export default function Navbar({ 
  onOpenSidebar,
  currentTab, 
  setCurrentTab, 
  language, 
  setLanguage, 
  patient,
  profiles = [],
  selectedProfileId,
  onSelectProfile,
  onAddProfile,
  canManageProfiles = false,
  onOpenUpload,
  currentUser,
  onLogout,
  onOpenAuth
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const initials = currentUser?.name
    ? currentUser.name.split(/\s+/).filter(Boolean).slice(0, 2).map(n => n[0].toUpperCase()).join('')
    : 'MC';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      {/* Top Thin Caregiver Ribbon (Matching minal_medcheck style) */}
      <div className="border-b border-slate-800 bg-slate-900 text-slate-200 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#0EA5E9]/15 text-[#0EA5E9] font-semibold text-[11px] border border-[#0EA5E9]/30">
              <Sparkles className="w-3 h-3 text-[#0EA5E9]" />
              MedCheck AI
            </span>
            <span className="hidden md:inline text-slate-400 text-xs">
              Family health, made clearer • Zero-Diagnosis Safe Protocol
            </span>
          </div>

          {/* Patient profile selector */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-700">
              <Users className="w-3.5 h-3.5 text-teal-400" />
              <select
                value={selectedProfileId || ''}
                onChange={(e) => onSelectProfile(e.target.value)}
                className="bg-transparent text-[11px] font-bold text-white focus:outline-hidden cursor-pointer"
                aria-label="Select patient profile"
              >
                {profiles.length === 0 && <option value="" className="bg-slate-900 text-white">No patient profiles</option>}
                {profiles.map(profile => (
                  <option key={profile.id || profile._id} value={profile.id || profile._id} className="bg-slate-900 text-white">
                    {profile.name} · {profile.relationship || profile.relation || 'Family'}
                  </option>
                ))}
              </select>
              {canManageProfiles && (
                <button
                  type="button"
                  onClick={onAddProfile}
                  className="inline-flex items-center gap-1 rounded-md bg-teal-700 px-2 py-1 text-[10px] font-bold text-white transition-colors hover:bg-teal-600"
                  aria-label="Create patient profile"
                  title="Create patient profile"
                >
                  <Plus aria-hidden="true" className="h-3 w-3" />
                  <span className="hidden sm:inline">Add profile</span>
                </button>
              )}
            </div>

            {patient.abhaId && <div className="hidden lg:flex items-center gap-1.5 text-emerald-300 bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono">ABHA: {patient.abhaId}</span>
            </div>}
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Hamburger Menu (☰) + MedCheck Brand */}
          <div className="flex items-center gap-3">
            {/* Hamburger Button (☰) */}
            <button
              onClick={onOpenSidebar}
              className="p-2 rounded-xl text-slate-700 hover:text-teal-950 hover:bg-teal-50 border border-slate-200 transition-colors cursor-pointer flex items-center justify-center"
              aria-label="Open navigation menu"
              title="Open feature menu"
            >
              <Menu className="w-5 h-5 text-teal-800" />
            </button>

            {/* Logo */}
            <div 
              className="flex items-center gap-2.5 cursor-pointer" 
              onClick={() => setCurrentTab('dashboard')}
              title="Go to Health Dashboard"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-800 flex items-center justify-center text-white shadow-md shadow-teal-900/10">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black text-slate-950 tracking-tight">
                    MedCheck
                  </span>
                  <span className="text-lg font-black text-teal-800">
                    AI
                  </span>
                  <span className="hidden sm:inline-flex text-[10px] font-bold text-teal-900 bg-teal-50 border border-teal-200 px-1.5 py-0.2 rounded-full font-mono">
                    v2.4
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 hidden md:block -mt-0.5">
                  Family health, made clearer
                </p>
              </div>
            </div>
          </div>

          {/* Right Controls: ABHA Badge, Language, Upload Record, and User Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* ABHA Badge (minal_medcheck style) */}
            {patient.abhaId && <div className="hidden xl:flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-950">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-emerald-700 font-normal">ABHA:</span>
              <span className="font-mono font-bold text-emerald-900">{patient.abhaId}</span>
            </div>}

            {/* Language Selector */}
            <div className="flex items-center bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 shadow-2xs hover:border-teal-600 transition-colors">
              <Languages className="w-3.5 h-3.5 text-teal-800 mr-1.5 shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-900 focus:outline-hidden cursor-pointer"
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

            <button
              type="button"
              onClick={() => setCurrentTab('copilot')}
              aria-label={t.tabs.copilot}
              aria-current={currentTab === 'copilot' ? 'page' : undefined}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-colors ${
                currentTab === 'copilot'
                  ? 'border-teal-800 bg-teal-800 text-white'
                  : 'border-teal-200 bg-teal-50 text-teal-900 hover:bg-teal-100'
              }`}
            >
              <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">{t.tabs.copilot}</span>
            </button>

            {/* Upload Record Button */}
            <button
              onClick={onOpenUpload}
              className="inline-flex items-center gap-1.5 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-md shadow-teal-900/10 active:scale-95"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Upload Record</span>
              <span className="sm:hidden">Upload</span>
            </button>

            {/* Login / Profile Controls */}
            {currentUser ? (
              <div className="flex items-center gap-2 bg-gradient-to-br from-teal-50 to-white border border-teal-100 rounded-xl p-1 sm:px-2.5 sm:py-1 shadow-2xs">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-700 to-cyan-600 text-white text-xs font-black flex items-center justify-center shrink-0 shadow-xs ring-1 ring-white">
                  {initials}
                </div>
                <div className="hidden sm:block text-left max-w-[100px]">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {currentUser.name}
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  title="Logout"
                  className="text-slate-400 hover:text-rose-600 p-1 rounded-lg cursor-pointer transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth('login')}
                className="inline-flex items-center gap-1.5 border border-teal-800 text-teal-800 hover:bg-teal-50 text-xs font-bold px-3 py-2 rounded-xl transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign in</span>
              </button>
            )}

          </div>
        </div>
      </div>
    </header>
  );
}
