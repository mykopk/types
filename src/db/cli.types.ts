/**
 * CLI configuration types for @plyaz/db package
 */

import type { DatabaseServiceConfig } from './features-config.types';

/**
 * CLI configuration interface extending DatabaseServiceConfig
 * with optional paths for migrations and seeds
 */
export interface DatabaseCLIConfig extends DatabaseServiceConfig {
  /** Path to migrations directory */
  migrationsPath?: string;
  /** Table name for tracking migrations */
  migrationsTable?: string;
  /** Path to seeds directory */
  seedsPath?: string;
  /** Table name for tracking seeds */
  seedsTable?: string;
}
