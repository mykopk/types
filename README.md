# @myko.pk/types

Shared TypeScript type definitions for MYKOPK packages. Covers database service types, event system types, query builder types, multi-tenancy, migrations, and EO-specific domain types (auth, audit, OTP, avatar, R2).

## Installation

```bash
npm install @myko.pk/types
```

## Usage

```ts
import type { DatabaseService, QueryFilter } from '@myko.pk/types';
import type { AuditLogEntry } from '@myko.pk/types/eo';
import { AuditEventType } from '@myko.pk/types/eo';
```

## Exports

| Sub-path | Contents |
|----------|----------|
| `.`      | Re-exports all `./db` and `./eo` types |
| `./db`   | DB service, adapter, query, pagination, shard, migration, tenant, cache, backup, Redis, health, CLI types |
| `./eo`   | Ecosystem One domain types (audit, auth, avatar, OTP, R2) |

## License

MIT
