/**
 * @mykopk/types/eo — Ecosystem One domain types.
 *
 * This barrel re-exports all type definitions that are specific to the
 * myko-ecosystemone server application. These types are shared between
 * the server, the @myko/logger package, and any other consumer that
 * needs to interoperate with EO's data models.
 */

/** Identity and provider types used during authentication flows */
export type { IdentifierType, Provider } from './auth.types';

/** Audit event enums and the structured log entry interface */
export { AuditEventType, AuditSeverity } from './audit.types';
export type { AuditLogEntry } from './audit.types';

/** Object storage (R2) connection options */
export type { R2Options } from './r2.types';

/** One-time password Redis payload */
export type { OtpData } from './otp.types';

/** Avatar generation service contract */
export type { AvatarGenerator } from './avatar.types';
