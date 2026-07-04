/**
 * @fileoverview DatabaseAdapter interface - Core adapter contract
 *
 * Defines the standardized interface that all database adapters must implement
 * to ensure consistent behavior across different database systems. This interface
 * serves as the foundation for the adapter pattern implementation, enabling
 * seamless switching between different database technologies.
 *
 * **Application Flow Context:**
 * ```
 * Extension Chain → DatabaseAdapterType → Concrete Adapter → Database
 *       ↓              ↓                  ↓               ↓
 * AuditAdapter   → Interface Contract → DrizzleAdapter  → PostgreSQL
 * SoftDelete     → Method Signatures → SupabaseAdapter → Supabase
 * Encryption     → Type Safety      → SQLAdapter     → Raw SQL
 * ```
 *
 * **Interface Responsibilities:**
 * - **Connection Management**: Initialize, connect, disconnect operations
 * - **CRUD Operations**: Create, read, update, delete with type safety
 * - **Query Operations**: Complex queries with filtering and pagination
 * - **Transaction Support**: Atomic operations with rollback capabilities
 * - **Health Monitoring**: Connection status and performance metrics
 * - **Table Management**: Dynamic table registration and schema handling
 *
 * **Implementation Requirements:**
 * All adapters must implement every method in this interface to ensure
 * compatibility with the extension system and service layer. The interface
 * uses generic types to maintain type safety across different data models.
 *
 * @example
 * ```typescript
 * // Adapter implementation example
 * class CustomAdapter implements DatabaseAdapterType {
 *   async initialize(): Promise<DatabaseResult<void>> {
 *     // Initialize connection and validate configuration
 *   }
 *
 *   async findById<T>(table: string, id: string): Promise<DatabaseResult<T | null>> {
 *     // Implement type-safe record retrieval
 *   }
 *
 *   // ... implement all other interface methods
 * }
 * ```
 *
 */

import type { DatabaseResult, QueryOptions, Filter, DatabaseHealthStatus, FindFirstOptions } from './database.types';
import type { PaginatedResult } from './databsePagination';
import type { Transaction } from './Transaction';

/**
 * @interface DatabaseAdapterType
 * @description
 * Core interface defining the contract that all database adapters must implement.
 *
 * This interface ensures consistent behavior across different database implementations
 * by defining a standardized set of methods for database operations. All adapters
 * (Drizzle, Supabase, SQL, etc.) must implement this interface to be compatible
 * with the database service and extension system.
 *
 * **Method Categories:**
 * - **Lifecycle**: initialize, connect, disconnect
 * - **CRUD**: create, findById, findMany, update, delete
 * - **Queries**: count, exists, query (raw SQL)
 * - **Transactions**: transaction with rollback support
 * - **Management**: registerTable, healthCheck
 *
 * **Type Safety:**
 * The interface uses generic types extensively to maintain compile-time type
 * safety while allowing flexibility for different data models and database schemas.
 *
 * @example
 * ```typescript
 * // Using the adapter interface
 * const adapter: DatabaseAdapterType = new DrizzleAdapter(config);
 *
 * // All operations are type-safe
 * await adapter.initialize();
 * adapter.registerTable('users', usersTable, usersTable.id);
 *
 * const user = await adapter.findById<User>('users', '123');
 * const users = await adapter.findMany<User>('users', {
 *   filter: { field: 'status', operator: 'eq', value: 'active' }
 * });
 * ```
 */
export interface DatabaseAdapterType {
  /**
   * Initialize the database adapter with configuration
   * @returns Promise resolving to DatabaseResult indicating success or failure
   */
  initialize(): Promise<DatabaseResult<void>>;

  /**
   * Connect to the database
   * @returns Promise that resolves when connected
   */
  connect(): Promise<void>;

  /**
   * Disconnect from the database
   * @returns Promise that resolves when disconnected
   */
  disconnect(): Promise<void>;

  /**
   * Close the database connection and cleanup resources
   * @returns Promise resolving to DatabaseResult indicating success or failure
   */
  close(): Promise<DatabaseResult<void>>;

  /**
   * Get the underlying database client
   * @returns The underlying database client
   */
  getClient<T extends object = object>(): T;

  /**
   * Execute a raw SQL query
   * @template TResult - The type of rows returned by the query
   * @template TParams - The type of parameter values (defaults to unknown)
   * @param sql - SQL query string
   * @param params - Query parameters (array of values to bind to placeholders)
   * @returns Promise resolving to query results
   */
  query<TResult, TParams = unknown>(sql: string, params?: TParams[]): Promise<TResult[]>;

  /**
   * Register a table with the adapter
   * @param name - Logical name for the table
   * @param table - Table object or name
   * @param idColumn - Optional ID column name
   */
  registerTable<TTable, TIdColumn>(name: string, table: TTable, idColumn?: TIdColumn): void;

  /**
   * Find a single record by ID
   * @param table - Table name
   * @param id - Record ID
   * @returns Promise resolving to DatabaseResult containing the record or null
   */
  findById<T>(table: string, id: string): Promise<DatabaseResult<T | null>>;

  /**
   * Find multiple records with filtering and pagination
   * @param table - Table name
   * @param options - Query options including filters, sorting, and pagination
   * @returns Promise resolving to DatabaseResult containing paginated data
   */
  findMany<T extends object>(
    table: string,
    options?: QueryOptions<T>
  ): Promise<DatabaseResult<PaginatedResult<T>>>;

  /**
   * Create a new record
   * @param table - Table name
   * @param data - Record data to create
   * @returns Promise resolving to DatabaseResult containing the created record
   */
  create<T extends object>(table: string, data: T): Promise<DatabaseResult<T>>;

  /**
   * Update an existing record
   * @param table - Table name
   * @param id - Record ID
   * @param data - Partial record data to update
   * @returns Promise resolving to DatabaseResult containing the updated record
   */
  update<T>(table: string, id: string, data: Partial<T>): Promise<DatabaseResult<T>>;

  /**
   * Delete a record
   * @param table - Table name
   * @param id - Record ID
   * @returns Promise resolving to DatabaseResult indicating success or failure
   */
  delete(table: string, id: string): Promise<DatabaseResult<void>>;

  /**
   * Execute a transaction with multiple operations
   * @param callback - Function containing transaction operations
   * @returns Promise resolving to DatabaseResult containing the transaction result
   */
  transaction<T>(callback: (trx: Transaction) => Promise<T>): Promise<DatabaseResult<T>>;

  /**
   * Check if a record exists
   * @param table - Table name
   * @param id - Record ID
   * @returns Promise resolving to DatabaseResult containing boolean indicating existence
   */
  exists(table: string, id: string): Promise<DatabaseResult<boolean>>;

  /**
   * Count records matching a filter
   * @param table - Table name
   * @param filter - Filter conditions
   * @returns Promise resolving to DatabaseResult containing the count
   */
  count<T extends object = object>(
    table: string,
    filter?: Filter<T> | Filter<T>[]
  ): Promise<DatabaseResult<number>>;

  /**
   * Find the first record matching where conditions (Prisma-style)
   * Supports select (projection) and include (relation loading).
   * Falls back to findMany with limit:1 if not implemented by adapter.
   *
   * @param table - Table name
   * @param options - Where + select + include options
   * @returns Promise resolving to the first matching record or null
   */
  findFirst?<T extends object>(
    table: string,
    options?: FindFirstOptions<T>,
  ): Promise<DatabaseResult<T | null>>;

  /**
   * Upsert a record (insert or update)
   *
   * @param table - Table name
   * @param where - Unique identifier conditions
   * @param create - Data to create if not exists
   * @param update - Data to update if exists
   * @returns Promise resolving to the upserted record
   */
  upsert?<T extends object>(
    table: string,
    where: Record<string, any>,
    create: Record<string, any>,
    update: Record<string, any>,
  ): Promise<DatabaseResult<T>>;

  /**
   * Update multiple records matching where conditions
   *
   * @param table - Table name
   * @param where - Filter conditions
   * @param data - Fields to update
   * @returns Promise resolving to the count of updated records
   */
  updateMany?(
    table: string,
    where: Record<string, any>,
    data: Record<string, any>,
  ): Promise<DatabaseResult<number>>;

  /**
   * Delete multiple records matching where conditions
   *
   * @param table - Table name
   * @param where - Filter conditions
   * @returns Promise resolving to the count of deleted records
   */
  deleteMany?(
    table: string,
    where: Record<string, any>,
  ): Promise<DatabaseResult<number>>;

  /**
   * Perform health check on the database connection
   * @returns Promise resolving to DatabaseResult containing health status
   */
  healthCheck(): Promise<DatabaseResult<DatabaseHealthStatus>>;

  /**
   * Reference to the underlying adapter (for extension/decorator adapters)
   * Used to unwrap nested adapters to access the base adapter
   */
  baseAdapter?: DatabaseAdapterType;
}
