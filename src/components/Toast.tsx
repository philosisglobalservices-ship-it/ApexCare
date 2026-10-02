import React from 'react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed top-18 left-4 right-4 z-50 max-w-sm mx-auto animate-in slide-in-from-top-4 fade-in duration-300 pointer-events-none">
      <div className="bg-[#283044] text-[#eef0ff] px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700">
        <span className="text-[17px] leading-none select-none">
          ✅
        </span>
        <span className="font-body-sm text-[12px] text-[#eef0ff] font-medium truncate">
          {message}
        </span>
      </div>
    </div>
  );
};
