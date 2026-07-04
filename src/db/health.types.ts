import type { DatabaseAdapterType } from './databaseAdapter';

/**
 * Configuration for HealthManager with auto-failover support
 */
export interface HealthManagerConfig {
  /** Primary adapter */
  primary: DatabaseAdapterType;
  /** Backup adapters for failover */
  backups?: DatabaseAdapterType[];
  /** Health check interval in milliseconds */
  healthCheckInterval?: number;
  /** Number of consecutive failures before failover */
  failoverThreshold?: number;
  /** Enable automatic failover */
  autoFailover?: boolean;
}
