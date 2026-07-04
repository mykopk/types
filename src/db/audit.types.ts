import type { AUDIT_CATEGORY } from './dbEnums';

/**
 * Audit context for tracking user actions
 */
export interface AuditContext {
  userId?: string;
  requestId?: string;
  ipAddress?: string;
  userAgent?: string;
  /** Business reason for the action (e.g., "Suspended for ToS violation") */
  reason?: string;
  /** Category of the audit action for filtering and reporting */
  category?: AUDIT_CATEGORY;
}

/**
 * Failure details for failed operations
 */
export interface AuditFailureDetails {
  /** Which extension/layer caused the failure */
  source: string;
  /** Error type/name */
  error_type: string;
  /** Error message */
  error_message: string;
  /** Error code if available */
  error_code?: string;
}

export interface AuditEvent {
  operation: string;
  table: string;
  recordId?: string;
  userId?: string;
  requestId?: string;
  changes: {
    /** State before the operation */
    before?: Record<string, string | number | boolean | Date>;
    /** State after the operation (for successful operations) */
    after?: Record<string, string | number | boolean | Date>;
    /** Fields that were modified */
    fields?: string[];
    /** Data that was attempted to be written (for failed operations) */
    attempted?: Record<string, string | number | boolean | Date>;
    /** Failure details (for failed operations) */
    failure?: AuditFailureDetails;
    /** Fields that are encrypted at rest (values shown are decrypted for audit) */
    encryptedFields?: string[];
  };
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  /** Business reason for the action (e.g., "Suspended for ToS violation") */
  reason?: string;
  /** Category of the audit action for filtering and reporting */
  category?: AUDIT_CATEGORY;
}
