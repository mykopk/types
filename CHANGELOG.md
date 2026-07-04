# Changelog

## 1.0.0 (2026-07-04)

### Initial Release

Shared TypeScript types for MYKOPK packages. Provides type definitions and interfaces for database, Redis, authentication, and ecosystem operations.

#### Key Exports
- **Database types** — `DatabaseAdapter`, `DatabaseService`, shard config, migrations, seeds, pagination, query builders
- **Redis types** — cache config, connection settings
- **Auth types** — authentication, OTP, session models
- **Audit types** — audit log entries, event structures
- **R2 types** — Cloudflare R2 object storage models
- **Transaction** — `Transaction` wrapper, `EventEmitter` patterns
- **CLI types** — CLI command argument and option schemas
- **Feature config** — feature flag definitions and feature-config shapes
