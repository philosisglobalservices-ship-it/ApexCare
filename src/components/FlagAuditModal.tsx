import React, { useState } from 'react';
import { BatchMetadata } from '../types';

interface FlagAuditModalProps {
  batch: BatchMetadata;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, notes: string) => void;
}

export const FlagAuditModal: React.FC<FlagAuditModalProps> = ({
  batch,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [reason, setReason] = useState<string>('tariff_mismatch');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(reason, notes);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#93000a] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[18px] leading-none select-none">⚠️</span>
            <div>
              <h3 className="font-headline-sm text-sm font-bold">Return Batch to Claims Audit</h3>
              <p className="text-[10px] text-red-200">Suspend Automated NIP Remittance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer text-xs"
          >
            <span className="select-none font-bold">✖️</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3 text-xs text-[#131b2e]">
          <div className="bg-[#ffdad6]/40 p-2.5 rounded-lg border border-[#ffdad6] text-[#93000a]">
            Flagging batch <span className="font-mono font-bold">{batch.batchId}</span> ({batch.providerName}) will pause the CBN settlement queue and return 42 claims to claims adjudication.
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-slate-700">Audit Discrepancy Reason:</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="p-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#93000a] text-xs"
            >
              <option value="tariff_mismatch">Contractual Tariff Schedule Mismatch</option>
              <option value="implant_pricing">Non-Formulary Surgical Implant Surcharge</option>
              <option value="enrollee_eligibility">Enrollee Active Policy Status Query</option>
              <option value="documentation_gap">Incomplete Discharge Summary / Theater Notes</option>
              <option value="duplicate_billing">Potential Duplicate Billing Identified</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-slate-700">Auditor Notes for Adjudicator:</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide specific guidelines for re-evaluating this provider batch..."
              className="p-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#93000a] resize-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-lg bg-[#93000a] hover:bg-[#ba1a1a] text-white font-bold transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-1"
            >
              <span>⚠️</span>
              <span>Confirm Return</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
