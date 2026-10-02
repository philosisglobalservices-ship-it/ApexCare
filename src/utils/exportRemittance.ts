import { jsPDF } from 'jspdf';
import { BatchMetadata, ClaimItem } from '../types';

export function downloadRemittancePdf(batch: BatchMetadata, claims: ClaimItem[]): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryColor = [0, 67, 55]; // #004337
  const secondaryColor = [0, 103, 125]; // #00677d
  const textDark = [19, 27, 46]; // #131b2e
  const textMuted = [111, 121, 117];

  // Top Institutional Header Bar
  doc.setFillColor(0, 67, 55);
  doc.rect(0, 0, 210, 18, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('APEXCARE HMO NIGERIA PLC — SETTLEMENT CLEARING SYSTEM', 14, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('NHIA ACCREDITATION: #HMO-008  |  CENTRAL BANK OF NIGERIA NIP GATEWAY', 14, 15);

  // Document Title & Stamp
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('OFFICIAL PAYMENT ADVICE SLIP', 14, 28);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('Electronic Remittance Advice pursuant to NHIA Act Section 34(2)', 14, 33);

  // Status Stamp Box
  doc.setFillColor(236, 253, 245); // emerald-50
  doc.setDrawColor(16, 185, 129); // emerald-500
  doc.roundedRect(140, 22, 56, 14, 2, 2, 'FD');

  doc.setTextColor(6, 95, 70); // emerald-800
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('SETTLEMENT COMPLETED', 143, 28);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('NIBSS Instant Payment (NIP) Live', 143, 33);

  // Horizontal divider
  doc.setDrawColor(226, 232, 240);
  doc.line(14, 38, 196, 38);

  // Beneficiary and Batch Metadata Table
  doc.setFillColor(242, 243, 255);
  doc.roundedRect(14, 42, 182, 34, 2, 2, 'F');

  doc.setFontSize(8.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('Batch Reference:', 18, 48);
  doc.text('Session Identifier:', 18, 54);
  doc.text('Beneficiary Healthcare Provider:', 18, 60);
  doc.text('Settlement Destination Account:', 18, 66);
  doc.text('Clearing Gateway / Intermediary:', 18, 72);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(batch.batchId, 68, 48);
  doc.text(batch.sessionIdentifier, 68, 54);
  doc.text(`${batch.providerName} (${batch.providerNhiaReg})`, 68, 60);
  doc.text(`${batch.accountNumberMasked} — ${batch.accountName}`, 68, 66);
  doc.text(`${batch.clearingGateway} (${batch.networkLatency})`, 68, 72);

  // Financial Reconciliation Ledger Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('STATUTORY RECONCILIATION LEDGER', 14, 84);

  // Ledger Table Box
  const tableStartY = 88;
  doc.setFillColor(234, 237, 255);
  doc.rect(14, tableStartY, 182, 7, 'F');
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('Ledger Description & Statutory Deductions', 18, tableStartY + 5);
  doc.text('Amount (NGN)', 158, tableStartY + 5);

  const ledgerRows = [
    { label: 'Gross Adjudicated Incurred Claims (42 Enrollee Encounters)', val: '48,650,000.00', minus: false },
    { label: 'Contractual NHIA Tariff Deductions & Disallowances', val: '-4,200,000.00', minus: true },
    { label: 'Enrollee Direct Co-Payments Realized', val: '-1,850,000.00', minus: true },
    { label: 'Statutory Withholding Tax (WHT 5% Remitted to FIRS)', val: '-2,130,000.00', minus: true },
    { label: 'Escrow Reserve Hold (Disputed Claim #CLM-2026-LAG-88602)', val: '-350,000.00', minus: true },
  ];

  let currentY = tableStartY + 7;
  ledgerRows.forEach((row, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(250, 250, 255);
      doc.rect(14, currentY, 182, 6.5, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(row.minus ? 186 : textDark[0], row.minus ? 26 : textDark[1], row.minus ? 26 : textDark[2]);
    doc.text(row.label, 18, currentY + 4.5);
    doc.setFont('courier', 'bold');
    doc.text(row.val, 158, currentY + 4.5);
    currentY += 6.5;
  });

  // Net Dispatched Total Row
  doc.setFillColor(0, 67, 55);
  doc.rect(14, currentY, 182, 9, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('NET SETTLEMENT DISPATCHED (NIBSS NIP REMITTANCE)', 18, currentY + 6);
  doc.setFont('courier', 'bold');
  doc.setFontSize(11);
  doc.text('NGN 40,470,000.00', 146, currentY + 6.5);

  currentY += 13;

  // Dual-Custody Signature Section
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('DUAL-CUSTODY GOVERNANCE & AUDIT STAMPS', 14, currentY);

  currentY += 4;
  // Maker Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, currentY, 88, 26, 2, 2, 'FD');
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('Maker (Senior Treasury Analyst):', 18, currentY + 6);
  doc.setFont('helvetica', 'normal');
  doc.text(batch.makerName, 18, currentY + 11);
  doc.setFontSize(7.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(`Timestamp: ${batch.makerTimestamp}`, 18, currentY + 16);
  doc.text(`Auth: Hardware Token #8812 (Verified)`, 18, currentY + 21);

  // Checker Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(108, currentY, 88, 26, 2, 2, 'FD');
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('Checker (Financial Controller / CFO):', 112, currentY + 6);
  doc.setFont('helvetica', 'normal');
  doc.text(batch.checkerName, 112, currentY + 11);
  doc.setFontSize(7.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(`Timestamp: ${batch.checkerTimestamp}`, 112, currentY + 16);
  doc.text(`Auth: Biometric Sign ID #KEY-OK-9924 (Verified)`, 112, currentY + 21);

  currentY += 30;

  // General Ledger Posting Table
  doc.setFillColor(234, 237, 255);
  doc.rect(14, currentY, 182, 16, 'F');
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('ERP General Ledger Posting (Automated Real-Time Dispatch):', 18, currentY + 5);
  doc.setFont('courier', 'normal');
  doc.setFontSize(7.5);
  doc.text('Dr: Provider Claims Expense (A/C 50201) ................ NGN 40,470,000.00', 18, currentY + 10);
  doc.text('Cr: Access Bank Settlement (A/C 10104) ................ NGN 40,470,000.00', 18, currentY + 14);

  currentY += 20;

  // Cryptographic Proof & Watermark Box
  doc.setFillColor(242, 243, 255);
  doc.roundedRect(14, currentY, 182, 18, 1, 1, 'F');
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('SHA-256 CRYPTOGRAPHIC AUDIT HASH (BLOCKCHAIN & CBN CLEARING AUDITABLE):', 18, currentY + 5);
  doc.setFont('courier', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(batch.cryptographicHash, 18, currentY + 11);

  // Footer notes
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(
    'This document is an electronically certified statutory payment advice generated by ApexCare HMO. Valid without physical signature.',
    14,
    285
  );

  doc.save(`ApexCare_Remittance_Advice_${batch.batchId.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
}

export function downloadRemittanceExcel(batch: BatchMetadata, claims: ClaimItem[]): void {
  const formatNum = (n: number) => n.toFixed(2);

  // Generate Excel-friendly CSV with UTF-8 BOM
  let csv = '\uFEFF';

  // Section 1: Executive Metadata
  csv += 'APEXCARE HMO NIGERIA PLC - OFFICIAL PAYMENT ADVICE\r\n';
  csv += 'NHIA Accredited Health Maintenance Organization #HMO-008\r\n';
  csv += '\r\n';
  csv += 'BATCH CLEARANCE SPECIFICATION\r\n';
  csv += `Batch Reference,"${batch.batchId}"\r\n`;
  csv += `Session Identifier,"${batch.sessionIdentifier}"\r\n`;
  csv += `Execution Date & Time,"${batch.executionStamp}"\r\n`;
  csv += `Beneficiary Healthcare Provider,"${batch.providerName}"\r\n`;
  csv += `Provider Tier,"${batch.providerTier}"\r\n`;
  csv += `NHIA Provider Code,"${batch.providerNhiaReg}"\r\n`;
  csv += `Hospital Facilities,"${batch.providerLocations}"\r\n`;
  csv += `Beneficiary NUBAN,"${batch.accountNumberMasked}"\r\n`;
  csv += `Beneficiary Account Name,"${batch.accountName}"\r\n`;
  csv += `Settlement Clearing Intermediary,"${batch.clearingGateway}"\r\n`;
  csv += `Protocol Status,"NIBSS Instant Payment (NIP) Live - 1.42s Latency"\r\n`;
  csv += '\r\n';

  // Section 2: Financial Reconciliation Summary
  csv += 'FINANCIAL RECONCILIATION SUMMARY (NGN)\r\n';
  csv += `Gross Adjudicated Incurred Claims,${formatNum(batch.grossAdjudicated)}\r\n`;
  csv += `Contractual Tariff Disallowances & Deductions,-${formatNum(batch.tariffDeductions)}\r\n`;
  csv += `Enrollee Co-Payments Settled,-${formatNum(batch.enrolleeCopay)}\r\n`;
  csv += `Statutory Withholding Tax (WHT 5% NHIA / FIRS),-${formatNum(batch.withholdingTax)}\r\n`;
  csv += `Escrow Reserve Hold (#CLM-2026-LAG-88602),-${formatNum(batch.disputedAmount)}\r\n`;
  csv += `NET ELECTRONIC REMITTANCE DISPATCHED,${formatNum(batch.netSettlement)}\r\n`;
  csv += '\r\n';

  // Section 3: Dual-Custody Audit Proof
  csv += 'DUAL-CUSTODY GOVERNANCE & AUDIT TRAIL\r\n';
  csv += `Maker,"${batch.makerName} (${batch.makerTitle})","${batch.makerTimestamp}","${batch.makerToken}"\r\n`;
  csv += `Checker,"${batch.checkerName} (${batch.checkerTitle})","${batch.checkerTimestamp}","${batch.checkerSignId}"\r\n`;
  csv += `Cryptographic SHA-256 Hash,"${batch.cryptographicHash}"\r\n`;
  csv += '\r\n';

  // Section 4: Itemized Claims Schedule
  csv += 'ITEMIZED CLINICAL ENCOUNTER BREAKDOWN SCHEDULE\r\n';
  csv += 'Claim ID,Enrollee HMO ID,Patient Name,Procedure / Encounter Description,Category,Gross Billed (NGN),Net Remittable (NGN),Status,Tariff Compliance Rule,Treating Physician,ICD-10 Diagnostic Code\r\n';

  claims.forEach((claim) => {
    csv += `"${claim.claimNumber}","${claim.enrolleeId}","${claim.patientName}","${claim.procedureName}","${claim.category}",${formatNum(claim.grossBilled)},${formatNum(claim.netRemittable)},"${claim.status}","${claim.verificationBadge}","${claim.treatingPhysician}","${claim.icd10Code}"\r\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `ApexCare_Remittance_Ledger_${batch.batchId.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
