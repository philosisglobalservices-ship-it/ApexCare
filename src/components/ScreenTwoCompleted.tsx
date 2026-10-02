import React, { useState } from 'react';
import { BatchMetadata } from '../types';

interface ScreenTwoCompletedProps {
  batch: BatchMetadata;
  onBackToLedger: () => void;
  onOpenRemittance: () => void;
  onShowToast: (msg: string) => void;
  onOpenAuditSummary?: () => void;
}

export const ScreenTwoCompleted: React.FC<ScreenTwoCompletedProps> = ({
  batch,
  onBackToLedger,
  onOpenRemittance,
  onShowToast,
  onOpenAuditSummary,
}) => {
  const [isBreakdownExpanded, setIsBreakdownExpanded] = useState<boolean>(true);

  const formatNaira = (amount: number) => {
    return '₦' + amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleCopyHash = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(batch.cryptographicHash).catch(() => {});
    }
    onShowToast('Cryptographic hash copied to clipboard');
  };

  const handleShareAdvice = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'NIBSS Instant Settlement Receipt',
          text: `Settlement ${batch.batchId} for ${batch.providerName} (₦40,470,000.00) completed.`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(
            `ApexCare NIBSS Settlement Ref ${batch.batchId} for ${batch.providerName} - Net Amount: ₦40,470,000.00 Dispatched.`
          )
          .catch(() => {});
      }
      onShowToast('Settlement Receipt link copied for sharing');
    }
  };

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Header Banner & Real-Time Settlement Stamp */}
      <div className="px-4 pt-2">
        <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col gap-2 border border-slate-200">
          <div className="flex items-center justify-between gap-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#aaf0dc] text-[#004337] font-label-sm text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#004337] animate-pulse"></span>
              SETTLEMENT COMPLETED ✅
            </span>
            <div className="flex items-center gap-1 text-[#00677d] font-label-sm text-[11px] font-semibold">
              <span className="text-[14px] leading-none select-none">🛡️</span>
              <span>NIBSS NIP Live</span>
            </div>
          </div>

          <div className="flex flex-col pt-1">
            <div className="flex items-baseline justify-between">
              <span className="font-label-md text-[12px] text-[#3f4945]">Batch Reference</span>
              <span className="font-label-md text-[13px] text-[#131b2e] font-semibold tracking-wider font-mono">
                {batch.batchId}
              </span>
            </div>
            <div className="flex items-center justify-between text-[#3f4945] mt-0.5">
              <span className="font-body-sm text-[12px]">Session Identifier</span>
              <span className="font-body-sm text-[12px] text-[#131b2e] truncate max-w-[210px] font-mono">
                {batch.sessionIdentifier}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Settlement Amount Card */}
      <div className="px-4 pt-2">
        <div className="relative overflow-hidden rounded-xl bg-[#0d5c4d] text-white p-4 shadow-md">
          {/* Watermark Pattern Background */}
          <div className="absolute -right-8 -bottom-8 opacity-15 pointer-events-none text-[120px] select-none">
            🏛️
          </div>

          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-[11px] uppercase tracking-wider text-[#8fd4c1] font-semibold">
                Instant Dispatched Net Settlement
              </span>
              <div className="px-2 py-0.5 rounded-full bg-[#004337] text-[#aaf0dc] font-label-sm text-[11px] flex items-center gap-1 border border-white/10 font-bold">
                <span className="text-[13px] leading-none select-none">⚡</span>
                <span>{batch.networkLatency}</span>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="font-metric-naira text-[28px] text-white font-bold leading-tight">
                  {formatNaira(batch.netSettlement)}
                </span>
              </div>
              <span className="font-body-sm text-[12px] text-[#8fd4c1] leading-snug mt-1">
                Forty Million, Four Hundred &amp; Seventy Thousand Naira Only
              </span>
            </div>

            <div className="pt-2 mt-1 flex flex-col gap-1.5 border-t border-white/10 text-[12px]">
              <div className="flex items-center justify-between text-white">
                <span className="font-label-sm text-[11px] opacity-80">Execution Stamp</span>
                <span className="font-label-sm text-[11px] font-semibold font-mono">
                  {batch.executionStamp}
                </span>
              </div>
              <div className="flex items-center justify-between text-white">
                <span className="font-label-sm text-[11px] opacity-80">Clearing Intermediary</span>
                <span className="font-label-sm text-[11px] font-medium">{batch.clearingGateway}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Beneficiary Healthcare Provider Card */}
      <div className="px-4 pt-2">
        <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col gap-2 border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-[11px] text-[#3f4945] uppercase tracking-wider font-bold">
              Beneficiary Healthcare Provider
            </span>
            <span className="px-2 py-0.5 rounded bg-[#eaedff] text-[#00677d] font-label-sm text-[11px] font-semibold">
              Tier 1 Network 🏥
            </span>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#f2f3ff] flex items-center justify-center flex-shrink-0 text-[#004337] border border-[#e2e7ff] text-2xl">
              <span className="select-none">🏥</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-headline-sm text-[17px] text-[#131b2e] truncate font-bold">
                  {batch.providerName}
                </span>
                <span className="text-[15px] leading-none select-none">✅</span>
              </div>
              <span className="font-body-sm text-[12px] text-[#3f4945]">{batch.providerLocations}</span>
              <span className="font-label-sm text-[11px] text-[#00677d] font-medium mt-0.5 font-mono">
                NHIA Reg: {batch.providerNhiaReg}
              </span>
            </div>
          </div>

          <div className="bg-[#f2f3ff] rounded-lg p-2.5 flex flex-col gap-1 border border-[#e2e7ff]">
            <div className="flex items-center justify-between">
              <span className="font-body-sm text-[11px] text-[#3f4945]">Corporate NUBAN</span>
              <span className="font-label-md text-[12px] text-[#131b2e] font-semibold tracking-wide font-mono">
                {batch.accountNumberMasked}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-body-sm text-[11px] text-[#3f4945]">Account Name</span>
              <span className="font-label-sm text-[11px] text-[#131b2e] truncate max-w-[210px] font-mono">
                {batch.accountName}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Settlement Visual Flow */}
      <div className="px-4 pt-2">
        <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col gap-2 border border-slate-200">
          <span className="font-label-md text-[11px] text-[#3f4945] uppercase tracking-wider font-bold">
            Settlement Route &amp; Verification Protocol
          </span>

          {/* Visual Stepper Graphic */}
          <div className="relative flex items-center justify-between px-2 py-3">
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-[#aaf0dc] rounded-full z-0"></div>

            <div className="relative z-10 flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-[#004337] text-white flex items-center justify-center shadow-sm text-sm">
                <span className="select-none">💼</span>
              </div>
              <span className="font-label-sm text-[11px] text-[#131b2e] font-semibold">ApexCare</span>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-[#004337] text-white flex items-center justify-center shadow-sm text-sm">
                <span className="select-none">🌐</span>
              </div>
              <span className="font-label-sm text-[11px] text-[#131b2e] font-semibold">NIBSS NIP</span>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-[#004337] text-white flex items-center justify-center shadow-sm text-sm">
                <span className="select-none">🏦</span>
              </div>
              <span className="font-label-sm text-[11px] text-[#131b2e] font-semibold">Access CBN</span>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-[#004337] text-white flex items-center justify-center shadow-sm text-sm">
                <span className="select-none">🏥</span>
              </div>
              <span className="font-label-sm text-[11px] text-[#131b2e] font-semibold">Reddington</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[#3f4945] px-1 pt-1 border-t border-slate-100">
            <span className="font-body-sm text-[11px] flex items-center gap-1">
              <span className="text-[14px] leading-none select-none">⚡</span>
              Gateway Latency: 1420ms
            </span>
            <span className="font-body-sm text-[11px] flex items-center gap-1">
              <span className="text-[14px] leading-none select-none">🔒</span>
              ISO 20022 Enforced
            </span>
          </div>
        </div>
      </div>

      {/* Statutory Deductions & Net Reconciliation Breakdown */}
      <div className="px-4 pt-2">
        <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col gap-2 border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-headline-sm text-[16px] text-[#131b2e] font-bold">
                Reconciliation Ledger
              </span>
              <span className="font-body-sm text-[11px] text-[#3f4945]">
                {batch.reconciledClaimsCount} Cleared Enrollee Encounters
              </span>
            </div>
            <button
              onClick={() => setIsBreakdownExpanded(!isBreakdownExpanded)}
              className="px-2.5 py-1 rounded-lg bg-[#eaedff] text-[#131b2e] hover:bg-[#dae2fd] transition-colors font-label-sm text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <span>{isBreakdownExpanded ? 'Hide Details' : 'Full Breakdown'}</span>
              <span
                className={`text-[11px] leading-none transition-transform duration-200 ${
                  isBreakdownExpanded ? 'rotate-180' : ''
                }`}
              >
                ▼
              </span>
            </button>
          </div>

          <div className="flex flex-col gap-2 pt-1 text-[13px]">
            <div className="flex items-center justify-between">
              <span className="font-body-md text-[#3f4945]">Gross Adjudicated Incurred Claims</span>
              <span className="font-label-lg text-[#131b2e] font-semibold tabular-nums">
                ₦48,300,000.00
              </span>
            </div>
            <div className="flex items-center justify-between text-[#3f4945]">
              <span className="font-body-md flex items-center gap-1.5">
                <span className="text-[13px] leading-none select-none">🏷️</span>
                Contractual Tariffs &amp; Agreed Discount
              </span>
              <span className="font-body-md text-[#ba1a1a] font-medium tabular-nums">
                -₦4,200,000.00
              </span>
            </div>
            <div className="flex items-center justify-between text-[#3f4945]">
              <span className="font-body-md flex items-center gap-1.5">
                <span className="text-[13px] leading-none select-none">💳</span>
                Direct Enrollee Co-Pays Settled
              </span>
              <span className="font-body-md text-[#ba1a1a] font-medium tabular-nums">
                -₦1,850,000.00
              </span>
            </div>

            {/* Collapsible Details Container */}
            {isBreakdownExpanded && (
              <div className="flex flex-col gap-2 pt-1 border-t border-dashed border-slate-200 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-[#3f4945]">
                  <span className="font-body-md flex items-center gap-1.5">
                    <span className="text-[13px] leading-none select-none">🛡️</span>
                    Statutory WHT (5% Remitted to FIRS)
                  </span>
                  <span className="font-body-md text-[#ba1a1a] font-medium tabular-nums">
                    -₦2,130,000.00
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#3f4945]">
                  <span className="font-body-md flex items-center gap-1.5">
                    <span className="text-[13px] leading-none select-none">⏳</span>
                    Escrow Hold (Disputed Claim #LAG-092)
                  </span>
                  <span className="font-body-md text-[#3f4945] font-medium tabular-nums">
                    ₦350,000.00
                  </span>
                </div>
              </div>
            )}

            {/* Net Total Divider Card */}
            <div className="bg-[#e2e7ff] rounded-xl p-2.5 mt-1 flex items-center justify-between border border-[#bfc9c4]/30">
              <div className="flex flex-col">
                <span className="font-label-sm text-[10px] text-[#3f4945] uppercase tracking-wider font-semibold">
                  Net Electronic Remittance
                </span>
                <span className="font-label-sm text-[11px] text-[#00677d] font-bold">
                  CBN Direct Debit Confirmed ✅
                </span>
              </div>
              <span className="font-headline-md text-[18px] text-[#004337] font-bold tabular-nums">
                {formatNaira(batch.netSettlement)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dual-Custody Governance & Cryptographic Proof Card */}
      <div className="px-4 pt-2">
        <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col gap-2.5 border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="font-headline-sm text-[16px] text-[#131b2e] font-bold">
              Dual-Custody Audit Proof
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#aaf0dc] text-[#004337] font-label-sm text-[11px] font-bold">
              2/2 Signatures Enforced ✅
            </span>
          </div>

          {/* Maker Checker Flow */}
          <div className="flex flex-col gap-2">
            {/* Maker */}
            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#f2f3ff] border border-[#e2e7ff]">
              <div className="w-8 h-8 rounded-full bg-[#dae2fd] text-[#131b2e] flex items-center justify-center flex-shrink-0 mt-0.5 text-sm">
                <span className="select-none">🔑</span>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-[12px] text-[#131b2e] font-bold truncate">
                    Maker: {batch.makerName}
                  </span>
                  <span className="font-label-sm text-[11px] text-[#3f4945] font-mono">11:24 WAT</span>
                </div>
                <span className="font-body-sm text-[11px] text-[#3f4945]">
                  {batch.makerTitle} • 🔑 {batch.makerToken}
                </span>
              </div>
            </div>

            {/* Checker */}
            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#f2f3ff] border border-emerald-200">
              <div className="w-8 h-8 rounded-full bg-[#aaf0dc] text-[#004337] flex items-center justify-center flex-shrink-0 mt-0.5 text-sm">
                <span className="select-none">🔐</span>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-[12px] text-[#131b2e] font-bold truncate">
                    Checker: {batch.checkerName}
                  </span>
                  <span className="font-label-sm text-[11px] text-[#3f4945] font-mono">11:28 WAT</span>
                </div>
                <span className="font-body-sm text-[11px] text-[#3f4945]">
                  {batch.checkerTitle} • 🔐 {batch.checkerSignId}
                </span>
              </div>
            </div>
          </div>

          {/* General Ledger Micro-Ledger */}
          <div className="bg-[#eaedff] rounded-lg p-2.5 flex flex-col gap-1.5 border border-[#dae2fd]">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-[11px] text-[#131b2e] font-bold uppercase tracking-wider">
                ERP General Ledger Impact
              </span>
              <span className="font-label-sm text-[10px] text-[#00677d] font-bold">
                AUTOMATICALLY POSTED ✅
              </span>
            </div>
            <div className="flex items-center justify-between text-[#3f4945] font-body-sm text-[12px]">
              <span>Dr: Provider Claims Expense (A/C 50201)</span>
              <span className="font-label-sm text-[12px] text-[#131b2e] font-semibold tabular-nums">
                {formatNaira(batch.netSettlement)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[#3f4945] font-body-sm text-[12px]">
              <span>Cr: Access Bank Settlement (A/C 10104)</span>
              <span className="font-label-sm text-[12px] text-[#131b2e] font-semibold tabular-nums">
                {formatNaira(batch.netSettlement)}
              </span>
            </div>
          </div>

          {/* Hash Signature with Copy Button */}
          <div className="flex flex-col gap-1 pt-1">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-[11px] text-[#3f4945] uppercase tracking-wider font-bold">
                Cryptographic Audit Hash (SHA-256)
              </span>
              <button
                onClick={handleCopyHash}
                className="flex items-center gap-1 font-label-sm text-[11px] text-[#004337] hover:text-[#0d5c4d] font-bold transition-colors cursor-pointer"
              >
                <span className="text-[13px] leading-none select-none">📋</span>
                <span>Copy Hash</span>
              </button>
            </div>
            <div className="bg-[#e2e7ff] rounded p-2 text-[#131b2e] font-mono text-[11px] leading-tight break-all select-all border border-[#dae2fd]">
              {batch.cryptographicHash}
            </div>
          </div>
        </div>
      </div>

      {/* Automated Post-Settlement Dispatch Feed */}
      <div className="px-4 pt-2">
        <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col gap-2 border border-slate-200">
          <span className="font-label-md text-[11px] text-[#3f4945] uppercase tracking-wider font-bold">
            Automated Notification Signals
          </span>

          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-[#aaf0dc] text-[#004337] flex items-center justify-center flex-shrink-0 text-xs">
                <span className="select-none">📡</span>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-label-md text-[12px] text-[#131b2e] font-semibold">
                  Provider EDI Webhook
                </span>
                <span className="font-body-sm text-[11px] text-[#3f4945] truncate">
                  HTTP 200 OK • Reddington Healthcare Server
                </span>
              </div>
              <span className="font-label-sm text-[11px] text-[#004337] font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Sent ✅
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-[#aaf0dc] text-[#004337] flex items-center justify-center flex-shrink-0 text-xs">
                <span className="select-none">✉️</span>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-label-md text-[12px] text-[#131b2e] font-semibold">
                  Payment Advice PDF
                </span>
                <span className="font-body-sm text-[11px] text-[#3f4945] truncate">
                  Dispatched to reddington.finance@hospital.com
                </span>
              </div>
              <span className="font-label-sm text-[11px] text-[#004337] font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Delivered 📥
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-[#aaf0dc] text-[#004337] flex items-center justify-center flex-shrink-0 text-xs">
                <span className="select-none">☁️</span>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-label-md text-[12px] text-[#131b2e] font-semibold">
                  NHIA Statutory Filing
                </span>
                <span className="font-body-sm text-[11px] text-[#3f4945] truncate">
                  Federal Clearing Node 01 Synced
                </span>
              </div>
              <span className="font-label-sm text-[11px] text-[#004337] font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Synced 🔄
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Operations Actions */}
      <div className="px-4 pt-3 flex flex-col gap-2">
        <button
          onClick={onOpenRemittance}
          className="w-full h-12 rounded-lg bg-[#0d5c4d] hover:bg-[#004337] text-white font-label-lg text-[14px] font-bold flex items-center justify-center gap-2 active:scale-[0.99] transition-all shadow-md cursor-pointer"
        >
          <span className="text-[18px] leading-none select-none">📥</span>
          <span>Download Official Remittance Slip (PDF)</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleShareAdvice}
            className="w-full h-11 rounded-lg bg-[#50d9fe]/20 text-[#005c70] border border-[#50d9fe]/40 font-label-md text-[12px] font-bold flex items-center justify-center gap-1.5 hover:bg-[#50d9fe]/30 active:scale-[0.99] transition-all cursor-pointer"
          >
            <span className="text-[16px] leading-none select-none">↗️</span>
            <span>Share Advice</span>
          </button>

          <button
            onClick={onBackToLedger}
            className="w-full h-11 rounded-lg bg-[#e2e7ff] text-[#131b2e] border border-slate-200 font-label-md text-[12px] font-bold flex items-center justify-center gap-1.5 hover:bg-[#dae2fd] active:scale-[0.99] transition-all cursor-pointer"
          >
            <span className="text-[16px] leading-none select-none">📋</span>
            <span>Claims Ledger</span>
          </button>
        </div>

        {onOpenAuditSummary && (
          <button
            onClick={onOpenAuditSummary}
            className="w-full h-10 rounded-lg bg-white text-[#004337] border border-emerald-300 font-label-md text-[12px] font-bold flex items-center justify-center gap-1.5 hover:bg-emerald-50 active:scale-[0.99] transition-all shadow-sm cursor-pointer"
          >
            <span className="text-[16px] leading-none select-none">📊</span>
            <span>View Batch Audit Summary &amp; KPI Metrics</span>
          </button>
        )}
      </div>
    </div>
  );
};
