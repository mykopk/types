import type { DatabaseAdapterType } from './databaseAdapter';

/**
 * Configuration for multi-read extension
 * Enables reading from multiple replica databases with load balancing
 */
export interface MultiReadConfig {
  /** Enable multi-read extension */
  enabled: boolean;
  /** Read replica adapters */
  adapters: DatabaseAdapterType[];
  /** Load balancing strategy */
  strategy?: 'round-robin' | 'random' | 'fastest' | 'least-conn';
  /** Fallback to primary on replica failure */
  fallbackToPrimary?: boolean;
  /** Health check interval in milliseconds */
  healthCheckInterval?: number;
  /** Max failures before marking replica unhealthy */
  maxFailures?: number;
}

/**
 * Configuration for multi-write extension
 * Enables writing to multiple databases for redundancy/replication
 */
export interface MultiWriteConfig {
  /** Enable multi-write extension */
  enabled: boolean;
  /** Secondary adapters to replicate writes to */
  adapters: DatabaseAdapterType[];
  /** Write mode: 'best-effort' (async, non-blocking) or 'strict' (sync, all must succeed) */
  mode?: 'best-effort' | 'strict';
  /** Behavior on secondary failure: 'log' (silent), 'warn' (console.warn), 'throw' (error) */
  onSecondaryFailure?: 'log' | 'warn' | 'throw';
  /** Timeout for secondary writes in milliseconds */
  timeout?: number;
}
