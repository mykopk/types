/**
 * @fileoverview Core database types and utilities
 *
 * Provides fundamental type definitions and utility functions used throughout
 * the database package. These types ensure type safety, consistent data structures,
 * and standardized error handling across all database operations and adapters.
 *
 * **Type Categories:**
 * - **Input Types**: CreateInput, UpdateInput for data manipulation
 * - **Query Types**: QueryOptions, Filter, SortOptions for data retrieval
 * - **Result Types**: DatabaseResult, PaginatedResult for operation results
 * - **Utility Types**: DatabaseHealthStatus for monitoring
 * - **Error Types**: DatabaseError for standardized error handling
 *
 * **Application Flow Context:**
 * ```
 * Application Data → Input Types → Database Operations → Result Types
 *       ↓             ↓            ↓                 ↓
 * User Input     → Validation → Adapter Methods  → Type-Safe Results
 * Query Params   → Type Safety → SQL Generation   → Error Handling
 * ```
 *
 * **Key Features:**
 * - **Type Safety**: Compile-time validation of data structures
 * - **Result Pattern**: Consistent success/failure result handling
 * - **Generic Support**: Flexible types for different data models
 * - **Error Standardization**: Unified error handling across adapters
 *
 * @example
 * ```typescript
 * // Type-safe database operations
 * interface User {
 *   id: string;
 *   name: string;
 *   email: string;
 *   createdAt: Date;
 * }
 *
 * // Input types automatically exclude system fields
 * const createData: CreateInput<User> = {
 *   name: 'John Doe',
 *   email: 'john@example.com'
 *   // id, createdAt automatically excluded
 * };
 *
 * // Result pattern for consistent error handling
 * const result = await service.create('users', createData);
 * if (result.success) {
 *   console.log('Created user:', result.value);
 * } else {
 *   console.error('Error:', result.error.message);
 * }
 * ```
 */

import type { PaginationOptions } from './databsePagination';

/**
 * Input type for creating records
 */
export type CreateInput<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

/**
 * Input type for updating records
 */
export type UpdateInput<T> = Partial<Omit<T, 'id' | 'createdAt'>>;

/**
 * Batch update operation
 */
export interface BatchUpdate<T> {
  /** Record ID to update */
  id: string;
  /** Fields to update */
  data: UpdateInput<T>;
}

/**
 * A single upsert entry for batchUpsert operations.
 */
export interface BatchUpsertItem {
  /** Unique identifier conditions */
  where: Record<string, any>;
  /** Data to create if not exists */
  create: Record<string, any>;
  /** Data to update if exists */
  update: Record<string, any>;
}

/**
 * Query options for findMany operations
 */
export interface QueryOptions<TRecord extends object = object> {
  /** Single filter condition (backward compatible) */
  filter?: Filter<TRecord>;
  /** Multiple filter conditions (AND-combined). Takes precedence over singular `filter` when set. */
  filters?: Filter<TRecord>[];
  /** Multiple filter groups combined with OR. Each inner array is AND-combined. Takes precedence over filter/filters when set. */
  orFilters?: Filter<TRecord>[][];
  /** Sorting options */
  sort?: SortOptions<TRecord>[];
  /** Pagination options */
  pagination?: PaginationOptions;
  /** Database schema to use (overrides adapter default) */
  schema?: string;
  /** Fields to select (projection). Supports nested select for relations. */
  select?: Record<string, boolean | { select: Record<string, boolean> }>;
  /** Relations to include. Supports nested include for relations. */
  include?: Record<string, boolean | { include: Record<string, any> }>;
  /** Raw SQL conditions to append to the WHERE clause. Each condition has a clause with $N placeholders and matching params. */
  rawConditions?: Array<{ clause: string; params: unknown[]; logical?: 'and' | 'or' }>;
}

/**
 * Filter conditions for queries
 */
export interface Filter<TRecord extends object = object> {
  /** Field to filter on */
  field: keyof TRecord & string;
  /** Filter operator */
  operator:
    | 'eq'
    | 'ne'
    | 'gt'
    | 'gte'
    | 'lt'
    | 'lte'
    | 'in'
    | 'notIn'
    | 'like'
    | 'ilike'
    | 'between'
    | 'isNull'
    | 'isNotNull';
  /** Value to compare against */
  value: TRecord[keyof TRecord];
  /** Logical operator to combine with other filters */
  logical?: 'and' | 'or' | 'not';
}

/**
 * Sorting options for queries
 */
export interface SortOptions<TRecord extends object = object> {
  /** Field to sort by */
  field: keyof TRecord & string;
  /** Sort direction */
  direction: 'asc' | 'desc';
}

/**
 * Database health status
 */
export interface DatabaseHealthStatus<TDetails extends object = object> {
  /** Whether the database is healthy */
  isHealthy: boolean;
  /** Response time in milliseconds */
  responseTime: number;
  /** Additional health details */
  details?: TDetails;
}

/**
 * Database result type that wraps either a successful value or an error
 */
export interface DatabaseResult<T> {
  /** Whether the operation was successful */
  success: boolean;
  /** The result value if successful */
  value?: T | null;
  /** The error if unsuccessful */
  error?: Error | null;
}

/**
 * Options for findFirst queries (supports Prisma-style where + select + include)
 */
export interface FindFirstOptions<TRecord extends object = object> {
  /** Filter conditions (Prisma-style object) */
  where?: Record<string, any>;
  /** Fields to select (projection) */
  select?: Record<string, boolean | { select: Record<string, boolean> }>;
  /** Relations to include */
  include?: Record<string, boolean | { include: Record<string, any> }>;
}

/**
 * Options for the @Cacheable decorator.
 */
export interface CacheableOptions {
  /** Time to live in seconds */
  ttl?: number;
  /** Custom cache key (auto-generated if not specified) */
  key?: string;
  /** Condition function to determine if result should be cached */
  condition?: <T>(result: T) => boolean;
}

/**
 * Options for the @CacheEvict decorator.
 */
export interface CacheEvictOptions {
  /** Specific cache key to evict */
  key?: string;
  /** Cache pattern to evict (e.g., 'users:*') */
  pattern?: string;
  /** Whether to evict all cache entries */
  allEntries?: boolean;
}

/**
 * Configuration options for dynamic connection pool.
 */
export interface DynamicPoolConfig {
  /** Minimum number of connections in the pool */
  min: number;
  /** Maximum number of connections in the pool */
  max: number;
  /** Time in milliseconds after which idle connections are closed */
  idleTimeoutMillis: number;
  /** Time in milliseconds to wait for a connection to become available */
  acquireTimeoutMillis: number;
  /** Auto-scaling configuration */
  scaling: {
    /** Whether auto-scaling is enabled */
    enabled: boolean;
    /** Percentage threshold for scaling up (default: 80) */
    scaleUpThreshold: number;
    /** Percentage threshold for scaling down (default: 20) */
    scaleDownThreshold: number;
    /** Interval in milliseconds for scaling checks (default: 30000) */
    scaleInterval: number;
    /** Maximum number of connections to add/remove at once */
    maxScale: number;
  };
}

/**
 * Database alert with detailed information.
 */
export interface Alert {
  /** Unique alert identifier */
  id: string;
  /** Alert message */
  message: string;
  /** Alert severity level */
  severity: 'info' | 'warning' | 'error' | 'critical';
  /** When the alert was triggered */
  timestamp: Date;
  /** Whether the alert has been resolved */
  resolved: boolean;
  /** When the alert was resolved (if applicable) */
  resolvedAt?: Date;
  /** Source of the alert */
  source: 'database' | 'pool' | 'replica' | 'cache' | 'backup';
}

/**
 * Rule for generating alerts based on metrics.
 */
export interface AlertRule {
  /** Unique rule identifier */
  id: string;
  /** Condition function that returns true if alert should be triggered */
  condition: (metrics: Record<string, object>) => boolean;
  /** Function that generates alert message */
  message: (metrics: Record<string, object>) => string;
  /** Alert severity level */
  severity: 'info' | 'warning' | 'error' | 'critical';
  /** Alert source category */
  source: 'database' | 'pool' | 'replica' | 'cache' | 'backup';
}

/**
 * Metrics collected for database queries.
 */
export interface QueryMetrics {
  /** SQL query string */
  query: string;
  /** Query execution time in milliseconds */
  duration: number;
  /** Timestamp when query was executed */
  timestamp: Date;
  /** Whether query was successful */
  success: boolean;
  /** Error message if query failed */
  error?: string;
  /** Database table name */
  table?: string;
  /** Database operation type */
  operation?: string;
}

/**
 * Metrics collected for connection pool.
 */
export interface PoolMetrics {
  totalReleased: number;
  totalAcquired: number;
  /** Total number of connections */
  totalConnections: number;
  /** Number of active connections */
  activeConnections: number;
  /** Number of idle connections */
  idleConnections: number;
  /** Number of requests waiting for connections */
  waitingRequests: number;
  /** Average time to acquire a connection */
  averageAcquisitionTime: number;
}

/**
 * Information about the current tenant.
 */
export interface TenantInfo {
  /** Unique tenant identifier */
  id: string;
  /** Tenant display name */
  name: string;
  /** Database schema for the tenant (optional) */
  schema?: string;
  /** Tenant role for permissions (optional) */
  role?: string;
}
