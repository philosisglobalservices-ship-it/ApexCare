import React, { useState } from 'react';
import { BatchMetadata } from '../types';

interface BiometricAuthModalProps {
  batch: BatchMetadata;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const BiometricAuthModal: React.FC<BiometricAuthModalProps> = ({
  batch,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [authState, setAuthState] = useState<'idle' | 'scanning' | 'verified'>('idle');

  if (!isOpen) return null;

  const handleStartScan = () => {
    setAuthState('scanning');
    setTimeout(() => {
      setAuthState('verified');
      setTimeout(() => {
        onSuccess();
      }, 700);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-[#004337] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[20px] leading-none select-none">🔐</span>
            <div>
              <h3 className="font-headline-sm text-[16px] font-bold">Executive Biometric Sign-Off</h3>
              <p className="text-[11px] text-[#8fd4c1]">NHIA Dual-Custody Final Authorization</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={authState === 'scanning'}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer text-xs"
          >
            <span className="select-none font-bold">✖️</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex flex-col items-center text-center gap-4">
          <div className="w-full bg-[#f2f3ff] p-3 rounded-xl border border-[#e2e7ff] text-left">
            <div className="flex justify-between text-xs text-[#3f4945] mb-1">
              <span>Payee:</span>
              <span className="font-bold text-[#131b2e] truncate max-w-[180px]">{batch.providerName}</span>
            </div>
            <div className="flex justify-between text-xs text-[#3f4945] mb-1">
              <span>Batch ID:</span>
              <span className="font-mono text-[#00677d] font-semibold">{batch.batchId}</span>
            </div>
            <div className="flex justify-between text-xs text-[#3f4945]">
              <span>Authorized Amount:</span>
              <span className="font-bold text-[#004337] text-sm tabular-nums">₦40,470,000.00</span>
            </div>
          </div>

          {/* Interactive Biometric Sensor Touchpad */}
          <div className="flex flex-col items-center gap-2 my-2">
            <button
              onClick={handleStartScan}
              disabled={authState !== 'idle'}
              className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                authState === 'idle'
                  ? 'bg-[#004337] text-[#aaf0dc] hover:scale-105 active:scale-95 shadow-lg shadow-[#004337]/30 ring-4 ring-[#aaf0dc]/40 cursor-pointer'
                  : authState === 'scanning'
                  ? 'bg-[#0d5c4d] text-white shadow-xl ring-8 ring-[#aaf0dc] animate-pulse cursor-wait'
                  : 'bg-emerald-600 text-white ring-8 ring-emerald-200'
              }`}
            >
              {authState === 'idle' && (
                <span className="text-[40px] leading-none select-none">🔐</span>
              )}
              {authState === 'scanning' && (
                <span className="text-[40px] leading-none animate-spin select-none">⏳</span>
              )}
              {authState === 'verified' && (
                <span className="text-[40px] leading-none select-none">✅</span>
              )}
            </button>

            <span className="font-label-md text-xs text-[#131b2e] font-semibold mt-1">
              {authState === 'idle' && 'Touch or click sensor to authorize'}
              {authState === 'scanning' && 'Verifying Hardware OTP & Biometric Token...'}
              {authState === 'verified' && 'Biometric Identity Verified! Dispatching NIP...'}
            </span>
          </div>

          <div className="w-full border-t border-slate-100 pt-3 text-[11px] text-[#6f7975] flex flex-col gap-0.5">
            <span>Checker ID: Dr. A. O. Adelekan (MD, FMCOG) 🛡️</span>
            <span className="font-mono text-slate-500">Security Key: 🔑 #KEY-OK-9924 • NIBSS Live Stream</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#faf8ff] border-t border-slate-100 flex gap-2">
          <button
            onClick={onClose}
            disabled={authState === 'scanning'}
            className="flex-1 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleStartScan}
            disabled={authState !== 'idle'}
            className="flex-1 py-2.5 rounded-lg bg-[#004337] hover:bg-[#0d5c4d] text-white text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>🔐</span>
            <span>Sign &amp; Dispatch</span>
          </button>
        </div>
      </div>
    </div>
  );
};
