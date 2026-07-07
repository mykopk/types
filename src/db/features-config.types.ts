/**
 * @fileoverview Enhanced configuration types for database service
 *
 * Provides comprehensive, strictly-typed configuration interfaces for all
 * database extensions and features. These types enable type-safe configuration
 * of the entire database system, from basic adapter settings to advanced
 * features like encryption, audit logging, and caching.
 *
 * **Configuration Hierarchy:**
 * ```
 * DatabaseServiceConfig (Root)
 *       ↓
 * ├── AdapterConfig (Database Connection)
 * ├── ExtensionConfigs (Features)
 * │   ├── SoftDeleteConfig
 * │   ├── DBEncryptionConfig
 * │   ├── AuditConfig
 * │   └── DBCacheConfig
 * └── OperationConfig (Per-Operation Overrides)
 * ```
 *
 * **Configuration Features:**
 * - **Type Safety**: Compile-time validation of all configuration options
 * - **Hierarchical Overrides**: Global config with per-operation overrides
 * - **Extension Integration**: Seamless configuration for all extensions
 * - **Event Handling**: Type-safe event handler configuration
 * - **Adapter Flexibility**: Support for multiple database adapters
 *
 * **Usage Patterns:**
 * - Global configuration for application-wide settings
 * - Per-operation configuration for specific requirements
 * - Extension-specific configuration for feature customization
 * - Event handler configuration for monitoring and logging
 *
 * @example
 * ```typescript
 * // Complete database service configuration
 * const config: DatabaseServiceConfig = {
 *   adapter: 'drizzle',
 *   config: {
 *     connectionString: process.env.DATABASE_URL,
 *     poolSize: 10
 *   },
 *   encryption: {
 *     enabled: true,
 *     key: process.env.ENCRYPTION_KEY,
 *     fields: {
 *       users: ['ssn', 'taxId'],
 *       payments: ['cardNumber', 'cvv']
 *     }
 *   },
 *   audit: {
 *     enabled: true,
 *     retentionDays: 90,
 *     excludeTables: ['sessions', 'logs']
 *   },
 *   events: {
 *     onAfterWrite: async (event) => {
 *       console.log(`${event.operation} completed on ${event.table}`);
 *     }
 *   }
 * };
 *
 * // Per-operation configuration override
 * const operationConfig: OperationConfig = {
 *   skipAudit: true,
 *   cache: { ttl: 600 },
 *   timeout: 30000
 * };
 * ```
 */

import type { AuditEvent } from './audit.types';
import type { ReadReplicaConfig } from './replica.types';
import type { MultiReadConfig, MultiWriteConfig } from './extensions.types';

/**
 * Configuration for soft delete functionality
 */
export interface SoftDeleteConfig {
  /** Whether soft delete is enabled */
  enabled: boolean;
  /** Field name for soft delete timestamp (default: 'deletedAt') */
  field?: string;
  /** Tables to exclude from soft delete behavior */
  excludeTables?: string[];
}

/**
 * Configuration for field-level encryption
 */
export interface DBEncryptionConfig {
  /** Whether encryption is enabled */
  enabled: boolean;
  /** Base64 encoded encryption key - must be 32 bytes for AES-256 */
  key: string;
  /** Fields to encrypt per table */
  fields: Record<string, string[]>;
  /** Encryption algorithm (default: 'aes-256-gcm') */
  algorithm?: 'aes-256-gcm' | 'aes-256-cbc';
  /** Use database-native encryption when available */
  useDatabaseNative?: boolean;
}

/**
 * Configuration for audit logging
 */
export interface AuditConfig {
  /** Whether audit logging is enabled */
  enabled: boolean;
  /** Number of days to retain audit logs (default: 180 for GDPR/SOX compliance) */
  retentionDays?: number;
  /** Fields to exclude from audit logs */
  excludeFields?: string[];
  /** Tables to exclude from audit logging */
  excludeTables?: string[];
  /** Database schema for audit tables (default: 'audit') */
  schema?: string;
  /** Use daily partitioned tables (audit_log_yyyy_mm_dd format) (default: true) */
  usePartitionedTables?: boolean;
  /** Custom audit event handler */
  onAuditAfterWrite?: (event: AuditEvent) => void | Promise<void>;
  /** Encrypted fields config from encryption extension (for audit metadata) */
  encryptedFields?: Record<string, string[]>;
}

/**
 * Configuration for automatic timestamps
 */
export interface TimestampsConfig {
  /** Whether automatic timestamps are enabled */
  enabled: boolean;
  /** Field name for creation timestamp (default: 'createdAt') */
  createdAtField?: string;
  /** Field name for update timestamp (default: 'updatedAt') */
  updatedAtField?: string;
  /** Automatically update timestamp on record changes */
  autoUpdate?: boolean;
}

/**
 * Configuration for query result caching
 */
export interface DBCacheConfig {
  /** Whether caching is enabled */
  enabled: boolean;
  /** Default TTL in seconds (default: 300) */
  ttl?: number;
  /** Cache provider ('redis' | 'memory') */
  provider?: string;
  /** Cache invalidation strategy */
  invalidation?: 'write' | 'ttl' | 'manual';
}

/**
 * Connection pool configuration
 */
export interface PoolConfig {
  /** Minimum number of connections */
  min?: number;
  /** Maximum number of connections */
  max?: number;
  /** Idle connection timeout in milliseconds */
  idleTimeoutMs?: number;
  /** Connection acquisition timeout in milliseconds */
  acquireTimeoutMs?: number;
}

/**
 * Database event handlers
 */
export interface DatabaseEvents {
  /** Called before any write operation */
  onBeforeWrite?: (event: BeforeWriteEvent) => void | Promise<void>;
  /** Called after successful write operation */
  onAfterWrite?: (event: AfterWriteEvent) => void | Promise<void>;
  /** Called before any read operation */
  onBeforeRead?: (event: BeforeReadEvent) => void | Promise<void>;
  /** Called after successful read operation */
  onAfterRead?: (event: AfterReadEvent) => void | Promise<void>;
}

/**
 * Event types for database operations
 */
export interface BeforeWriteEvent {
  type: 'beforeWrite';
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  table: string;
  data: Record<string, string | number | boolean | Date>;
  timestamp: Date;
}

export interface AfterWriteEvent {
  type: 'afterWrite';
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  table: string;
  adapter?: string;
  result: Record<string, string | number | boolean | Date>;
  duration: number;
  timestamp: Date;
}

export interface BeforeReadEvent {
  type: 'beforeRead';
  operation: 'READ';
  table: string;
  timestamp: Date;
}

export interface AfterReadEvent {
  type: 'afterRead';
  operation: 'READ';
  table: string;
  adapter?: string;
  result: Record<string, string | number | boolean | Date>;
  duration: number;
  timestamp: Date;
}

/**
 * Adapter-specific configuration types
 */
export interface DrizzleConfig {
  connectionString?: string;
  url?: string;
  poolSize?: number;
  /** Connection pool configuration (overrides poolSize if both set) */
  pool?: PoolConfig;
  ssl?: boolean;
  /** Default schema for all tables (e.g., 'test', 'public') */
  schema?: string;
  /** Table ID column mappings for auto-detection */
  tableIdColumns?: Record<string, string>;
  /** Enable Drizzle ORM query logging */
  logging?: boolean;
}

export interface SupabaseConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceKey?: string;
  schema?: string;
  /** Table ID column mappings for auto-detection */
  tableIdColumns?: Record<string, string>;
}

export interface SqlConfig {
  connectionString?: string;
  url?: string;
  dialect?: 'postgresql' | 'mysql' | 'sqlite';
  /** Default schema for all tables (e.g., 'test', 'public') */
  schema?: string;
  /** Table ID column mappings for auto-detection */
  tableIdColumns?: Record<string, string>;
}

export interface MockConfig {
  logging?: boolean;
  initialData?: Record<string, Record<string, string | number | boolean | Date>[]>;
  /** Default schema for all tables */
  schema?: string;
  /** Table ID column mappings for auto-detection */
  tableIdColumns?: Record<string, string>;
}

export interface PrismaConfig {
  /** Pre-configured PrismaClient instance */
  client?: any;
  /** Prisma datasource URL */
  url?: string;
  /** Prisma client constructor options */
  prismaOptions?: {
    log?: ('query' | 'info' | 'warn' | 'error')[];
    errorFormat?: 'minimal' | 'colorless' | 'pretty';
  };
  /** Table ID column mappings for auto-detection */
  tableIdColumns?: Record<string, string>;
}

/**
 * Union type for adapter configurations
 */
export type AdapterConfig = DrizzleConfig | SupabaseConfig | SqlConfig | MockConfig | PrismaConfig;

/**
 * Per-operation configuration overrides
 */
export interface OperationConfig {
  /** Override soft delete settings for this operation */
  softDelete?: Partial<SoftDeleteConfig>;
  /** Override encryption settings for this operation */
  encryption?: Partial<DBEncryptionConfig>;
  /** Skip audit logging for this operation */
  skipAudit?: boolean;
  /** Override cache settings for this operation */
  cache?: Partial<DBCacheConfig>;
  /** Force specific adapter usage */
  forceAdapter?: 'primary' | 'replica';
  /** Use a specific named adapter for this operation (from DbService.adapters config) */
  adapter?: string;
  /** Include soft-deleted records in results */
  includeSoftDeleted?: boolean;
  /** Override query timeout for this operation */
  timeout?: number;
  /** Override timestamp settings for this operation */
  timestamps?: Partial<TimestampsConfig>;
  /** Override ID column name for this operation (default: 'id') */
  idColumn?: string;
  /** Override database schema for this operation */
  schema?: string;
}

/**
 * Complete database service configuration
 */
export interface DatabaseServiceConfig {
  /** Database adapter type */
  adapter: 'drizzle' | 'supabase' | 'sql' | 'mock' | 'prisma';
  /** Adapter-specific configuration */
  config: AdapterConfig;
  /** Connection pool settings */
  pool?: PoolConfig;
  /** Encryption configuration */
  encryption?: DBEncryptionConfig;
  /** Soft delete configuration */
  softDelete?: SoftDeleteConfig;
  /** Audit logging configuration */
  audit?: AuditConfig;
  /** Automatic timestamps configuration */
  timestamps?: TimestampsConfig;
  /** Query result caching configuration */
  cache?: DBCacheConfig;
  /** Read replica configuration */
  readReplica?: ReadReplicaConfig;
  /** Multi-read replica configuration */
  multiRead?: MultiReadConfig;
  /** Multi-write configuration */
  multiWrite?: MultiWriteConfig;
  /** Database event handlers */
  events?: DatabaseEvents;
}

/**
 * Resolved configuration after merging global and operation configs
 */
export interface ResolvedOperationConfig {
  softDelete?: SoftDeleteConfig;
  encryption?: DBEncryptionConfig;
  cache?: DBCacheConfig;
  timestamps?: TimestampsConfig;
  skipAudit: boolean;
  includeSoftDeleted: boolean;
  forceAdapter?: 'primary' | 'replica';
  timeout: number;
}
