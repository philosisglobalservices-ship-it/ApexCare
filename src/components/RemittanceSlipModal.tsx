import React, { useState } from 'react';
import { BatchMetadata, ClaimItem } from '../types';
import { downloadRemittancePdf, downloadRemittanceExcel } from '../utils/exportRemittance';

interface RemittanceSlipModalProps {
  batch: BatchMetadata;
  claims: ClaimItem[];
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const RemittanceSlipModal: React.FC<RemittanceSlipModalProps> = ({
  batch,
  claims,
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState<'pdf' | 'excel' | null>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    onShowToast('Opening official document print dialogue...');
    try {
      window.print();
    } catch {
      onShowToast('Browser print dialog restricted; generating PDF instead.');
      handleDownloadPdf();
    }
  };

  const handleDownloadPdf = () => {
    setIsExporting('pdf');
    setShowExportMenu(false);
    onShowToast('Generating and downloading official certified PDF...');
    try {
      setTimeout(() => {
        downloadRemittancePdf(batch, claims);
        setIsExporting(null);
        onShowToast('Official Remittance Advice PDF downloaded successfully!');
      }, 300);
    } catch {
      setIsExporting(null);
      onShowToast('Error generating PDF advice. Please try again.');
    }
  };

  const handleDownloadExcel = () => {
    setIsExporting('excel');
    setShowExportMenu(false);
    onShowToast('Generating itemized clinical reconciliation Excel spreadsheet...');
    try {
      setTimeout(() => {
        downloadRemittanceExcel(batch, claims);
        setIsExporting(null);
        onShowToast('Remittance Excel schedule (.csv) downloaded successfully!');
      }, 300);
    } catch {
      setIsExporting(null);
      onShowToast('Error exporting Excel schedule. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header Bar (no-print) */}
        <div className="bg-[#004337] text-white px-4 py-3 flex items-center justify-between flex-shrink-0 no-print">
          <div className="flex items-center gap-2">
            <span className="text-[18px] leading-none select-none">📄</span>
            <div>
              <h3 className="font-headline-sm text-sm font-bold">Official Payment Advice Slip</h3>
              <p className="text-[10px] text-[#8fd4c1]">National Health Insurance Authority (NHIA) Format</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer text-xs"
          >
            <span className="select-none font-bold">✖️</span>
          </button>
        </div>

        {/* Printable Slip Content */}
        <div
          id="printable-remittance-slip"
          className="p-5 overflow-y-auto text-[#131b2e] flex flex-col gap-4 text-xs bg-white"
        >
          {/* Institutional Header */}
          <div className="flex items-start justify-between border-b pb-3 border-slate-200">
            <div>
              <h4 className="font-bold text-sm text-[#004337] tracking-tight">
                APEXCARE HMO NIGERIA PLC
              </h4>
              <p className="text-[10px] text-slate-500">NHIA Accredited Health Maintenance Org #HMO-008</p>
              <p className="text-[10px] text-slate-500">Victoria Island, Lagos • settlement@apexcare.ng</p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-mono font-bold text-[10px] border border-emerald-300">
                NIBSS NIP SETTLED ✅
              </span>
              <p className="text-[10px] text-slate-500 mt-1 font-mono">
                Date: 14 Oct 2026 11:28 WAT
              </p>
            </div>
          </div>

          {/* Key Reference Details */}
          <div className="grid grid-cols-2 gap-3 bg-[#f2f3ff] p-3 rounded-xl border border-[#e2e7ff] text-[11px]">
            <div>
              <span className="text-slate-500 block">Batch Reference:</span>
              <span className="font-mono font-bold text-[#00677d]">{batch.batchId}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Session Identifier:</span>
              <span className="font-mono font-bold text-[#131b2e] truncate block">
                {batch.sessionIdentifier}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Beneficiary Provider:</span>
              <span className="font-bold text-[#131b2e]">{batch.providerName} 🏥</span>
              <span className="text-[10px] text-slate-500 block">{batch.providerNhiaReg}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Settlement NUBAN:</span>
              <span className="font-mono font-bold text-[#131b2e]">{batch.accountNumberMasked} 🏦</span>
              <span className="text-[10px] text-slate-500 block">{batch.accountName}</span>
            </div>
          </div>

          {/* Financial Breakdown Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-[#eaedff] px-3 py-1.5 font-bold text-[11px] text-[#131b2e] flex justify-between">
              <span>Financial Description</span>
              <span>Amount (NGN)</span>
            </div>
            <div className="divide-y divide-slate-100">
              <div className="px-3 py-2 flex justify-between">
                <span>Gross Adjudicated Incurred Claims (42 records)</span>
                <span className="font-mono font-semibold">₦48,650,000.00</span>
              </div>
              <div className="px-3 py-2 flex justify-between text-rose-700">
                <span>Contractual Tariff Disallowances &amp; Agreed Deductions</span>
                <span className="font-mono font-semibold">-₦4,200,000.00</span>
              </div>
              <div className="px-3 py-2 flex justify-between text-rose-700">
                <span>Enrollee Co-Payments &amp; Primary Care Contributions</span>
                <span className="font-mono font-semibold">-₦1,850,000.00</span>
              </div>
              <div className="px-3 py-2 flex justify-between text-rose-700">
                <span>Statutory Withholding Tax (WHT 5% FIRS / NHIA)</span>
                <span className="font-mono font-semibold">-₦2,130,000.00</span>
              </div>
              <div className="px-3 py-2 flex justify-between text-amber-700 bg-amber-50/50">
                <span>Disputed Escrow Reserve (#CLM-2026-LAG-88602)</span>
                <span className="font-mono font-semibold">-₦350,000.00</span>
              </div>
              <div className="px-3 py-2.5 flex justify-between bg-[#f2f3ff] font-bold text-sm text-[#004337] border-t-2 border-[#004337]">
                <span>Net Dispatched Settlement Payable</span>
                <span className="font-mono">₦40,470,000.00</span>
              </div>
            </div>
          </div>

          {/* Dual-Custody Signature Verification Box */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Dual-Custody Electronic Signatures 🛡️
            </span>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="p-2 bg-white rounded border border-slate-200">
                <span className="font-bold text-[#004337] block">Maker Sign-Off</span>
                <span>{batch.makerName}</span>
                <span className="block text-slate-400 font-mono">14 Oct 2026 11:24 WAT</span>
                <span className="text-emerald-700 font-medium">🔑 OTP Hardware #8812 Verified</span>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200">
                <span className="font-bold text-[#004337] block">Checker Executive Sign-Off</span>
                <span>{batch.checkerName}</span>
                <span className="block text-slate-400 font-mono">14 Oct 2026 11:28 WAT</span>
                <span className="text-emerald-700 font-medium">🔐 Biometric ID #KEY-OK-9924</span>
              </div>
            </div>
            <div className="mt-1 pt-1 border-t border-slate-200">
              <span className="text-[10px] text-slate-400 block font-mono break-all">
                SHA-256 Audit Hash: {batch.cryptographicHash}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions (no-print) */}
        <div className="p-4 bg-[#faf8ff] border-t border-slate-200 flex flex-col gap-2 flex-shrink-0 no-print">
          <div className="flex gap-2">
            {/* Print Slip Button */}
            <button
              onClick={handlePrint}
              className="flex-1 py-2.5 rounded-lg bg-[#e2e7ff] text-[#00677d] font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#dae2fd] active:scale-[0.99] transition-all border border-[#bfc9c4]/40 cursor-pointer shadow-sm"
            >
              <span className="text-[16px] leading-none select-none">🖨️</span>
              <span>Print Slip</span>
            </button>

            {/* Save PDF / Excel Button with dropdown or direct trigger */}
            <div className="relative flex-1">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="w-full py-2.5 rounded-lg bg-[#004337] hover:bg-[#0d5c4d] text-white font-bold text-xs flex items-center justify-center gap-1.5 active:scale-[0.99] transition-all shadow-sm cursor-pointer"
              >
                <span className="text-[16px] leading-none select-none">
                  {isExporting ? '⏳' : '📥'}
                </span>
                <span>Save PDF / Excel</span>
                <span className="text-[10px] leading-none ml-0.5">
                  {showExportMenu ? '▲' : '▼'}
                </span>
              </button>

              {/* Active Export Options Popup */}
              {showExportMenu && (
                <div className="absolute right-0 bottom-full mb-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
                  <div className="px-2 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                    Choose Export Format
                  </div>

                  <button
                    onClick={handleDownloadPdf}
                    className="w-full mt-1.5 p-2 text-left rounded-lg hover:bg-[#f2f3ff] text-[#131b2e] flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 text-sm">
                      <span>📄</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-xs text-[#004337]">Save Official PDF</span>
                      <span className="text-[10px] text-slate-500">Certified A4 NHIA Remittance Slip</span>
                    </div>
                  </button>

                  <button
                    onClick={handleDownloadExcel}
                    className="w-full p-2 text-left rounded-lg hover:bg-[#f2f3ff] text-[#131b2e] flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-md bg-blue-100 text-blue-800 flex items-center justify-center flex-shrink-0 text-sm">
                      <span>📊</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-xs text-[#00677d]">Export Excel (.CSV)</span>
                      <span className="text-[10px] text-slate-500">42 itemized claims ledger spreadsheet</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Direct Buttons for instant convenience */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              onClick={handleDownloadPdf}
              className="py-1.5 px-2 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="text-[13px] leading-none select-none">📄</span>
              <span>Quick PDF (.pdf)</span>
            </button>
            <button
              onClick={handleDownloadExcel}
              className="py-1.5 px-2 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold border border-blue-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="text-[13px] leading-none select-none">📊</span>
              <span>Quick Excel (.csv)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
