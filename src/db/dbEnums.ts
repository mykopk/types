/**
 * @fileoverview Database adapter type definitions
 *
 * Defines the enumeration of supported database adapter types used throughout
 * the database package. This enum provides type-safe identification of different
 * database integrations and is used in configuration, factory methods, and
 * adapter selection logic.
 *
 * **Application Flow Context:**
 * ```
 * Configuration → ADAPTERS Enum → AdapterFactory → Concrete Adapter
 *      ↓             ↓              ↓               ↓
 * User Config  → Type Safety   → Adapter Creation → Database Connection
 * ```
 *
 * **Adapter Types:**
 * - **DRIZZLE**: Type-safe ORM with excellent TypeScript support
 * - **SUPABASE**: Hosted PostgreSQL with real-time capabilities
 * - **SQL**: Raw SQL execution for maximum control
 * - **DATABASE**: Generic fallback adapter
 *
 * @example
 * ```typescript
 * // Adapter selection in configuration
 * const config = {
 *   adapter: ADAPTERS.DRIZZLE,
 *   connectionString: process.env.DATABASE_URL
 * };
 *
 * // Type-safe adapter factory usage
 * const adapter = AdapterFactory.create(ADAPTERS.SUPABASE, supabaseConfig);
 *
 * // Switch statement with exhaustive checking
 * switch (config.adapter) {
 *   case ADAPTERS.DRIZZLE:
 *     // Handle Drizzle-specific logic
 *     break;
 *   case ADAPTERS.SUPABASE:
 *     // Handle Supabase-specific logic
 *     break;
 *   case ADAPTERS.SQL:
 *     // Handle SQL-specific logic
 *     break;
 *   default:
 *     // TypeScript ensures all cases are handled
 *     throw new Error(`Unsupported adapter: ${config.adapter}`);
 * }
 * ```
 *
 */
/**
 * @enum ADAPTERS
 * @description
 * Enumeration of supported database adapter types.
 *
 * This enum provides type-safe identification of different database integrations
 * and is used throughout the package for configuration, factory methods, and
 * adapter selection. Each adapter type represents a different approach to
 * database connectivity and operations.
 *
 * **Adapter Characteristics:**
 * - **DATABASE**: Generic fallback, minimal functionality
 * - **DRIZZLE**: Full ORM with type safety and query building
 * - **SUPABASE**: Hosted solution with real-time and auth features
 * - **SQL**: Raw SQL for performance-critical applications
 *
 * @example
 * ```typescript
 * // Configuration with adapter selection
 * const configs = {
 *   development: { adapter: ADAPTERS.DRIZZLE },
 *   production: { adapter: ADAPTERS.SUPABASE },
 *   performance: { adapter: ADAPTERS.SQL }
 * };
 *
 * // Type-safe adapter validation
 * function validateAdapter(adapter: ADAPTERS): boolean {
 *   return Object.values(ADAPTERS).includes(adapter);
 * }
 * ```
 */
export enum ADAPTERS {
  /** Generic database adapter (default when no specific integration is set) */
  DATABASE = 'database',

  /** Drizzle ORM adapter (PostgreSQL, MySQL, SQLite, etc.) */
  DRIZZLE = 'drizzle',

  /** Supabase adapter (PostgreSQL backend with REST + Realtime APIs) */
  SUPABASE = 'supabase',

  /** Raw SQL adapter (direct database queries without ORM) */
  SQL = 'sql',

  /** Mock adapter (in-memory database for testing) */
  MOCK = 'mock',

  /** Prisma ORM adapter */
  PRISMA = 'prisma',
}

// Event type enum
export enum DATABASE_EVENT_TYPE {
  BeforeQuery = 'beforeQuery',
  AfterQuery = 'afterQuery',
  QueryError = 'queryError',
  BeforeTransaction = 'beforeTransaction',
  AfterTransaction = 'afterTransaction',
  TransactionRollback = 'transactionRollback',
  HealthChange = 'healthChange',
}

/**
 * Strategy options for replica selection.
 */
export enum REPLICA_STRATEGY {
  /** Always use primary database */
  PRIMARY = 'primary',
  /** Use any available replica */
  REPLICA = 'replica',
  /** Use geographically closest replica */
  CLOSEST = 'closest',
  /** Use fastest responding replica */
  FASTEST = 'fastest',
}

/**
 * Enum for pool event types.
 */
export enum DB_POOL_EVENTS {
  CONNECT = 'connect',
  ACQUIRE = 'acquire',
  RELEASE = 'release',
  REMOVE = 'remove',
}

/**
 * Alert severity levels
 */
export enum ALERT_SEVERITY {
  CRITICAL = 'critical',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

/**
 * Alert source types
 */
export enum ALERT_SOURCE {
  DATABASE = 'database',
  POOL = 'pool',
  REPLICA = 'replica',
  CACHE = 'cache',
  BACKUP = 'backup',
}

/**
 * Audit operation types
 */
export enum AUDIT_OPERATION {
  Create = 'CREATE',
  Update = 'UPDATE',
  Delete = 'DELETE',
  CreateFailed = 'CREATE_FAILED',
  UpdateFailed = 'UPDATE_FAILED',
  DeleteFailed = 'DELETE_FAILED',
}

/**
 * Audit category types for categorizing audit events
 * Used for filtering and reporting in admin/backoffice activity logs
 */
export enum AUDIT_CATEGORY {
  // === Admin/Backoffice Actions ===
  /** User management actions: ban, suspend, deactivate, role changes */
  UserManagement = 'user_management',
  /** Campaign moderation: approve, reject campaigns */
  CampaignModeration = 'campaign_moderation',
  /** Content moderation: flag, remove, hide content */
  ContentModeration = 'content_moderation',
  /** KYC verification: approval/rejection of identity verification */
  KycVerification = 'kyc_verification',
  /** Payment operations: refunds, payout approvals, reversals */
  PaymentOperations = 'payment_operations',
  /** Permission management: grants/revokes of permissions */
  PermissionManagement = 'permission_management',
  /** Role assignment: role creation/assignment/updates */
  RoleAssignment = 'role_assignment',

  // === System/Automated Actions ===
  /** System configuration changes, feature flags */
  SystemConfiguration = 'system_configuration',
  /** Cron jobs, automated tasks */
  ScheduledJob = 'scheduled_job',
  /** Partition cleanup, archive operations */
  DataRetention = 'data_retention',
  /** Automated compliance checks */
  ComplianceRule = 'compliance_rule',

  // === User Actions ===
  /** Login, logout, registration */
  UserAuthentication = 'user_authentication',
  /** Profile changes, settings updates */
  ProfileUpdate = 'profile_update',
  /** User-initiated data export */
  DataExport = 'data_export',
  /** Bulk import operations */
  DataImport = 'data_import',

  // === Security Events ===
  /** Suspicious activity, breach detection */
  SecurityEvent = 'security_event',
  /** Permission checks, access denials */
  AccessControl = 'access_control',
  /** Key rotation, encryption-related events */
  EncryptionEvent = 'encryption_event',

  // === Financial Operations ===
  /** Payment processing, transfers */
  FinancialTransaction = 'financial_transaction',
  /** Balance reconciliation, audits */
  FinancialAudit = 'financial_audit',

  // === General ===
  /** Uncategorized or general operations */
  General = 'general',
}

/**
 * Extension source identifiers for audit logging
 * Used to track which extension caused an operation failure
 */
export enum EXTENSION_SOURCE {
  /** Base database adapter (Drizzle, Supabase, SQL, Mock) */
  DatabaseAdapter = 'DatabaseAdapter',
  /** Encryption extension - field-level encryption */
  Encryption = 'EncryptionExtension',
  /** Soft delete extension - logical deletion */
  SoftDelete = 'SoftDeleteExtension',
  /** Caching extension - query result caching */
  Caching = 'CachingExtension',
  /** Audit extension - operation logging */
  Audit = 'AuditExtension',
  /** Read replica extension - read/write splitting */
  ReadReplica = 'ReadReplicaExtension',
  /** Multi-write extension - write replication */
  MultiWrite = 'MultiWriteExtension',
  /** Unknown source */
  Unknown = 'Unknown',
}

/**
 * Database Adapter Types - Enum for adapter selection
 */
export enum ADAPTER_TYPES {
  DRIZZLE = 'drizzle',
  SUPABASE = 'supabase',
  SQL = 'sql',
  MOCK = 'mock',
  PRISMA = 'prisma',
}
