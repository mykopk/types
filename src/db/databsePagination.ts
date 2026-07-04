/**
 * Pagination options for queries
 */
export interface PaginationOptions {
  /** Number of items to return */
  limit?: number;
  /** Number of items to skip */
  offset?: number;
  /** Cursor for cursor-based pagination */
  cursor?: string;
}

/**
 * Paginated result type
 */
export interface PaginatedResult<T> {
  /** Array of results */
  data: T[];
  /** Total count of items */
  total: number;
  /** Pagination metadata */
  pagination: {
    /** Current page number */
    page?: number;
    /** Number of items per page */
    limit?: number;
    /** Total number of pages */
    totalPages?: number;
    /** Next cursor for cursor-based pagination */
    nextCursor?: string;
    /** Previous cursor for cursor-based pagination */
    prevCursor?: string;
  };
}

/**
 * Pagination information
 */
export interface PaginationInfo {
  /** Current page number */
  page?: number;
  /** Number of items per page */
  limit?: number;
  /** Number of items skipped (offset) */
  offset: number;
  /** Total number of pages */
  totalPages?: number;
}
