import type { DatabaseAdapterType } from './databaseAdapter';

/**
 * Seed definition
 */
export interface Seed {
  /** Seed name */
  name: string;
  /** Seed execution function */
  run: (adapter: DatabaseAdapterType) => Promise<void>;
  /** Optional cleanup function */
  cleanup?: (adapter: DatabaseAdapterType) => Promise<void>;
}

/**
 * Parsed seed file metadata
 */
export interface SeedFile {
  /** Full file path */
  filePath: string;
  /** Seed order (extracted from filename) */
  order: number;
  /** Seed name (extracted from filename) */
  name: string;
}

/**
 * Seed record stored in database
 */
export interface SeedRecord {
  /** Seed name */
  name: string;
  /** When seed was run */
  run_at: string;
  /** Execution time in milliseconds */
  execution_time: number;
}

/**
 * Configuration for SeedManager
 */
export interface SeedManagerConfig {
  /** Database adapter */
  adapter: DatabaseAdapterType;
  /** Path to seeds directory (default: './seeds') */
  seedsPath?: string;
  /** Table name for seed history (default: 'seed_history') */
  tableName?: string;
  /** Skip seeds that have already been run */
  skipExisting?: boolean;
  /** Database schema to use (for multi-tenant support) */
  schema?: string;
}
