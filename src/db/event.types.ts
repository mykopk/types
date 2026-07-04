// FILE: ./event.types.ts (modified)

/**
 * Event system types for database operations
 * Matches the documentation's event system design
 */

/**
 * Database operation types
 */
export type DatabaseOperationType = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';

/**
 * Base database event interface
 */
export interface DatabaseEvent {
  /** Event type */
  type: string;
  /** Timestamp when the event occurred */
  timestamp: Date;
}

/**
 * Event emitted before any write operation starts
 */
export interface DatabaseBeforeWriteEvent extends DatabaseEvent {
  type: 'beforeWrite';
  /** Database adapter name */
  adapter: string;
  /** Database operation type */
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  /** Table name */
  table: string;
  /** Data being written */
  data: Record<string, string | number | boolean | Date>;
}

/**
 * Event emitted after successful write operation
 */
export interface DatabaseAfterWriteEvent extends DatabaseEvent {
  type: 'afterWrite';
  /** Database adapter name */
  adapter: string;
  /** Database operation type */
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  /** Table name */
  table: string;
  /** Result data */
  result: Record<string, string | number | boolean | Date>;
  /** Operation duration in milliseconds */
  duration: number;
}

/**
 * Event emitted before any read operation starts
 */
export interface DatabaseBeforeReadEvent extends DatabaseEvent {
  type: 'beforeRead';
  /** Database adapter name */
  adapter: string;
  /** Database operation type */
  operation: 'READ';
  /** Table name */
  table: string;
}

/**
 * Event emitted after successful read operation
 */
export interface DatabaseAfterReadEvent extends DatabaseEvent {
  type: 'afterRead';
  /** Database adapter name */
  adapter: string;
  /** Database operation type */
  operation: 'READ';
  /** Table name */
  table: string;
  /** Result data */
  result: Record<string, string | number | boolean | Date>;
  /** Operation duration in milliseconds */
  duration: number;
}

/**
 * Event emitted when any database operation fails
 */
export interface DBErrorEvent extends DatabaseEvent {
  type: 'error';
  /** Database adapter name */
  adapter: string;
  /** Database operation type */
  operation: string;
  /** Table name */
  table: string;
  /** Error that occurred */
  error: Error;
}

/**
 * Event emitted when health status changes
 */
export interface HealthChangeEvent extends DatabaseEvent {
  type: 'healthChange';
  /** Database adapter name */
  adapter: string;
  /** Previous health status */
  previousStatus: boolean;
  /** Current health status */
  currentStatus: boolean;
  /** Health check details */
  details?: Record<string, string | number | boolean>;
}

/**
 * Event emitted on slow queries
 */
export interface SlowQueryEvent extends DatabaseEvent {
  type: 'slowQuery';
  /** Table name */
  table: string;
  /** Database operation type */
  operation: 'READ';
  /** Query configuration */
  query: Record<string, string | number | boolean>;
  /** Query duration in milliseconds */
  duration: number;
  /** Slow query threshold that was exceeded */
  threshold: number;
}

/**
 * Audit event for compliance logging
 */
export interface DatabaseAuditEvent extends DatabaseEvent {
  type: 'audit';
  /** Database operation type */
  operation: string;
  /** User ID who performed the action */
  userId?: string;
  /** System action identifier */
  systemAction?: string;
  /** Request ID for tracing */
  requestId: string;
  /** Table name */
  table: string;
  /** Record ID that was affected */
  recordId?: string;
  /** Changes made to the record */
  changes: {
    /** State before the change */
    before?: Record<string, string | number | boolean | Date>;
    /** State after the change */
    after?: Record<string, string | number | boolean | Date>;
    /** Fields that were changed */
    fields?: string[];
  };
  /** IP address of the user */
  ipAddress?: string;
  /** User agent string */
  userAgent?: string;
}

/**
 * Union type for all database events
 */
export type DatabaseEventUnion =
  | DatabaseBeforeWriteEvent
  | DatabaseAfterWriteEvent
  | DatabaseBeforeReadEvent
  | DatabaseAfterReadEvent
  | DBErrorEvent
  | DatabaseAuditEvent
  | HealthChangeEvent
  | SlowQueryEvent;

/**
 * Event handler function type
 */
export type DBEventHandler<T extends DatabaseEvent> = (event: T) => void | Promise<void>;
