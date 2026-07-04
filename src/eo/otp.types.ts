/**
 * Payload stored in Redis for one-time password verification.
 * Contains the code itself alongside metadata used for validation,
 * rate-limiting, and post-verification user creation decisions.
 */
export interface OtpData {
  /** The plain-text or hashed one-time code sent to the user */
  code: string;
  /** Application-specific identifier for the target user account */
  mykoId: string;
  /** Email address the OTP was sent to (present for email-based OTP) */
  email?: string;
  /** Phone number the OTP was sent to (present for SMS-based OTP) */
  phone?: string;
  /** Purpose of the OTP — determines which flow consumes it */
  type: 'EO_ACCESS' | 'PHONE_ACCESS';
  /** Unix timestamp (ms) of when the OTP was created */
  createdAt: number;
  /** Whether the user account was created as part of this OTP flow */
  isNewUser?: boolean;
}
