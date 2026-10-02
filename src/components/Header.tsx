import React, { useState } from 'react';

interface HeaderProps {
  onBack?: () => void;
  showBack?: boolean;
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onBack,
  showBack = true,
  title = 'Pre Authorization Detail',
  subtitle = 'Clinical Authorization Flow',
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="fixed top-0 w-full z-40 bg-[#faf8ff]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#bfc9c4]/30">
      <div className="max-w-2xl mx-auto h-16 px-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 min-w-0">
          {showBack && (
            <button
              aria-label="Go back"
              onClick={onBack}
              className="w-10 h-10 -ml-1 flex items-center justify-center rounded-full text-[#131b2e] hover:bg-[#eaedff] active:scale-95 transition-all text-base"
            >
              <span className="text-[17px] leading-none select-none">⬅️</span>
            </button>
          )}

          <img
            alt="ApexCare HMO Shield Logo"
            className="h-7 w-auto object-contain flex-shrink-0"
            src="https://lh3.googleusercontent.com/aida/AEtjO1UnP5YUGcu91vKQ1yvkvqeKL3vTWP8fDHVvi8oFstSMFOfnpYi0zmVuAZMLNielPM0P_XA3JfsXoCP-SI_-j5JOkzgPIg9YEboeQH03E5wyt-HNOLn7zyJsu5nvO_MTgkJPMXVW7Ysn9NaFwQsIufT3RghMo4B_GWGliGQz2_neDajaW5mndboqZvUGxFMcODq3UWMPZJxL1iXOxvGQFOEcUndOhXSstdiJZ7WGglpDX4tw7015mZKsAh82"
            onError={(e) => {
              // Graceful Shield fallback
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.parentElement?.querySelector('.logo-fallback');
              if (fallback) (fallback as HTMLElement).style.display = 'flex';
            }}
          />
          <div className="logo-fallback hidden w-7 h-7 rounded-lg bg-[#004337] items-center justify-center text-white flex-shrink-0 text-sm">
            <span>🛡️</span>
          </div>

          <div className="flex flex-col min-w-0 ml-1.5">
            <span className="font-headline-sm text-[16px] leading-tight text-[#131b2e] truncate font-semibold">
              {title}
            </span>
            <span className="font-label-sm text-[11px] text-[#00677d] truncate font-medium">
              {subtitle}
            </span>
          </div>
        </div>

        {/* User Profile Avatar with Interactive Modal / Popover */}
        <div className="relative flex items-center pr-1 flex-shrink-0">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            aria-label="User account"
            className="w-8 h-8 rounded-full bg-[#004337] flex items-center justify-center flex-shrink-0 text-white shadow-sm ring-2 ring-[#aaf0dc]/50 hover:ring-[#004337] transition-all text-sm"
          >
            <span className="text-[15px] leading-none select-none">👤</span>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-10 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
                <div className="w-9 h-9 rounded-full bg-[#004337] text-white flex items-center justify-center font-bold text-xs">
                  AO
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-[#131b2e] truncate">Dr. A. O. Adelekan</span>
                  <span className="text-[11px] text-[#00677d] truncate font-medium">CFO &amp; Lead Medical Director</span>
                </div>
              </div>
              <div className="py-2 flex flex-col gap-1 text-[11px] text-[#3f4945]">
                <div className="flex justify-between">
                  <span>Signatory Role:</span>
                  <span className="font-semibold text-emerald-800">Tier 1 Checker (2/2) 🛡️</span>
                </div>
                <div className="flex justify-between">
                  <span>Hardware Key:</span>
                  <span className="font-mono text-slate-700">🔑 #KEY-OK-9924</span>
                </div>
                <div className="flex justify-between">
                  <span>NHIA Accreditation:</span>
                  <span className="font-semibold text-slate-800">✅ Verified Active</span>
                </div>
              </div>
              <button
                onClick={() => setShowProfileMenu(false)}
                className="w-full mt-1 py-1.5 bg-[#f2f3ff] text-[#00677d] rounded-lg text-xs font-semibold hover:bg-[#eaedff] transition-colors"
              >
                Close Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
