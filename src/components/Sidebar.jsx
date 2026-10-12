import React from 'react';
import { 
  Activity, 
  X,
  User,
  LogOut,
  LogIn,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { SIDEBAR_MODULES } from '../data/sidebarModules';
export { SIDEBAR_MODULES };

export default function Sidebar({
  isOpen,
  onClose,
  currentTab,
  onSelectTab,
  pendingVerificationCount = 0,
  currentUser,
  onLogout,
  onOpenAuth
}) {
  if (!isOpen) return null;

  const handleSelect = (tabId) => {
    onSelectTab(tabId);
    onClose();
  };

  const initials = currentUser?.name
    ? currentUser.name.split(/\s+/).filter(Boolean).slice(0, 2).map(n => n[0].toUpperCase()).join('')
    : 'MC';

  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label="Navigation Menu">
      {/* Dimmed Overlay Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-84 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 border-r border-slate-200 animate-in slide-in-from-left duration-200">
        
        {/* Drawer Header (Teal-950 / Teal-800 themed) */}
        <div className="p-4 border-b border-teal-800/20 bg-gradient-to-r from-teal-950 to-teal-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-800 border border-teal-700 flex items-center justify-center text-white shadow-md">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
                <span>MedCheck</span>
                <span className="text-teal-400">AI</span>
                <span className="text-[9px] bg-teal-800/80 text-teal-200 font-bold px-1.5 py-0.2 rounded border border-teal-700 font-mono">
                  v2.4
                </span>
              </div>
              <p className="text-[10px] text-teal-200/90">
                Family health, made clearer
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feature Modules Header */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            Features & Modules
          </span>
          <span className="text-[10px] font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
            11 Modules
          </span>
        </div>

        {/* Scrollable List of 11 Feature Cards */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-2 divide-y-0" aria-label="Feature modules">
          {SIDEBAR_MODULES.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            const hasPendingBadge = item.id === 'verify' && pendingVerificationCount > 0;

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 group ${
                  isActive
                    ? 'bg-teal-50 border-teal-300 shadow-2xs'
                    : 'bg-white border-slate-100 hover:border-teal-200 hover:bg-teal-50/40'
                }`}
              >
                {/* Icon Container */}
                <div 
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isActive 
                      ? 'bg-teal-800 text-white shadow-xs' 
                      : 'bg-slate-100 text-slate-600 group-hover:bg-teal-100 group-hover:text-teal-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {/* Card Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-xs font-bold truncate ${
                      isActive ? 'text-teal-950 font-extrabold' : 'text-slate-800 group-hover:text-teal-950'
                    }`}>
                      {index + 1}. {item.title}
                    </span>
                    {hasPendingBadge && (
                      <span className="bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                        {pendingVerificationCount} new
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight mt-0.5 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Active Indicator Arrow */}
                {isActive ? (
                  <div className="w-1.5 h-6 rounded-full bg-teal-700 shrink-0 self-center" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal-700 shrink-0 self-center transition-colors" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Account / Authentication Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50">
          {currentUser ? (
            <div className="bg-gradient-to-br from-teal-50 to-white rounded-xl border border-teal-100 p-2.5 shadow-2xs">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-700 to-cyan-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs ring-1 ring-white">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {currentUser.email}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  title="Sign out of MedCheck"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                onOpenAuth('login');
                onClose();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-teal-900/10"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign in / Create Account</span>
            </button>
          )}

          <div className="mt-2 text-center text-[10px] text-slate-400">
            MedCheck AI • Family Health Copilot
          </div>
        </div>

      </div>
    </div>
  );
}
