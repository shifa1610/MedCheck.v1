import React from 'react';
import { 
  HeartPulse, 
  X,
  User,
  LogOut,
  LogIn,
  ChevronRight
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

  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label="Navigation Menu">
      {/* Dimmed Overlay Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-84 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 border-r border-emerald-100 animate-in slide-in-from-left duration-200">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-emerald-100 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <HeartPulse className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                <span>MEDCHECK</span>
                <span className="text-[9px] bg-emerald-800 text-emerald-200 font-semibold px-1.5 py-0.2 rounded border border-emerald-700">
                  Student Project
                </span>
              </div>
              <p className="text-[10px] text-emerald-200">
                Medical Language & Health Copilot
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feature Modules Header */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            Features & Modules
          </span>
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
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
                    ? 'bg-emerald-50 border-emerald-300 shadow-2xs'
                    : 'bg-white border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/40'
                }`}
              >
                {/* Icon Container */}
                <div 
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isActive 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {/* Card Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-xs font-bold truncate ${
                      isActive ? 'text-emerald-950 font-extrabold' : 'text-slate-800 group-hover:text-emerald-900'
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
                  <div className="w-1.5 h-6 rounded-full bg-emerald-600 shrink-0 self-center" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 shrink-0 self-center transition-colors" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Account / Authentication Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50">
          {currentUser ? (
            <div className="bg-white rounded-xl border border-slate-200 p-2.5 shadow-2xs">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
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
                  title="Log out of MEDCHECK"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                  aria-label="Log out"
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
              className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login / Create Account</span>
            </button>
          )}

          <div className="mt-2 text-center text-[10px] text-slate-400">
            MEDCHECK • Student Healthcare Project
          </div>
        </div>

      </div>
    </div>
  );
}
