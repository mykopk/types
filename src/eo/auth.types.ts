/**
 * Supported identifier types for user lookup and verification.
 * Used across OTP flows, magic links, and account linking to
 * distinguish between email-based and phone-based identity.
 */
export type IdentifierType = 'email' | 'phone';

/**
 * Supported OAuth identity providers for social login and account linking.
 * Each provider maps to a corresponding Passport strategy and OAuth flow
 * configured in the provider's developer console.
 */
export type Provider = 'google' | 'facebook' | 'twitter';
