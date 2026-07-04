# Quick Start

## Installation

```bash
npm install @myko.pk/types
```

## 1. Import Types

```ts
import type { DatabaseService, QueryFilter, AdapterConfig } from '@myko.pk/types';
import type { AuditLogEntry, AuthEvent } from '@myko.pk/types/eo';
import type { HealthCheckResult, MigrationConfig } from '@myko.pk/types/db';
```

## 2. Use With Values (Enums)

```ts
import { AuditEventType } from '@myko.pk/types/eo';

const eventType = AuditEventType.LOGIN_SUCCESS;
```

## 3. Database Service Types

```ts
import type { DatabaseService } from '@myko.pk/types';

function getService(): DatabaseService {
  // Return any adapter that conforms to DatabaseService interface
}
```

## 4. Domain Types

```ts
import type { OTPPayload, AvatarMeta, R2Config } from '@myko.pk/types/eo';

const otp: OTPPayload = {
  code: '482916',
  expiresAt: new Date(Date.now() + 5 * 60 * 1000),
};
```

## What's Next?

See the [full README](../README.md) for all available type categories and sub-path exports.
