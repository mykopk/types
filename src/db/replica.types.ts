import type { DatabaseAdapterType } from './databaseAdapter';
import type { REPLICA_STRATEGY } from './dbEnums';

/**
 * Options for the @UseReplica decorator.
 */
export interface UseReplicaOptions {
  /** Replica selection strategy */
  strategy?: REPLICA_STRATEGY;
  /** Specific replica index to use */
  replicaIndex?: number;
  /** Whether to fallback to primary if replicas are unavailable */
  fallbackToPrimary?: boolean;
}

/**
 * Configuration for read replicas
 */
export interface ReadReplicaConfig {
  /** Whether read replicas are enabled */
  enabled: boolean;
  /** Replica connection configs */
  replicas: DatabaseAdapterType[];
  /** Load balancing strategy */
  strategy?: 'round-robin' | 'random' | 'least-connections';
  /** Fallback to primary if all replicas unhealthy */
  fallbackToPrimary?: boolean;
}

/**
 * Health status tracking for a read replica
 */
export interface ReplicaHealth {
  /** The database adapter for this replica */
  adapter: DatabaseAdapterType;
  /** Whether the replica is currently healthy */
  isHealthy: boolean;
  /** Number of consecutive failures */
  failureCount: number;
  /** Timestamp of last health check */
  lastChecked: number;
  /** Average response time in milliseconds (EMA) */
  avgResponseTime: number;
}
