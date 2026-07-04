import type { DatabaseAdapterType } from './databaseAdapter';

/**
 * Migration definition
 */
export interface Migration {
  /** Migration version (timestamp or number) */
  version: string;
  /** Migration name */
  name: string;
  /** Migration up function */
  up: (adapter: DatabaseAdapterType) => Promise<void>;
  /** Migration down function (rollback) */
  down: (adapter: DatabaseAdapterType) => Promise<void>;
}

/**
 * Parsed migration file metadata
 */
export interface MigrationFile {
  /** Full file path */
  filePath: string;
  /** Migration version extracted from filename */
  version: string;
  /** Migration name extracted from filename */
  name: string;
}

/**
 * Migration record stored in database
 */
export interface MigrationRecord {
  /** Migration version */
  version: string;
  /** Migration name */
  name: string;
  /** When migration was applied */
  applied_at: string;
  /** Execution time in milliseconds */
  execution_time: number;
}

/**
 * Configuration for MigrationManager
 */
export interface MigrationManagerConfig {
  /** Database adapter */
  adapter: DatabaseAdapterType;
  /** Path to migrations directory (default: './migrations') */
  migrationsPath?: string;
  /** Table name for migration history (default: 'schema_migrations') */
  tableName?: string;
  /** Database schema to use (for multi-tenant support) */
  schema?: string;
}

/**
 * Migration status response
 */
export interface MigrationStatus {
  /** Migrations that have been applied */
  applied: MigrationRecord[];
  /** Migrations that are pending */
  pending: string[];
}
