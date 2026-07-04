/**
 * Transaction interface
 * Defines the contract for database transactions
 */

import type { DatabaseResult } from './database.types';

/**
 * Interface for database transaction operations
 */
export interface Transaction {
  /**
   * Find a single record within the transaction
   */
  findById<T>(table: string, id: string): Promise<DatabaseResult<T | null>>;

  /**
   * Create a record within the transaction
   */
  create<T>(table: string, data: T): Promise<DatabaseResult<T>>;

  /**
   * Update a record within the transaction
   */
  update<T>(table: string, id: string, data: Partial<T>): Promise<DatabaseResult<T>>;

  /**
   * Delete a record within the transaction
   */
  delete(table: string, id: string): Promise<DatabaseResult<void>>;

  /**
   * Update multiple records within the transaction
   */
  updateMany(table: string, where: Record<string, any>, data: Record<string, any>): Promise<DatabaseResult<number>>;

  /**
   * Delete multiple records within the transaction
   */
  deleteMany(table: string, where: Record<string, any>): Promise<DatabaseResult<number>>;

  /**
   * Upsert a record within the transaction
   */
  upsert<T>(table: string, where: Record<string, any>, create: Record<string, any>, update: Record<string, any>): Promise<DatabaseResult<T>>;

  /**
   * Commit the transaction
   */
  commit(): Promise<void>;

  /**
   * Rollback the transaction
   */
  rollback(): Promise<void>;
}

/**
 * Transaction function type
 */
export type TransactionFn<T> = (trx: Transaction) => Promise<T>;

/**
 * Transaction options
 */
export interface TransactionOptions {
  /** Transaction isolation level */
  isolationLevel?: 'READ_UNCOMMITTED' | 'READ_COMMITTED' | 'REPEATABLE_READ' | 'SERIALIZABLE';
  /** Transaction timeout in milliseconds */
  timeout?: number;
  /** Whether to use savepoints for nested transactions */
  useSavepoints?: boolean;
}
