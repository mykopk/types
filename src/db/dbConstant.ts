/**
 * Encryption Extension Constants
 *
 * Centralized constants for encryption configuration to prevent
 * hardcoded values and ensure consistency across the codebase.
 */

export const ENCRYPTION_DEFAULTS = {
  /** Default encryption algorithm - AES-256-GCM provides authenticated encryption */
  ALGORITHM: 'aes-256-gcm' as const,

  /** IV length for AES-256-GCM in bytes */
  IV_LENGTH: 16,

  /** Expected parts in encrypted text format (iv:authTag:encrypted) */
  ENCRYPTED_PARTS_COUNT: 3,

  /** Default encryption key for testing (32 bytes for AES-256) */
  DEFAULT_KEY: 'abcdefghijklmnopqrstuvwxyz123456',
} as const;

/**
 * Alert rule IDs
 */
export const ALERT_RULE_ID = {
  POOL_EXHAUSTION: 'pool-exhaustion',
  SLOW_QUERY: 'slow-query',
  REPLICA_LAG: 'replica-lag',
} as const;
