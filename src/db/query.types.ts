/**
 * Query Builder Types
 *
 * Types for SQL query building utilities used by database adapters
 * and the fluent QueryBuilder API.
 */

import type { Filter, QueryOptions, DatabaseResult } from './database.types';
import type { PaginatedResult } from './databsePagination';
import type { OperationConfig } from './features-config.types';

/**
 * Options for building SQL WHERE clause conditions
 */
export interface BuildWhereClauseOptions {
  /** Field name to filter on */
  field: string;
  /** Comparison operator (e.g., '=', '>', '<', 'LIKE', 'IN') */
  operator: string;
  /** Value to compare against */
  value: unknown;
  /** Array to collect parameterized values */
  params: unknown[];
  /** Starting index for parameter placeholders ($1, $2, etc.) */
  startIndex: number;
}

// ============================================================
// Fluent QueryBuilder Types
// ============================================================

/**
 * Filter operator types supported by the query builder
 */
export type FilterOperator = Filter['operator'];

/**
 * Raw SQL condition for complex queries
 */
export interface RawCondition {
  /** Raw SQL clause (use $1, $2, etc. for parameters) */
  clause: string;
  /** Parameter values for the clause */
  params: unknown[];
  /** Logical operator to combine with other conditions */
  logical?: 'and' | 'or';
}

/**
 * JOIN clause definition
 */
export interface JoinClause {
  /** Type of join */
  type: 'inner' | 'left' | 'right' | 'full';
  /** Table to join */
  table: string;
  /** Join condition (e.g., 'users.id = orders.user_id') */
  condition: string;
  /** Optional alias for the joined table */
  alias?: string;
  /** Schema for the joined table */
  schema?: string;
}

/**
 * GROUP BY with optional HAVING clause
 */
export interface GroupByClause {
  /** Fields to group by */
  fields: string[];
  /** HAVING conditions (raw SQL) */
  having?: RawCondition[];
}

/**
 * SELECT clause options
 */
export interface SelectClause {
  /** Specific fields to select (empty = all) */
  fields: string[];
  /** Raw select expressions */
  rawExpressions: string[];
  /** Whether to use DISTINCT */
  distinct: boolean;
}

/**
 * Result from QueryBuilder.build() containing all query components
 */
export interface QueryBuilderResult<TRecord extends object = object> {
  /** Standard QueryOptions for BaseRepository.findMany() */
  options: QueryOptions<TRecord>;
  /** Array of filters for direct SQL building */
  filters: Filter<TRecord>[];
  /** Raw SQL conditions */
  rawConditions: RawCondition[];
  /** JOIN clauses */
  joins: JoinClause[];
  /** GROUP BY clause */
  groupBy?: GroupByClause;
  /** SELECT clause */
  select?: SelectClause;
}

/**
 * Repository interface for QueryBuilder execution
 * Matches BaseRepository's method signatures
 */
export interface QueryExecutor<TRecord extends object = object> {
  findMany(
    options?: QueryOptions<TRecord>,
    config?: OperationConfig
  ): Promise<DatabaseResult<PaginatedResult<TRecord>>>;
  findOne?(
    filter: Filter<TRecord>,
    config?: OperationConfig
  ): Promise<DatabaseResult<TRecord | null>>;
  count?(filter?: Filter<TRecord> | Filter<TRecord>[], config?: OperationConfig): Promise<DatabaseResult<number>>;
}
