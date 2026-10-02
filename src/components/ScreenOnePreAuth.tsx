import React, { useState } from 'react';
import { BatchMetadata, ClaimItem } from '../types';

interface ScreenOnePreAuthProps {
  batch: BatchMetadata;
  claims: ClaimItem[];
  onAuthorize: () => void;
  onOpenClaim: (claim: ClaimItem) => void;
  onOpenRemittance: () => void;
  onFlagBatch: () => void;
  onShowToast: (msg: string) => void;
  onOpenAuditSummary?: () => void;
  isAuthorizing?: boolean;
}

export const ScreenOnePreAuth: React.FC<ScreenOnePreAuthProps> = ({
  batch,
  claims,
  onAuthorize,
  onOpenClaim,
  onOpenRemittance,
  onFlagBatch,
  onShowToast,
  onOpenAuditSummary,
  isAuthorizing = false,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredClaims = claims.filter((claim) => {
    const matchesFilter =
      selectedFilter === 'all' ||
      claim.category === selectedFilter ||
      (selectedFilter === 'disputed' && claim.status === 'Disputed');

    const matchesSearch =
      searchQuery.trim() === '' ||
      claim.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.claimNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.procedureName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const formatNaira = (amount: number) => {
    return '₦' + amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Dual-Control Security Alert Header */}
      <div className="px-4 pt-2 pb-1">
        <div className="bg-[#dae2fd] p-4 rounded-xl shadow-sm flex flex-col gap-1 border border-[#bfc9c4]/30">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[18px] leading-none select-none">🛡️</span>
              <span className="font-label-sm text-[11px] text-[#131b2e] uppercase tracking-wider font-bold">
                NHIA Dual-Control Protocol
              </span>
            </div>
            <div className="flex items-center gap-1 bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
              <span className="font-label-sm text-[11px] font-semibold">1/2 Signatures ⏳</span>
            </div>
          </div>
          <p className="font-body-sm text-[12px] text-[#3f4945] leading-relaxed">
            <strong className="font-label-md text-[#131b2e] font-semibold">Segregation of Duties Enforced:</strong>{' '}
            Initiated by Treasury Analyst K. Alabi (ACCA). Final sign-off required by Financial Controller or CFO.
          </p>
          <div className="flex items-center gap-1.5 text-[#004337] pt-1">
            <span className="text-[15px] leading-none select-none">✅</span>
            <span className="font-label-sm text-[11px] font-medium">
              NIBSS Instant Payment (NIP) / CBN Auto-Reconciliation Ready
            </span>
          </div>
        </div>
      </div>

      {/* Provider & Batch Context Banner */}
      <div className="px-4 py-1">
        <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col gap-1 border border-slate-200/80">
          <div className="flex items-start justify-between">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="bg-[#e2e7ff] text-[#00677d] px-2 py-0.5 rounded-full font-label-sm text-[11px] font-bold">
                  {batch.providerTier}
                </span>
                <span className="font-label-sm text-[11px] text-[#6f7975] font-mono">
                  BATCH {batch.batchId}
                </span>
              </div>
              <h2 className="font-headline-sm text-[18px] text-[#131b2e] truncate font-bold">
                {batch.providerName}
              </h2>
              <p className="font-body-sm text-[12px] text-[#3f4945]">{batch.providerLocations}</p>
            </div>
            <button
              onClick={() => onShowToast(`HCP Registry: ${batch.providerNhiaReg}`)}
              title="View Healthcare Provider Details"
              className="w-11 h-11 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] flex items-center justify-center text-[#004337] flex-shrink-0 transition-colors text-xl"
            >
              <span className="select-none">🏥</span>
            </button>
          </div>
        </div>
      </div>

      {/* Settlement Financial Summary (Clinical Enterprise Vanguard Card) */}
      <div className="px-4 py-1">
        <div className="bg-[#004337] text-white rounded-xl p-4 shadow-md flex flex-col gap-3 relative overflow-hidden">
          {/* Ambient background decoration */}
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#0d5c4d] rounded-full opacity-40 blur-2xl pointer-events-none"></div>

          <div className="flex items-center justify-between relative z-10">
            <span className="font-label-sm text-[11px] text-[#aaf0dc] uppercase tracking-wider font-semibold">
              Net Settlement Payable
            </span>
            <span className="bg-[#0d5c4d] text-[#8fd4c1] px-2 py-0.5 rounded-full font-label-sm text-[11px] flex items-center gap-1 border border-white/10">
              <span className="text-[12px] leading-none select-none">🔒</span> Statutory NHIA Tier
            </span>
          </div>

          <div className="flex flex-col relative z-10">
            <div className="flex items-baseline gap-1">
              <span className="font-metric-naira text-[28px] text-white font-bold tracking-tight">
                {formatNaira(batch.netSettlement)}
              </span>
            </div>
            <span className="font-body-sm text-[12px] text-[#8fd4c1]">
              Forty Million, Four Hundred &amp; Seventy Thousand Naira Only
            </span>
          </div>

          {/* Financial Deductions Ledger */}
          <div className="bg-[#00201a]/30 border border-white/10 rounded-lg p-2.5 flex flex-col gap-2 relative z-10">
            <div className="flex justify-between items-center text-white font-body-sm text-[12px]">
              <span className="flex items-center gap-1.5 opacity-90">Gross Adjudicated (42 Claims)</span>
              <span className="font-label-md text-[13px] font-semibold tabular-nums">
                {formatNaira(batch.grossAdjudicated)}
              </span>
            </div>
            <div className="flex justify-between items-center text-[#8fd4c1] font-body-sm text-[12px]">
              <span className="opacity-90">Contractual Tariff Deductions</span>
              <span className="font-label-md text-[13px] font-semibold tabular-nums">
                -{formatNaira(batch.tariffDeductions)}
              </span>
            </div>
            <div className="flex justify-between items-center text-[#8fd4c1] font-body-sm text-[12px]">
              <span className="opacity-90">Enrollee Co-Pay Realized</span>
              <span className="font-label-md text-[13px] font-semibold tabular-nums">
                -{formatNaira(batch.enrolleeCopay)}
              </span>
            </div>
            <div className="flex justify-between items-center text-[#8fd4c1] font-body-sm text-[12px]">
              <span className="opacity-90">Withholding Tax (WHT 5% NHIA)</span>
              <span className="font-label-md text-[13px] font-semibold tabular-nums">
                -{formatNaira(batch.withholdingTax)}
              </span>
            </div>
          </div>

          {/* Account Destination Verification Bar */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 flex items-center justify-between text-white relative z-10 border border-white/10">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[17px] leading-none select-none">🏦</span>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-[12px] font-semibold truncate">
                  {batch.accountNumberMasked}
                </span>
                <span className="font-label-sm text-[10px] text-[#8fd4c1]">
                  Verified HCP Corporate NUBAN
                </span>
              </div>
            </div>
            <span className="text-[17px] leading-none select-none">🛡️</span>
          </div>
        </div>
      </div>

      {/* Reconciled vs Dispute Alert Bar */}
      <div className="px-4 py-1">
        <div
          onClick={onOpenAuditSummary}
          title="Click to view full Audit Summary & Adjudication SLA"
          className="bg-[#f2f3ff] hover:bg-[#eaedff] transition-colors cursor-pointer rounded-xl p-2.5 flex items-center justify-between border border-[#e2e7ff] group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform text-base">
              <span className="select-none">✅</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-[13px] text-[#131b2e] font-semibold flex items-center gap-1">
                <span>41 Claims Fully Reconciled</span>
                <span className="text-[10px] text-[#00677d] font-normal underline">View Audit 📊</span>
              </span>
              <span className="font-body-sm text-[11px] text-[#3f4945]">
                Cleared for immediate automated remittance (97.6% SLA)
              </span>
            </div>
          </div>
          <span className="bg-amber-100 text-amber-900 border border-amber-200 font-label-sm text-[11px] px-2.5 py-1 rounded-full font-bold">
            1 Disputed ⚠️
          </span>
        </div>
      </div>

      {/* Disputed Claim Notice Card */}
      <div className="px-4 py-1">
        <div
          onClick={() => {
            const disputedClaim = claims.find((c) => c.status === 'Disputed') || claims[4];
            onOpenClaim(disputedClaim);
          }}
          className="bg-[#e2e7ff] hover:bg-[#dae2fd] transition-colors cursor-pointer rounded-xl p-3.5 flex flex-col gap-1 border border-amber-200/60"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[#553300]">
              <span className="text-[17px] leading-none select-none">⏸️</span>
              <span className="font-label-sm text-[11px] uppercase font-bold tracking-wider">
                Withheld from Batch
              </span>
            </div>
            <span className="font-label-sm text-[11px] text-[#3f4945] font-mono">
              {batch.disputedClaimId}
            </span>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="font-label-md text-[13px] text-[#131b2e] font-bold">
              {formatNaira(batch.disputedAmount)} Reserved
            </span>
            <span className="font-body-sm text-[11px] text-[#553300] font-medium bg-amber-100 px-2 py-0.5 rounded">
              Parked for Clinical Peer Review ⏳
            </span>
          </div>
          <p className="font-body-sm text-[11px] text-[#3f4945] leading-snug">
            {batch.disputedReason}
          </p>
        </div>
      </div>

      {/* Claim Breakdown Section Header */}
      <div className="px-4 pt-3 pb-1 flex items-center justify-between">
        <h3 className="font-headline-sm text-[17px] text-[#131b2e] font-bold">Batch Claim Breakdown</h3>
        <span className="font-label-sm text-[11px] text-[#00677d] font-semibold bg-[#e2e7ff] px-2 py-0.5 rounded-full">
          📋 {claims.length} Total Records
        </span>
      </div>

      {/* Horizontal Filter Pills */}
      <div className="px-4 py-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-3 py-1.5 rounded-full font-label-md text-[12px] whitespace-nowrap shadow-sm flex items-center gap-1 transition-all ${
            selectedFilter === 'all'
              ? 'bg-[#004337] text-white font-bold'
              : 'bg-[#e2e7ff] text-[#131b2e] hover:bg-[#dae2fd]'
          }`}
        >
          <span>All</span>
          <span
            className={`px-1.5 rounded-full text-[10px] ${
              selectedFilter === 'all' ? 'bg-[#0d5c4d] text-white' : 'bg-white/60 text-[#131b2e]'
            }`}
          >
            {claims.length}
          </span>
        </button>

        <button
          onClick={() => setSelectedFilter('surgical')}
          className={`px-3 py-1.5 rounded-full font-label-md text-[12px] whitespace-nowrap transition-all ${
            selectedFilter === 'surgical'
              ? 'bg-[#004337] text-white font-bold'
              : 'bg-[#e2e7ff] text-[#131b2e] hover:bg-[#dae2fd]'
          }`}
        >
          Surgical (14)
        </button>

        <button
          onClick={() => setSelectedFilter('inpatient')}
          className={`px-3 py-1.5 rounded-full font-label-md text-[12px] whitespace-nowrap transition-all ${
            selectedFilter === 'inpatient'
              ? 'bg-[#004337] text-white font-bold'
              : 'bg-[#e2e7ff] text-[#131b2e] hover:bg-[#dae2fd]'
          }`}
        >
          Inpatient ICU (8)
        </button>

        <button
          onClick={() => setSelectedFilter('diagnostics')}
          className={`px-3 py-1.5 rounded-full font-label-md text-[12px] whitespace-nowrap transition-all ${
            selectedFilter === 'diagnostics'
              ? 'bg-[#004337] text-white font-bold'
              : 'bg-[#e2e7ff] text-[#131b2e] hover:bg-[#dae2fd]'
          }`}
        >
          Diagnostics (20)
        </button>

        <button
          onClick={() => setSelectedFilter('pharmacy')}
          className={`px-3 py-1.5 rounded-full font-label-md text-[12px] whitespace-nowrap transition-all ${
            selectedFilter === 'pharmacy'
              ? 'bg-[#004337] text-white font-bold'
              : 'bg-[#e2e7ff] text-[#131b2e] hover:bg-[#dae2fd]'
          }`}
        >
          Pharmacy (7)
        </button>
      </div>

      {/* Claims List Cards */}
      <div className="px-4 py-1.5 flex flex-col gap-2.5">
        {filteredClaims.map((claim) => (
          <div
            key={claim.id}
            onClick={() => onOpenClaim(claim)}
            className="bg-white p-3.5 rounded-xl shadow-sm flex flex-col gap-2 border border-slate-200 hover:border-[#004337]/50 active:scale-[0.99] transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex flex-col min-w-0 pr-2">
                <span className="font-label-sm text-[11px] text-[#00677d] font-mono">
                  {claim.claimNumber}
                </span>
                <h4 className="font-label-lg text-[13px] text-[#131b2e] font-bold truncate">
                  {claim.patientName} • {claim.procedureName}
                </h4>
              </div>
              <span
                className={`font-label-sm text-[11px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 flex-shrink-0 ${
                  claim.status === 'Approved'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}
              >
                <span className="text-[12px] leading-none">
                  {claim.status === 'Approved' ? '✅' : '⚠️'}
                </span>
                {claim.status}
              </span>
            </div>

            <div className="bg-[#f2f3ff] p-2.5 rounded-lg flex items-center justify-between text-[#131b2e]">
              <div className="flex flex-col">
                <span className="font-body-sm text-[11px] text-[#6f7975]">Gross Billed</span>
                <span className="font-label-md text-[13px] font-semibold tabular-nums">
                  {formatNaira(claim.grossBilled)}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-body-sm text-[11px] text-[#6f7975]">Net Remittable</span>
                <span className="font-label-md text-[13px] text-[#004337] font-bold tabular-nums">
                  {formatNaira(claim.netRemittable)}
                </span>
              </div>
            </div>

            {/* Micro Verification / Compliance Badge */}
            <div className="flex items-center gap-1 pt-0.5 text-xs">
              {claim.badgeType === 'standard' && (
                <div className="flex items-center gap-1 text-emerald-700">
                  <span className="text-[13px] leading-none">✅</span>
                  <span className="font-label-sm text-[11px]">{claim.verificationBadge}</span>
                </div>
              )}
              {claim.badgeType === 'preauth' && (
                <div className="flex items-center gap-1 text-[#00677d]">
                  <span className="text-[13px] leading-none">🔗</span>
                  <span className="font-label-sm text-[11px] font-medium">{claim.verificationBadge}</span>
                </div>
              )}
              {claim.badgeType === 'wht' && (
                <div className="flex items-center gap-1 text-[#3f4945]">
                  <span className="text-[13px] leading-none">🧾</span>
                  <span className="font-label-sm text-[11px]">{claim.verificationBadge}</span>
                </div>
              )}
              {claim.badgeType === 'disallowance' && (
                <div className="flex items-center gap-1 text-amber-800">
                  <span className="text-[13px] leading-none">🏷️</span>
                  <span className="font-label-sm text-[11px] font-medium">{claim.verificationBadge}</span>
                </div>
              )}
              {claim.badgeType === 'disputed' && (
                <div className="flex items-center gap-1 text-rose-700">
                  <span className="text-[13px] leading-none">⚠️</span>
                  <span className="font-label-sm text-[11px] font-medium">{claim.verificationBadge}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Treasury Release & Compliance Audit Stamp */}
      <div className="px-4 pt-3 pb-1">
        <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col gap-2.5 border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[11px] text-[#6f7975] uppercase tracking-wider font-bold">
              Audit &amp; General Ledger Posting
            </span>
            <span className="text-[16px] leading-none select-none">🛡️</span>
          </div>

          {/* Maker Row */}
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">
              <span className="leading-none">✅</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-md text-[12px] text-[#131b2e] font-semibold">
                Maker: {batch.makerName} — {batch.makerTitle}
              </span>
              <span className="font-body-sm text-[11px] text-[#6f7975]">
                Initiated {batch.makerTimestamp} • 🔑 {batch.makerToken}
              </span>
            </div>
          </div>

          {/* Checker Row */}
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">
              <span className="leading-none">⏳</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-md text-[12px] text-[#131b2e] font-semibold">
                Checker: {batch.checkerName} / CFO Office
              </span>
              <span className="font-body-sm text-[11px] text-amber-700 font-medium">
                Pending Final Executive Review &amp; Authorization
              </span>
            </div>
          </div>

          {/* General Ledger Code Trace */}
          <div className="bg-[#f2f3ff] p-2.5 rounded-lg flex flex-col gap-1 border border-[#e2e7ff]">
            <span className="font-label-sm text-[10px] text-[#6f7975] uppercase tracking-wider font-semibold">
              Double-Entry Posting Mapping:
            </span>
            <code className="font-label-sm text-[11px] text-[#131b2e] font-mono break-all">
              Dr: Provider Claims Expense (A/C 50201)
            </code>
            <code className="font-label-sm text-[11px] text-[#131b2e] font-mono break-all">
              Cr: Access Bank Settlement (A/C 10104)
            </code>
          </div>
        </div>
      </div>

      {/* Operational Actions CTAs */}
      <div className="px-4 pt-3 flex flex-col gap-2">
        {/* Primary Settlement Action Button */}
        <button
          onClick={onAuthorize}
          disabled={isAuthorizing}
          className="w-full h-12 bg-[#004337] hover:bg-[#0d5c4d] text-white rounded-lg font-label-lg text-[14px] font-bold flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all disabled:opacity-80 cursor-pointer"
        >
          {isAuthorizing ? (
            <>
              <span className="text-[18px] leading-none animate-spin">⏳</span>
              <span>Validating Biometric Token...</span>
            </>
          ) : (
            <>
              <span className="text-[18px] leading-none select-none">🔐</span>
              <span>Authorize Settlement &amp; Dispatch (₦40.47M)</span>
            </>
          )}
        </button>

        {/* Secondary Download Export Advice */}
        <button
          onClick={onOpenRemittance}
          className="w-full h-11 bg-[#e2e7ff] text-[#00677d] rounded-lg font-label-md text-[13px] font-semibold flex items-center justify-center gap-2 hover:bg-[#dae2fd] active:scale-[0.99] transition-all border border-[#bfc9c4]/40 cursor-pointer"
        >
          <span className="text-[16px] leading-none select-none">📥</span>
          <span>Download Remittance Advice (NHIA PDF/Excel)</span>
        </button>

        {/* Tertiary Dispute Action */}
        <button
          onClick={onFlagBatch}
          className="w-full h-10 bg-[#ffdad6] text-[#93000a] rounded-lg font-label-md text-[12px] font-medium flex items-center justify-center gap-1.5 hover:bg-red-100 active:scale-[0.99] transition-all cursor-pointer"
        >
          <span className="text-[15px] leading-none select-none">↩️</span>
          <span>Flag Batch / Return to Claims Audit</span>
        </button>
      </div>
    </div>
  );
};
