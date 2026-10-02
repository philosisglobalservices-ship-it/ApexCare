import { relations } from 'drizzle-orm';
import { integer, numeric, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// 1. Users Table (Synchronized with Firebase Auth)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name'),
  role: text('role').default('cfo_checker'), // 'treasury_analyst', 'cfo_checker', 'claims_auditor'
  createdAt: timestamp('created_at').defaultNow(),
});

// 2. Healthcare Providers Table (HCPs)
export const providers = pgTable('providers', {
  id: serial('id').primaryKey(),
  providerId: text('provider_id').notNull().unique(), // e.g. 'HCP-RED-001'
  name: text('name').notNull(),
  tier: text('tier').notNull().default('HCP TIER 1'),
  locations: text('locations').notNull(),
  nhiaReg: text('nhia_reg').notNull(),
  bankName: text('bank_name').notNull(),
  accountNumberMasked: text('account_number_masked').notNull(),
  accountName: text('account_name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// 3. Batches Table (Settlement Batches)
export const batches = pgTable('batches', {
  id: serial('id').primaryKey(),
  batchId: text('batch_id').notNull().unique(), // e.g. '#SETTLE-2026-B402-LAG'
  providerId: integer('provider_id').references(() => providers.id),
  sessionIdentifier: text('session_identifier').notNull(),
  status: text('status').notNull().default('PENDING_APPROVAL'), // 'PENDING_APPROVAL', 'COMPLETED', 'FLAGGED'
  grossAdjudicated: numeric('gross_adjudicated', { precision: 14, scale: 2 }).notNull(),
  tariffDeductions: numeric('tariff_deductions', { precision: 14, scale: 2 }).notNull(),
  enrolleeCopay: numeric('enrollee_copay', { precision: 14, scale: 2 }).notNull(),
  withholdingTax: numeric('withholding_tax', { precision: 14, scale: 2 }).notNull(),
  netSettlement: numeric('net_settlement', { precision: 14, scale: 2 }).notNull(),
  totalClaimsCount: integer('total_claims_count').notNull().default(42),
  reconciledClaimsCount: integer('reconciled_claims_count').notNull().default(41),
  disputedClaimsCount: integer('disputed_claims_count').notNull().default(1),
  disputedAmount: numeric('disputed_amount', { precision: 14, scale: 2 }).notNull().default('350000.00'),
  disputedClaimId: text('disputed_claim_id'),
  disputedReason: text('disputed_reason'),
  makerName: text('maker_name').notNull(),
  makerTitle: text('maker_title').notNull(),
  makerTimestamp: text('maker_timestamp').notNull(),
  makerToken: text('maker_token').notNull(),
  checkerName: text('checker_name'),
  checkerTitle: text('checker_title'),
  checkerTimestamp: text('checker_timestamp'),
  checkerSignId: text('checker_sign_id'),
  cryptographicHash: text('cryptographic_hash').notNull(),
  executionStamp: text('execution_stamp'),
  clearingGateway: text('clearing_gateway').notNull(),
  networkLatency: text('network_latency').notNull().default('1.42s Latency'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 4. Claims Table (Itemized Clinical Claims)
export const claims = pgTable('claims', {
  id: serial('id').primaryKey(),
  batchId: integer('batch_id').references(() => batches.id),
  claimNumber: text('claim_number').notNull().unique(), // e.g. '#CLM-2026-LAG-88912'
  patientName: text('patient_name').notNull(),
  enrolleeId: text('enrollee_id').notNull(),
  procedureName: text('procedure_name').notNull(),
  category: text('category').notNull(), // 'surgical', 'inpatient', 'diagnostics', 'pharmacy'
  grossBilled: numeric('gross_billed', { precision: 12, scale: 2 }).notNull(),
  netRemittable: numeric('net_remittable', { precision: 12, scale: 2 }).notNull(),
  disallowanceAmount: numeric('disallowance_amount', { precision: 12, scale: 2 }).default('0.00'),
  whtAmount: numeric('wht_amount', { precision: 12, scale: 2 }).default('0.00'),
  status: text('status').notNull().default('Approved'), // 'Approved', 'Disputed', 'Pending Review'
  verificationBadge: text('verification_badge').notNull(),
  badgeType: text('badge_type').notNull(), // 'standard', 'preauth', 'wht', 'disallowance', 'disputed'
  icd10Code: text('icd_10_code').notNull(),
  admissionDate: text('admission_date').notNull(),
  dischargeDate: text('discharge_date').notNull(),
  treatingPhysician: text('treating_physician').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 5. Audit Logs Table (Audit Trail & Double-Entry GL Ledger)
export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  batchId: integer('batch_id').references(() => batches.id),
  eventType: text('event_type').notNull(), // 'MAKER_INITIATED', 'CHECKER_AUTHORIZED', 'NIP_DISPATCHED', 'BATCH_FLAGGED'
  actorName: text('actor_name').notNull(),
  actorRole: text('actor_role').notNull(),
  actorToken: text('actor_token').notNull(),
  description: text('description').notNull(),
  debitAccount: text('debit_account'),
  creditAccount: text('credit_account'),
  amount: numeric('amount', { precision: 14, scale: 2 }),
  timestamp: timestamp('timestamp').defaultNow(),
});

// Relationships
export const providersRelations = relations(providers, ({ many }) => ({
  batches: many(batches),
}));

export const batchesRelations = relations(batches, ({ one, many }) => ({
  provider: one(providers, {
    fields: [batches.providerId],
    references: [providers.id],
  }),
  claims: many(claims),
  auditLogs: many(auditLogs),
}));

export const claimsRelations = relations(claims, ({ one }) => ({
  batch: one(batches, {
    fields: [claims.batchId],
    references: [batches.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  batch: one(batches, {
    fields: [auditLogs.batchId],
    references: [batches.id],
  }),
}));
