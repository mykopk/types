/**
 * Public interface for DatabaseService
 * This is what consumers interact with - matches the documentation exactly
 */

import type {
  DatabaseResult,
  QueryOptions,
  DatabaseHealthStatus,
  Filter,
  CreateInput,
  UpdateInput,
  BatchUpdate,
  BatchUpsertItem,
  FindFirstOptions,
} from './database.types';
import type { TransactionFn, TransactionOptions } from './Transaction';
import type { OperationConfig } from './features-config.types';
import type { DatabaseEvent } from './event.types';
import type { PaginatedResult } from './databsePagination';
import type { AuditContext } from './audit.types';
import type { DatabaseAdapterType } from './databaseAdapter';

/**
 * Table name type - centralized table constants
 */
export type TableName = string;

/**
 * Service status information
 */
export interface ServiceStatus {
  isHealthy: boolean;
  adapter: string;
  uptime: number;
  lastHealthCheck: Date;
}

/**
 *  MAIN DATABASE SERVICE INTERFACE - Public API Surface
 *
 * This is the ONLY interface that applications interact with.
 * Provides all database operations with type safety and configuration overrides.
 *
 * **Application Flow Position:**
 * Repository Layer → **DatabaseService** → DatabaseService → Adapter Chain
 *
 * **What this interface provides:**
 * - Type-safe CRUD operations with per-operation configuration
 * - Batch operations for high-performance scenarios
 * - Transaction support with ACID guarantees
 * - Event system for monitoring and side effects
 * - Audit context management for compliance
 * - Health monitoring and status reporting
 *
 * **Used by:** Repository layer (BaseRepository, UserRepository, etc.)
 * **Implemented by:** DatabaseService (internal)
 * **Created by:** createDatabaseService() factory
 *
 * **Key Features:**
 * - Per-operation config overrides (skipAudit, includeSoftDeleted, etc.)
 * - Automatic extension handling (encryption, soft delete, audit)
 * - Event hooks for application integration
 * - Type-safe operations with proper error handling
 *
 * @example
 * ### Basic Usage in Repository
 * ```typescript
 * class UserRepository extends BaseRepository<User> {
 *   constructor(private db: DatabaseService) {
 *     super(db, Tables.USERS);
 *   }
 *
 *   async findByEmail(email: string) {
 *     return this.db.query(Tables.USERS, {
 *       filter: { field: 'email', operator: 'eq', value: email }
 *     });
 *   }
 * }
 * ```
 *
 * @example
 * ### Per-Operation Configuration
 * ```typescript
 * // Admin view - include soft-deleted records
 * const allUsers = await db.list(Tables.USERS, {}, {
 *   includeSoftDeleted: true,
 *   forceAdapter: 'primary',
 *   cache: { enabled: false }
 * });
 *
 * // Bulk import - skip audit and caching
 * const result = await db.batchCreate(Tables.USERS, users, {
 *   skipAudit: true,
 *   timestamps: { enabled: false },
 *   cache: { enabled: false }
 * });
 * ```
 */
export interface DatabaseServiceInterface {
  /**
   * Get a single record by ID
   * @param table - Table name
   * @param id - Record ID
   * @param config - Optional per-operation configuration overrides
   * @returns Promise resolving to the record or null
   */
  get<T extends object>(
    table: TableName,
    id: string,
    config?: OperationConfig
  ): Promise<DatabaseResult<T | null>>;

  /**
   * List records with optional filtering, sorting, and pagination
   * @param table - Table name
   * @param options - Query options with type-safe fields
   * @param config - Optional per-operation configuration overrides
   * @returns Promise resolving to paginated results
   */
  list<T extends object>(
    table: TableName,
    options?: QueryOptions<T>,
    config?: OperationConfig
  ): Promise<DatabaseResult<PaginatedResult<T>>>;

  /**
   * Create a new record
   * @param table - Table name
   * @param input - Record data to create
   * @param config - Optional per-operation configuration overrides
   * @returns Promise resolving to the created record
   */
  create<T extends object>(
    table: TableName,
    input: CreateInput<T>,
    config?: OperationConfig
  ): Promise<DatabaseResult<T>>;

  /**
   * Update an existing record
   * @param table - Table name
   * @param id - Record ID
   * @param input - Updated fields
   * @param config - Optional per-operation configuration overrides
   * @returns Promise resolving to the updated record
   */
  update<T extends object>(
    table: TableName,
    id: string,
    input: UpdateInput<T>,
    config?: OperationConfig
  ): Promise<DatabaseResult<T>>;

  /**
   * Delete a record
   * @param table - Table name
   * @param id - Record ID
   * @param config - Optional per-operation configuration overrides
   * @returns Promise resolving to void on success
   */
  delete(table: TableName, id: string, config?: OperationConfig): Promise<DatabaseResult<void>>;

  // Batch Operations
  /**
   * Create multiple records in a batch
   * @param table - Table name
   * @param inputs - Array of records to create
   * @param config - Optional per-operation configuration overrides
   * @returns Promise resolving to array of created records
   */
  batchCreate<T extends object>(
    table: TableName,
    inputs: CreateInput<T>[],
    config?: OperationConfig
  ): Promise<DatabaseResult<T[]>>;

  /**
   * Update multiple records in a batch
   * @param table - Table name
   * @param updates - Array of update operations
   * @param config - Optional per-operation configuration overrides
   * @returns Promise resolving to array of updated records
   */
  batchUpdate<T extends object>(
    table: TableName,
    updates: BatchUpdate<T>[],
    config?: OperationConfig
  ): Promise<DatabaseResult<T[]>>;

  /**
   * Delete multiple records in a batch
   * @param table - Table name
   * @param ids - Array of record IDs to delete
   * @param config - Optional per-operation configuration overrides
   * @returns Promise resolving to void on success
   */
  batchDelete(
    table: TableName,
    ids: string[],
    config?: OperationConfig
  ): Promise<DatabaseResult<void>>;

  /**
   * Upsert multiple records in a batch (insert or update).
   * Each entry specifies unique-identifier conditions and the data to
   * create or update.  Runs inside a transaction for atomicity.
   *
   * @param table - Table name
   * @param items - Array of upsert operations
   * @param config - Optional per-operation configuration overrides
   * @returns Promise resolving to array of upserted records
   */
  batchUpsert<T extends object>(
    table: TableName,
    items: BatchUpsertItem[],
    config?: OperationConfig
  ): Promise<DatabaseResult<T[]>>;

  // Query Operations
  /**
   * Execute a complex query with filters, sorting, and pagination
   * @param table - Table name
   * @param query - Query configuration with type-safe fields
   * @param config - Optional per-operation configuration overrides
   * @returns Promise resolving to paginated results
   */
  query<T extends object>(
    table: TableName,
    query: QueryOptions<T>,
    config?: OperationConfig
  ): Promise<DatabaseResult<PaginatedResult<T>>>;

  /**
   * Count records matching a filter
   * @param table - Table name
   * @param filter - Optional filter conditions with type-safe fields
   * @param config - Optional per-operation configuration overrides
   * @returns Promise resolving to the count
   */
  count<T extends object = object>(
    table: TableName,
    filter?: Filter<T> | Filter<T>[],
    config?: OperationConfig
  ): Promise<DatabaseResult<number>>;

  /**
   * Find a single record by filter conditions
   * @param table - Table name
   * @param filter - Filter conditions with type-safe fields
   * @param config - Optional per-operation configuration overrides
   * @returns Promise resolving to the first matching record or null
   */
  findOne<T extends object>(
    table: TableName,
    filter: Filter<T>,
    config?: OperationConfig
  ): Promise<DatabaseResult<T | null>>;

  /**
   * Find a single record by where conditions (Prisma-style)
   * Supports select (projection) and include (relation loading).
   * Unlike findOne which uses Filter<T>, this accepts a raw Prisma-style where object.
   *
   * @param table - Table name
   * @param options - Where + select + include options
   * @param config - Optional per-operation configuration overrides
   * @returns Promise resolving to the first matching record or null
   */
  findFirst<T extends object>(
    table: TableName,
    options?: FindFirstOptions<T>,
    config?: OperationConfig
  ): Promise<DatabaseResult<T | null>>;

  /**
   * Upsert a record (insert or update)
   * Creates a new record if none matches the where conditions, otherwise updates.
   *
   * @param table - Table name
   * @param where - Unique identifier conditions
   * @param create - Data to create if not exists
   * @param update - Data to update if exists
   * @param config - Optional per-operation configuration overrides
   * @returns Promise resolving to the upserted record
   */
  upsert<T extends object>(
    table: TableName,
    where: Record<string, any>,
    create: Record<string, any>,
    update: Record<string, any>,
    config?: OperationConfig
  ): Promise<DatabaseResult<T>>;

  /**
   * Update multiple records matching where conditions
   *
   * @param table - Table name
   * @param where - Filter conditions
   * @param data - Fields to update
   * @param config - Optional per-operation configuration overrides
   * @returns Promise resolving to the count of updated records
   */
  updateMany(
    table: TableName,
    where: Record<string, any>,
    data: Record<string, any>,
    config?: OperationConfig
  ): Promise<DatabaseResult<number>>;

  /**
   * Delete multiple records matching where conditions
   *
   * @param table - Table name
   * @param where - Filter conditions
   * @param config - Optional per-operation configuration overrides
   * @returns Promise resolving to the count of deleted records
   */
  deleteMany(
    table: TableName,
    where: Record<string, any>,
    config?: OperationConfig
  ): Promise<DatabaseResult<number>>;

  /**
   * Soft delete a record (logical deletion)
   * @param table - Table name
   * @param id - Record ID
   * @param config - Optional per-operation configuration overrides
   * @returns Promise resolving to void on success
   */
  softDelete(table: TableName, id: string, config?: OperationConfig): Promise<DatabaseResult<void>>;

  // Transactions
  /**
   * Execute operations within a transaction
   * @param fn - Function containing transactional operations
   * @param options - Optional transaction configuration
   * @returns Promise resolving to the transaction result
   */
  transaction<T>(fn: TransactionFn<T>, options?: TransactionOptions): Promise<DatabaseResult<T>>;

  // Audit Context
  /**
   * Set audit context for tracking user actions
   * @param context - Audit context information
   * @returns Promise resolving to void on success
   */
  setAuditContext(context: AuditContext): Promise<DatabaseResult<void>>;

  // Event System (read-only)
  /**
   * Subscribe to database events
   * @param event - Event type to listen for
   * @param handler - Event handler function
   */
  on<T extends DatabaseEvent['type']>(
    event: T,
    handler: (event: Extract<DatabaseEvent, { type: T }>) => void | Promise<void>
  ): void;

  /**
   * Unsubscribe from database events
   * @param event - Event type to stop listening for
   * @param handler - Event handler function to remove
   */
  off<T extends DatabaseEvent['type']>(
    event: T,
    handler: (event: Extract<DatabaseEvent, { type: T }>) => void | Promise<void>
  ): void;

  // Health & Status
  /**
   * Perform health check on the database connection
   * @returns Promise resolving to health status
   */
  healthCheck(): Promise<DatabaseResult<DatabaseHealthStatus>>;

  /**
   * Get current service status
   * @returns Current service status information
   */
  getStatus(): ServiceStatus;

  /**
   * Close the database connection
   * Gracefully shuts down the connection and releases resources.
   * @returns Promise resolving to DatabaseResult indicating success or failure
   */
  close(): Promise<DatabaseResult<void>>;

  /**
   * The underlying database adapter
   * Used for direct adapter access when needed (e.g., CLI operations)
   */
  adapter: DatabaseAdapterType;
}
