/**
 * Categorised audit event types for tracking user actions and system events.
 * Every significant operation in the authentication and authorisation lifecycle
 * produces an audit event consumed by the AuditLogger.
 */
export enum AuditEventType {
  /** One-time password requested for login or verification */
  OTP_REQUESTED = 'OTP_REQUESTED',
  /** One-time password successfully verified */
  OTP_VERIFIED = 'OTP_VERIFIED',
  /** One-time password verification failed */
  OTP_FAILED = 'OTP_FAILED',
  /** User successfully authenticated */
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  /** Authentication attempt failed */
  LOGIN_FAILED = 'LOGIN_FAILED',
  /** User initiated logout */
  LOGOUT = 'LOGOUT',
  /** New session created after authentication */
  SESSION_CREATED = 'SESSION_CREATED',
  /** Existing session refreshed with new tokens */
  SESSION_REFRESHED = 'SESSION_REFRESHED',
  /** Session explicitly revoked by user or admin */
  SESSION_REVOKED = 'SESSION_REVOKED',
  /** Session expired naturally due to TTL */
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  /** Security policy violation detected */
  SECURITY_VIOLATION = 'SECURITY_VIOLATION',
  /** Request originated from a different IP than the session was created with */
  IP_CHANGE_DETECTED = 'IP_CHANGE_DETECTED',
  /** Request originated from a different device than expected */
  DEVICE_CHANGE_DETECTED = 'DEVICE_CHANGE_DETECTED',
  /** Rate limit threshold exceeded for an endpoint */
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  /** Behavioural pattern flagged as suspicious */
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  /** Authentication or refresh token has expired */
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  /** Authorisation check denied access to a resource */
  ACCESS_DENIED = 'ACCESS_DENIED',
  /** OAuth flow initiated — user redirected to provider */
  OAUTH_INITIATED = 'OAUTH_INITIATED',
  /** OAuth provider callback received by the server */
  OAUTH_CALLBACK_RECEIVED = 'OAUTH_CALLBACK_RECEIVED',
  /** OAuth provider callback processed (legacy alias) */
  OAUTH_CALLBACK = 'OAUTH_CALLBACK',
  /** OAuth authentication completed successfully */
  OAUTH_SUCCESS = 'OAUTH_SUCCESS',
  /** OAuth authentication failed */
  OAUTH_FAILED = 'OAUTH_FAILED',
  /** JWT tokens generated for a session */
  TOKEN_GENERATED = 'TOKEN_GENERATED',
  /** User profile data accessed */
  PROFILE_ACCESSED = 'PROFILE_ACCESSED',
  /** New user account created */
  USER_CREATED = 'USER_CREATED',
  /** Invalid or malformed token encountered */
  INVALID_TOKEN = 'INVALID_TOKEN',
  /** Request body or parameters failed validation */
  MALFORMED_REQUEST = 'MALFORMED_REQUEST',
  /** Unexpected internal server error */
  SYSTEM_ERROR = 'SYSTEM_ERROR',
}

/**
 * Severity level assigned to audit events for filtering and alerting.
 * Used by monitoring systems to determine notification urgency.
 */
export enum AuditSeverity {
  /** Routine operational event — no action required */
  LOW = 'LOW',
  /** Notable event that may warrant review */
  MEDIUM = 'MEDIUM',
  /** Security-relevant event that should be investigated */
  HIGH = 'HIGH',
  /** Critical event requiring immediate attention */
  CRITICAL = 'CRITICAL',
}

/**
 * Structured audit log entry capturing all metadata for a single auditable
 * action. Designed to be serialised as JSON for storage in logs, databases,
 * or external security information and event management (SIEM) systems.
 */
export interface AuditLogEntry {
  /** Category of the event being logged */
  eventType: AuditEventType;
  /** Severity level for filtering and alerting */
  severity: AuditSeverity;
  /** Persistent user identifier from the identity store */
  userId?: string;
  /** Application-specific myko identifier */
  mykoId?: string;
  /** Active session identifier if the user was authenticated */
  sessionId?: string;
  /** Client application that initiated the request */
  appId?: string;
  /** Originating IP address of the request */
  ipAddress?: string;
  /** User-Agent header from the requesting client */
  userAgent?: string;
  /** Device name if provided by the client */
  deviceName?: string;
  /** Email address associated with the action */
  email?: string;
  /** Arbitrary key-value payload for event-specific context */
  details: Record<string, any>;
  /** ISO-8601 timestamp of when the event occurred */
  timestamp: Date;
  /** Correlation identifier for tracing across services */
  requestId?: string;
}
