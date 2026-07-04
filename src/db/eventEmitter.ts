/**
 * Event emitter interface
 * Defines the contract for database event emission
 */

import type { DatabaseEvent, DBEventHandler, DatabaseOperationType } from './event.types';

/**
 * Base execution context interface for database operations.
 * Extend this interface to add framework-specific context.
 *
 * @example
 * ```typescript
 * // NestJS context
 * interface NestJsDbContext extends DatabaseExecutionContext {
 *   requestId: string;
 *   userId?: string;
 *   ip?: string;
 * }
 *
 * // Express context
 * interface ExpressDbContext extends DatabaseExecutionContext {
 *   req: Request;
 *   res: Response;
 * }
 * ```
 */
export interface DatabaseExecutionContext {
  /** Optional request ID for tracing */
  requestId?: string;
  /** Optional user ID for audit */
  userId?: string;
  /** Optional tenant ID for multi-tenancy */
  tenantId?: string;
  /** Additional context data */
  [key: string]: unknown;
}

/**
 * Emit a query error event
 *
 * @typeParam TContext - Custom context type extending DatabaseExecutionContext
 */
export interface EmitQueryErrorOptions<
  TContext extends DatabaseExecutionContext = DatabaseExecutionContext,
> {
  table: string;
  operation: DatabaseOperationType;
  error: Error;
  params?: Record<string, object>;
  context?: TContext;
}

export interface DatabaseError extends Error {
  code?: string;
  status?: number;
  cause?: Error;
}

/**
 * Interface for database event emission
 */
export interface DatabaseEventEmitterType {
  /**
   * Register an event handler for a specific event type
   */
  on<T extends DatabaseEvent>(eventType: T['type'], handler: DBEventHandler<T>): void;

  /**
   * Remove an event handler for a specific event type
   */
  off<T extends DatabaseEvent>(eventType: T['type'], handler: DBEventHandler<T>): void;

  /**
   * Emit an event to all registered handlers
   */
  emit<T extends DatabaseEvent>(event: T): void;

  /**
   * Emit a before query event
   */
  emitBeforeQuery<T extends object = object>(
    table: string,
    operation: DatabaseOperationType,
    params?: Partial<T>,
    context?: Record<string, string | number | boolean | null>
  ): void;

  /**
   * Emit an after query event
   */
  emitAfterQuery(
    table: string,
    operation: DatabaseOperationType,
    duration: number,
    affectedRows?: number
  ): void;

  /**
   * Emit a query error event
   */
  emitQueryError<T extends object = object>(
    table: string,
    operation: DatabaseOperationType,
    error: DatabaseError,
    params?: Partial<T>,
    context?: Record<string, string | number | boolean | null>
  ): void;

  /**
   * Emit a before transaction event
   */
  emitBeforeTransaction(
    transactionId: string,
    context?: Record<string, string | number | boolean | null>
  ): void;

  /**
   * Emit an after transaction event
   */
  emitAfterTransaction(transactionId: string, duration: number): void;

  /**
   * Emit a transaction rollback event
   */
  emitTransactionRollback(transactionId: string, error?: DatabaseError): void;

  /**
   * Emit a health change event
   */
  emitHealthChange<TDetails extends object = object>(
    previousStatus: boolean,
    currentStatus: boolean,
    details?: TDetails
  ): void;

  emitQueryError(options: EmitQueryErrorOptions): void;
}

export interface BeforeQueryEvent extends DatabaseEvent {
  type: 'beforeQuery';
  adapter: string;
  table: string;
  operation: DatabaseOperationType;
  params?: Record<string, object>;
  context?: DatabaseExecutionContext;
}

export interface AfterQueryEvent extends DatabaseEvent {
  type: 'afterQuery';
  adapter: string;
  table: string;
  operation: DatabaseOperationType;
  duration: number;
  affectedRows?: number;
}

export interface QueryErrorEvent extends DatabaseEvent {
  type: 'queryError';
  adapter: string;
  table: string;
  operation: DatabaseOperationType;
  error: Error;
  params?: Record<string, object>;
  context?: DatabaseExecutionContext;
}

export interface BeforeTransactionEvent extends DatabaseEvent {
  type: 'beforeTransaction';
  adapter: string;
  transactionId: string;
  context?: DatabaseExecutionContext;
}

export interface AfterTransactionEvent extends DatabaseEvent {
  type: 'afterTransaction';
  adapter: string;
  transactionId: string;
  duration: number;
}

export interface TransactionRollbackEvent extends DatabaseEvent {
  type: 'transactionRollback';
  adapter: string;
  transactionId: string;
  error?: Error;
}
