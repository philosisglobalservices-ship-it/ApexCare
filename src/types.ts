export interface ClaimItem {
  id: string;
  claimNumber: string;
  patientName: string;
  procedureName: string;
  category: 'surgical' | 'inpatient' | 'diagnostics' | 'pharmacy';
  grossBilled: number;
  netRemittable: number;
  status: 'Approved' | 'Disputed' | 'Pending Review';
  verificationBadge: string;
  badgeType: 'standard' | 'preauth' | 'wht' | 'disallowance' | 'disputed';
  disallowanceAmount?: number;
  whtAmount?: number;
  enrolleeId: string;
  icd10Code: string;
  admissionDate: string;
  dischargeDate: string;
  treatingPhysician: string;
  notes?: string;
}

export interface BatchMetadata {
  batchId: string;
  sessionIdentifier: string;
  providerName: string;
  providerTier: string;
  providerLocations: string;
  providerNhiaReg: string;
  bankName: string;
  accountNumberMasked: string;
  accountName: string;
  grossAdjudicated: number;
  tariffDeductions: number;
  enrolleeCopay: number;
  withholdingTax: number;
  netSettlement: number;
  totalClaimsCount: number;
  reconciledClaimsCount: number;
  disputedClaimsCount: number;
  disputedAmount: number;
  disputedClaimId: string;
  disputedReason: string;
  makerName: string;
  makerTitle: string;
  makerTimestamp: string;
  makerToken: string;
  checkerName: string;
  checkerTitle: string;
  checkerTimestamp: string;
  checkerSignId: string;
  cryptographicHash: string;
  executionStamp: string;
  clearingGateway: string;
  networkLatency: string;
}
