import React from 'react';
import { ClaimItem } from '../types';

interface ClaimDetailModalProps {
  claim: ClaimItem | null;
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const ClaimDetailModal: React.FC<ClaimDetailModalProps> = ({
  claim,
  isOpen,
  onClose,
  onShowToast,
}) => {
  if (!isOpen || !claim) return null;

  const formatNaira = (amount: number) => {
    return '₦' + amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom duration-200">
        {/* Grab Handle for mobile */}
        <div className="w-10 h-1.5 bg-slate-300 rounded-full mx-auto my-2.5 sm:hidden"></div>

        {/* Modal Header */}
        <div className="bg-[#004337] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[18px] leading-none select-none">📋</span>
            <div>
              <span className="font-mono text-[11px] text-[#8fd4c1] block">{claim.claimNumber}</span>
              <h3 className="font-headline-sm text-sm font-bold text-white truncate max-w-[260px]">
                {claim.patientName} — {claim.procedureName}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer text-xs"
          >
            <span className="select-none font-bold">✖️</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto flex flex-col gap-4 text-xs text-[#131b2e]">
          {/* Status Alert Banner */}
          <div
            className={`p-3 rounded-xl border flex items-center justify-between ${
              claim.status === 'Approved'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-[16px] leading-none select-none">
                {claim.status === 'Approved' ? '✅' : '⏳'}
              </span>
              <div>
                <span className="font-bold block">Adjudication Status: {claim.status}</span>
                <span className="text-[11px] opacity-90">{claim.verificationBadge}</span>
              </div>
            </div>
          </div>

          {/* Clinical Encounter Parameters */}
          <div className="bg-[#f2f3ff] p-3.5 rounded-xl border border-[#e2e7ff] flex flex-col gap-2">
            <span className="font-bold text-[11px] text-[#00677d] uppercase tracking-wider">
              Clinical Encounter Data
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500 block">Enrollee HMO ID:</span>
                <span className="font-mono font-bold">{claim.enrolleeId}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Treating Physician:</span>
                <span className="font-bold">{claim.treatingPhysician}</span>
              </div>
              <div>
                <span className="text-slate-500 block">ICD-10 Code:</span>
                <span className="font-mono font-semibold">{claim.icd10Code}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Encounter Window:</span>
                <span>
                  {claim.admissionDate} → {claim.dischargeDate}
                </span>
              </div>
            </div>
            {claim.notes && (
              <div className="pt-2 border-t border-slate-200 text-[11px] text-[#3f4945]">
                <strong className="text-slate-700">Medical Notes:</strong> {claim.notes}
              </div>
            )}
          </div>

          {/* Financial Tariff Calculation */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-[#eaedff] px-3.5 py-2 font-bold text-[11px] text-[#131b2e] flex justify-between">
              <span>Financial Ledger Breakdown</span>
              <span>Amount</span>
            </div>
            <div className="divide-y divide-slate-100 text-[12px]">
              <div className="px-3.5 py-2 flex justify-between">
                <span className="text-slate-600">Gross Provider Charge</span>
                <span className="font-mono font-semibold">{formatNaira(claim.grossBilled)}</span>
              </div>
              {claim.disallowanceAmount && (
                <div className="px-3.5 py-2 flex justify-between text-amber-700">
                  <span className="flex items-center gap-1">
                    <span>🏷️</span>
                    <span>Contractual Disallowance Deducted</span>
                  </span>
                  <span className="font-mono font-semibold">
                    -{formatNaira(claim.disallowanceAmount)}
                  </span>
                </div>
              )}
              {claim.whtAmount && (
                <div className="px-3.5 py-2 flex justify-between text-rose-700">
                  <span className="flex items-center gap-1">
                    <span>🧾</span>
                    <span>Withholding Tax (5% WHT)</span>
                  </span>
                  <span className="font-mono font-semibold">-{formatNaira(claim.whtAmount)}</span>
                </div>
              )}
              <div className="px-3.5 py-2.5 flex justify-between bg-[#f2f3ff] font-bold text-sm text-[#004337] border-t border-slate-200">
                <span>Net Authorized Remittance</span>
                <span className="font-mono">{formatNaira(claim.netRemittable)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#faf8ff] border-t border-slate-200 flex gap-2">
          {claim.status === 'Disputed' ? (
            <button
              onClick={() => {
                onShowToast(`Peer Review Escalation Filed for ${claim.claimNumber}`);
                onClose();
              }}
              className="w-full py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <span className="text-[15px] leading-none select-none">⚠️</span>
              <span>Escalate to Medical Director Peer Review</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onShowToast(`Pre-Authorization Certificate copied for ${claim.claimNumber}`);
                onClose();
              }}
              className="w-full py-2.5 rounded-lg bg-[#004337] hover:bg-[#0d5c4d] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <span className="text-[15px] leading-none select-none">✅</span>
              <span>Copy Pre-Auth Reference</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
