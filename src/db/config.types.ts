/**
 * Configuration types
 * Types for database configuration
 */

import type { ADAPTERS } from './dbEnums';

/**
 * Base adapter interface with common configuration options
 */
export interface BaseAdapter {
  /** Database adapter type */
  adapter: ADAPTERS;
  /** Database connection string */
  connectionString?: string;
  /** Database selection */
  use?: string;
  /** Connection pool configuration */
  pool?: {
    /** Minimum number of connections to maintain in the pool */
    min?: number;
    /** Maximum number of connections allowed in the pool */
    max?: number;
    /** Time in milliseconds after which idle connections are closed */
    idleTimeoutMillis?: number;
  };
  /** Maximum time in milliseconds to wait for a query to complete */
  queryTimeout?: number;
  /** Whether to enable SSL for database connections */
  ssl?: boolean;
  /** Database schema name */
  schema?: string;
  /**
   * Custom ID column mappings for tables
   * Example: { 'feature_flags': 'key', 'sessions': 'session_id' }
   * Tables not specified will default to 'id'
   */
  tableIdColumns?: Record<string, string>;
  /**
   * Include SQL statement in error messages for debugging
   * @default true
   */
  showSqlInErrors?: boolean;
}

/**
 * Drizzle adapter configuration
 */
export interface DrizzleAdapterConfig extends BaseAdapter {
  adapter: ADAPTERS.DRIZZLE;
  // Drizzle-specific properties can be added here if needed
}

/**
 * Supabase adapter configuration
 */
export interface SupabaseAdapterConfig extends BaseAdapter {
  adapter: ADAPTERS.SUPABASE;
  /** Supabase project URL */
  supabaseUrl: string;
  /** Supabase anonymous key */
  supabaseAnonKey?: string;
  /** Supabase service role key */
  supabaseServiceKey?: string;
}

/**
 * SQL adapter configuration
 */
export interface SQLAdapterConfig extends BaseAdapter {
  adapter: ADAPTERS.SQL;
  // SQL-specific properties can be added here if needed
}

/**
 * Mock adapter configuration for testing
 */
export interface DbMockAdapterConfig extends BaseAdapter {
  adapter: ADAPTERS.MOCK;
  /** Initial data to populate the mock database */
  initialData?: Record<string, Record<string, unknown>[]>;
  /** Whether to auto-generate IDs for records without them */
  autoGenerateIds?: boolean;
  /** Simulated latency in milliseconds */
  latency?: number;
  /** Simulated failure rate (0-1) for chaos testing */
  failRate?: number;
}

/**
 * Prisma adapter configuration
 */
export interface PrismaAdapterConfig extends BaseAdapter {
  adapter: ADAPTERS.PRISMA;
  /** Pre-configured PrismaClient instance (takes precedence over url) */
  client?: any;
  /** Prisma datasource URL override (defaults to DATABASE_URL env var) */
  url?: string;
  /** Prisma client constructor options */
  prismaOptions?: {
    /** Query logging configuration */
    log?: ('query' | 'info' | 'warn' | 'error')[];
    /** Error format */
    errorFormat?: 'minimal' | 'colorless' | 'pretty';
  };
}

/**
 * Database configuration as a union of all adapter configurations
 */
export type DatabaseConfig =
  | DrizzleAdapterConfig
  | SupabaseAdapterConfig
  | SQLAdapterConfig
  | DbMockAdapterConfig
  | PrismaAdapterConfig;
