import React, { useState } from 'react';
import { BatchMetadata, ClaimItem } from '../types';

interface ScreenAuditSummaryProps {
  batch: BatchMetadata;
  claims: ClaimItem[];
  onBackToLedger: () => void;
  onOpenClaim: (claim: ClaimItem) => void;
  onOpenRemittance: () => void;
  onShowToast: (msg: string) => void;
}

export const ScreenAuditSummary: React.FC<ScreenAuditSummaryProps> = ({
  batch,
  claims,
  onBackToLedger,
  onOpenClaim,
  onOpenRemittance,
  onShowToast,
}) => {
  const [timeframe, setTimeframe] = useState<'batch' | 'mtd' | 'ytd'>('batch');

  const formatNaira = (amount: number) => {
    return '₦' + amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Metrics by timeframe
  const metrics = {
    batch: {
      totalClaims: 42,
      totalFlagged: 1,
      totalCleared: 41,
      successRate: 97.6,
      grossAmount: batch.grossAdjudicated,
      netAmount: batch.netSettlement,
      flaggedAmount: batch.disputedAmount,
      tariffSavings: batch.tariffDeductions,
      whtDeducted: batch.withholdingTax,
      slaBenchmark: 95.0,
      avgLatency: '1.42s',
    },
    mtd: {
      totalClaims: 318,
      totalFlagged: 6,
      totalCleared: 312,
      successRate: 98.1,
      grossAmount: 342150000,
      netAmount: 284500000,
      flaggedAmount: 2100000,
      tariffSavings: 31400000,
      whtDeducted: 14950000,
      slaBenchmark: 95.0,
      avgLatency: '1.58s',
    },
    ytd: {
      totalClaims: 1284,
      totalFlagged: 14,
      totalCleared: 1270,
      successRate: 98.9,
      grossAmount: 1420800000,
      netAmount: 1184200000,
      flaggedAmount: 4850000,
      tariffSavings: 132400000,
      whtDeducted: 62200000,
      slaBenchmark: 95.0,
      avgLatency: '1.64s',
    },
  }[timeframe];

  // Category breakdown for chart
  const categoryStats = [
    { name: 'Surgical', total: 14, approved: 13, flagged: 1, amount: 11200000, color: '#004337' },
    { name: 'Inpatient ICU', total: 8, approved: 8, flagged: 0, amount: 18400000, color: '#00677d' },
    { name: 'Diagnostics', total: 20, approved: 20, flagged: 0, amount: 8200000, color: '#21695a' },
    { name: 'Pharmacy & Biologics', total: 7, approved: 7, flagged: 0, amount: 2670000, color: '#553300' },
  ];

  const flaggedClaims = claims.filter((c) => c.status === 'Disputed' || c.badgeType === 'disputed');

  // SVG Ring Chart parameters
  const ringRadius = 52;
  const ringCircumference = 2 * Math.PI * ringRadius; // ~326.7
  const strokeOffset = ringCircumference - (metrics.successRate / 100) * ringCircumference;

  return (
    <div className="flex flex-col w-full pb-12">
      {/* Audit Banner Header */}
      <div className="px-4 pt-2 pb-1">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-[18px] leading-none select-none">📊</span>
              <span className="font-label-sm text-[11px] text-[#131b2e] uppercase tracking-wider font-bold">
                Clinical Audit &amp; Settlement Performance
              </span>
            </div>
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-label-sm text-[10px] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              NHIA SLA Compliant ✅
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-0.5">
            <div>
              <h2 className="font-headline-sm text-[18px] text-[#131b2e] font-bold">
                Audit Summary Report
              </h2>
              <p className="font-body-sm text-[12px] text-[#3f4945]">
                {batch.providerName} • {batch.batchId}
              </p>
            </div>
            <button
              onClick={() => onShowToast(`Audit session identifier: ${batch.sessionIdentifier}`)}
              className="text-[#00677d] hover:text-[#004337] text-xs font-semibold flex items-center gap-1"
            >
              <span className="text-[13px] leading-none select-none">ℹ️</span>
              <span>Audit Log</span>
            </button>
          </div>

          {/* Timeframe Selector Segmented Bar */}
          <div className="flex items-center gap-1 p-1 bg-[#f2f3ff] rounded-lg mt-1 border border-[#e2e7ff]">
            <button
              onClick={() => setTimeframe('batch')}
              className={`flex-1 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                timeframe === 'batch'
                  ? 'bg-white text-[#004337] shadow-sm font-bold'
                  : 'text-[#3f4945] hover:text-[#131b2e]'
              }`}
            >
              Current Batch
            </button>
            <button
              onClick={() => setTimeframe('mtd')}
              className={`flex-1 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                timeframe === 'mtd'
                  ? 'bg-white text-[#004337] shadow-sm font-bold'
                  : 'text-[#3f4945] hover:text-[#131b2e]'
              }`}
            >
              MTD (Oct 2026)
            </button>
            <button
              onClick={() => setTimeframe('ytd')}
              className={`flex-1 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                timeframe === 'ytd'
                  ? 'bg-white text-[#004337] shadow-sm font-bold'
                  : 'text-[#3f4945] hover:text-[#131b2e]'
              }`}
            >
              YTD 2026
            </button>
          </div>
        </div>
      </div>

      {/* Primary 3 KPI Metric Cards */}
      <div className="px-4 py-1.5 grid grid-cols-3 gap-2">
        {/* KPI 1: Total Claims Processed */}
        <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#6f7975] mb-1">
            <span className="font-label-sm text-[10px] uppercase font-bold tracking-wider">
              Claims
            </span>
            <span className="text-[15px] leading-none select-none">🧾</span>
          </div>
          <div>
            <span className="font-metric-naira text-[22px] font-bold text-[#131b2e] block leading-tight">
              {metrics.totalClaims}
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
              {metrics.totalCleared} Cleared ✅
            </span>
          </div>
        </div>

        {/* KPI 2: Total Flagged Items */}
        <div className="bg-white p-3 rounded-xl shadow-sm border border-amber-200/80 bg-gradient-to-b from-white to-amber-50/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-800 mb-1">
            <span className="font-label-sm text-[10px] uppercase font-bold tracking-wider">
              Flagged
            </span>
            <span className="text-[15px] leading-none select-none">🚩</span>
          </div>
          <div>
            <span className="font-metric-naira text-[22px] font-bold text-[#93000a] block leading-tight">
              {metrics.totalFlagged}
            </span>
            <span className="text-[10px] text-amber-900 font-medium block mt-0.5 truncate">
              {formatNaira(metrics.flaggedAmount)}
            </span>
          </div>
        </div>

        {/* KPI 3: Settlement Success Rate */}
        <div className="bg-white p-3 rounded-xl shadow-sm border border-emerald-200/80 bg-gradient-to-b from-white to-emerald-50/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-800 mb-1">
            <span className="font-label-sm text-[10px] uppercase font-bold tracking-wider">
              Success
            </span>
            <span className="text-[15px] leading-none select-none">✅</span>
          </div>
          <div>
            <span className="font-metric-naira text-[22px] font-bold text-[#004337] block leading-tight">
              {metrics.successRate}%
            </span>
            <span className="text-[10px] text-emerald-800 font-semibold block mt-0.5">
              +2.6% vs SLA
            </span>
          </div>
        </div>
      </div>

      {/* Main Data Visualization Card 1: Settlement Success Rate Gauge & Donut Chart */}
      <div className="px-4 py-1.5">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="font-headline-sm text-[15px] text-[#131b2e] font-bold">
                Settlement Success &amp; Adjudication Rate
              </h3>
              <p className="font-body-sm text-[11px] text-[#6f7975]">
                Automated NIBSS NIP Dispatched vs Escrow Exception Ratio
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-[#00677d] bg-[#e2e7ff] px-2 py-0.5 rounded">
              {metrics.totalCleared}/{metrics.totalClaims} Cleared
            </span>
          </div>

          {/* Donut Chart Visual & Breakdown Legend */}
          <div className="flex items-center justify-around gap-4 py-2">
            {/* SVG Circular Donut Chart */}
            <div className="relative flex items-center justify-center flex-shrink-0">
              <svg width="130" height="130" viewBox="0 0 130 130" className="transform -rotate-90">
                {/* Background Ring Track */}
                <circle
                  cx="65"
                  cy="65"
                  r={ringRadius}
                  fill="transparent"
                  stroke="#eaedff"
                  strokeWidth="14"
                />
                {/* Flagged / Exception Arc */}
                <circle
                  cx="65"
                  cy="65"
                  r={ringRadius}
                  fill="transparent"
                  stroke="#f59e0b"
                  strokeWidth="14"
                  strokeDasharray={`${ringCircumference} ${ringCircumference}`}
                  strokeDashoffset={0}
                />
                {/* Success Clearance Arc */}
                <circle
                  cx="65"
                  cy="65"
                  r={ringRadius}
                  fill="transparent"
                  stroke="#004337"
                  strokeWidth="14"
                  strokeDasharray={`${ringCircumference} ${ringCircumference}`}
                  strokeDashoffset={strokeOffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              {/* Center Donut Metric */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="font-metric-naira text-[20px] font-bold text-[#004337] leading-none">
                  {metrics.successRate}%
                </span>
                <span className="text-[10px] text-[#6f7975] font-semibold mt-0.5">SLA Passed ✅</span>
              </div>
            </div>

            {/* Structured Legend */}
            <div className="flex flex-col gap-2.5 flex-1 min-w-0 text-xs">
              <div className="flex items-start gap-2">
                <div className="w-3 h-3 rounded-full bg-[#004337] flex-shrink-0 mt-0.5"></div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-[#131b2e] leading-tight">
                    {metrics.totalCleared} Approved &amp; Settled
                  </span>
                  <span className="text-[11px] text-[#6f7975]">
                    {formatNaira(metrics.netAmount)} remitted
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-3 h-3 rounded-full bg-[#f59e0b] flex-shrink-0 mt-0.5"></div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-[#93000a] leading-tight">
                    {metrics.totalFlagged} Flagged in Escrow ⚠️
                  </span>
                  <span className="text-[11px] text-[#6f7975]">
                    {formatNaira(metrics.flaggedAmount)} held for review
                  </span>
                </div>
              </div>

              <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-[#3f4945]">Statutory Target:</span>
                <span className="font-semibold text-emerald-800 font-mono">≥ 95.0%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Data Visualization Card 2: Departmental Claim Volume & Approval Distribution */}
      <div className="px-4 py-1.5">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="font-headline-sm text-[15px] text-[#131b2e] font-bold">
                Clinical Department Distribution
              </h3>
              <p className="font-body-sm text-[11px] text-[#6f7975]">
                Volume processed vs exceptions by specialty
              </p>
            </div>
            <span className="font-label-sm text-[11px] text-[#00677d] font-semibold">
              4 Specialties
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="flex flex-col gap-3 pt-1">
            {categoryStats.map((cat) => {
              const approvalPercentage = Math.round((cat.approved / cat.total) * 100);
              return (
                <div key={cat.name} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#131b2e]">{cat.name}</span>
                    <span className="font-mono text-[11px] text-[#3f4945]">
                      {cat.approved}/{cat.total} ({approvalPercentage}%) • {formatNaira(cat.amount)}
                    </span>
                  </div>

                  {/* Horizontal Segmented Progress Bar */}
                  <div className="w-full h-3 bg-[#eaedff] rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${approvalPercentage}%` }}
                      className="h-full bg-[#004337] rounded-l-full transition-all duration-700"
                      title={`${cat.approved} Approved`}
                    ></div>
                    {cat.flagged > 0 && (
                      <div
                        style={{ width: `${100 - approvalPercentage}%` }}
                        className="h-full bg-amber-500 rounded-r-full"
                        title={`${cat.flagged} Flagged`}
                      ></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Financial Reconciliation Waterfall Ledger */}
      <div className="px-4 py-1.5">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="font-headline-sm text-[15px] text-[#131b2e] font-bold">
                Tariff Disallowance &amp; Tax Yield Waterfall
              </h3>
              <p className="font-body-sm text-[11px] text-[#6f7975]">
                Adjudication variance from gross billed to net settlement
              </p>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              83.2% Net Yield
            </span>
          </div>

          <div className="flex flex-col gap-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="font-medium text-[#131b2e]">Gross Incurred Adjudicated</span>
              <span className="font-mono font-bold">{formatNaira(metrics.grossAmount)}</span>
            </div>
            <div className="flex items-center justify-between py-1 text-rose-700 border-b border-slate-100">
              <span className="flex items-center gap-1.5">
                <span className="text-[13px] leading-none select-none">🏷️</span>
                Contractual Tariff Deductions
              </span>
              <span className="font-mono font-semibold">-{formatNaira(metrics.tariffSavings)}</span>
            </div>
            <div className="flex items-center justify-between py-1 text-rose-700 border-b border-slate-100">
              <span className="flex items-center gap-1.5">
                <span className="text-[13px] leading-none select-none">💳</span>
                Enrollee Co-Payments Collected
              </span>
              <span className="font-mono font-semibold">
                -{formatNaira(timeframe === 'batch' ? batch.enrolleeCopay : 14200000)}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 text-rose-700 border-b border-slate-100">
              <span className="flex items-center gap-1.5">
                <span className="text-[13px] leading-none select-none">🛡️</span>
                Statutory Withholding Tax (WHT 5%)
              </span>
              <span className="font-mono font-semibold">-{formatNaira(metrics.whtDeducted)}</span>
            </div>
            <div className="flex items-center justify-between py-1 text-amber-800 bg-amber-50/60 px-2 rounded">
              <span className="flex items-center gap-1.5 font-semibold">
                <span className="text-[13px] leading-none select-none">⏳</span>
                Escrow Reserve (Flagged Disputed)
              </span>
              <span className="font-mono font-bold">-{formatNaira(metrics.flaggedAmount)}</span>
            </div>
            <div className="flex items-center justify-between py-2 px-2 bg-[#f2f3ff] rounded-lg border border-[#e2e7ff] text-[#004337] font-bold">
              <span>Net Remittance Cleared (NIP Direct)</span>
              <span className="font-mono text-sm">{formatNaira(metrics.netAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Flagged Claims Audit Queue Section */}
      <div className="px-4 py-1.5">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[#93000a]">
              <span className="text-[16px] leading-none select-none">⚠️</span>
              <h3 className="font-headline-sm text-[15px] font-bold">
                Flagged Audit Queue ({flaggedClaims.length})
              </h3>
            </div>
            <span className="text-[11px] text-amber-800 font-semibold bg-amber-100 px-2 py-0.5 rounded-full">
              Action Required ⏳
            </span>
          </div>

          <p className="font-body-sm text-[11px] text-[#3f4945]">
            Items parked for Clinical Peer Review and Medical Director validation prior to secondary clearance.
          </p>

          <div className="flex flex-col gap-2 pt-1">
            {flaggedClaims.map((claim) => (
              <div
                key={claim.id}
                onClick={() => onOpenClaim(claim)}
                className="p-3 rounded-lg border border-amber-300 bg-amber-50/50 hover:bg-amber-50 transition-colors cursor-pointer flex flex-col gap-1.5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="font-mono text-[11px] text-[#00677d] font-bold">
                      {claim.claimNumber}
                    </span>
                    <span className="font-label-md text-xs font-bold text-[#131b2e]">
                      {claim.patientName} • {claim.procedureName}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-xs text-[#93000a]">
                    ₦350,000.00 Held
                  </span>
                </div>

                <div className="text-[11px] text-[#553300] bg-white p-2 rounded border border-amber-200">
                  <strong>Discrepancy:</strong> Non-formulary ceramic-on-ceramic prosthetic implant charge pending medical director validation.
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                  <span>Enrollee: {claim.enrolleeId}</span>
                  <span className="text-[#004337] font-semibold flex items-center gap-1">
                    <span>Inspect Claim</span>
                    <span className="text-[12px] leading-none select-none">➡️</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Operational Actions */}
      <div className="px-4 pt-3 flex flex-col gap-2">
        <button
          onClick={onOpenRemittance}
          className="w-full h-11 bg-[#004337] hover:bg-[#0d5c4d] text-white rounded-lg font-label-lg text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <span className="text-[16px] leading-none select-none">📥</span>
          <span>Download Audit &amp; Remittance Slip (PDF/Excel)</span>
        </button>

        <button
          onClick={onBackToLedger}
          className="w-full h-10 bg-[#e2e7ff] hover:bg-[#dae2fd] text-[#00677d] rounded-lg font-label-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#bfc9c4]/30 cursor-pointer"
        >
          <span className="text-[14px] leading-none select-none">⬅️</span>
          <span>Return to Batch Authorization Screen</span>
        </button>
      </div>
    </div>
  );
};
