/**
 * Tenant context for multi-tenancy support
 */
export interface TenantContextType {
  /** Tenant identifier */
  id: string;
}

/**
 * Context for tenant validation operations
 */
export interface TenantValidationContext {
  /** Tenant identifier to validate */
  id: string;
}
