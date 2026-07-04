/**
 * Configuration for a shard key.
 */
export interface ShardKey {
  /** Name of the shard key */
  name: string;
  /** Type of sharding strategy */
  type: 'hash' | 'range' | 'consistent_hash';
  /** Columns that make up the shard key */
  columns: string[];
  /** Sharding strategy to use */
  strategy: 'modulus' | 'hash' | 'range';
  /** Number of shards */
  shardCount: number;
}

/**
 * Configuration for a database shard.
 */
export interface ShardConfig {
  /** Unique shard identifier */
  id: number;
  /** Database connection string */
  connectionString: string;
  /** Whether this is the primary shard */
  isPrimary: boolean;
  /** Geographic region of the shard (optional) */
  region?: string;
}
