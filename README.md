<p align="center">
  <h1 align="center">@myko.pk/types</h1>
  <p align="center"><strong>Shared types. Zero friction.</strong></p>
  <p align="center">Canonical TypeScript type definitions for the MYKO ecosystem — database, events, query builder, multi-tenancy, migrations, and domain types.</p>
  <p align="center">
    <a href="https://www.npmjs.com/package/@myko.pk/types"><img src="https://img.shields.io/npm/v/@myko.pk/types?style=for-the-badge&logo=npm&logoColor=white" alt="npm version"></a>
    <a href="https://www.npmjs.com/package/@myko.pk/types"><img src="https://img.shields.io/npm/dm/@myko.pk/types?style=for-the-badge&logo=npm&logoColor=white" alt="npm downloads"></a>
    <a href="https://github.com/mykopk/types/actions"><img src="https://img.shields.io/github/actions/workflow/status/mykopk/types/ci.yml?style=for-the-badge&logo=githubactions&logoColor=white&label=CI" alt="build"></a>
    <a href="https://github.com/mykopk/types"><img src="https://img.shields.io/github/stars/mykopk/types?style=for-the-badge&logo=github" alt="stars"></a>
    <a href="https://github.com/mykopk/types"><img src="https://img.shields.io/github/forks/mykopk/types?style=for-the-badge&logo=github" alt="forks"></a>
    <a href="https://github.com/mykopk/types"><img src="https://img.shields.io/github/issues/mykopk/types?style=for-the-badge&logo=github" alt="issues"></a>
    <a href="https://github.com/mykopk/types"><img src="https://img.shields.io/github/last-commit/mykopk/types?style=for-the-badge&logo=github" alt="last commit"></a>
    <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge" alt="license"></a>
  </p>
</p>

## 📑 Table of Contents

- [Description](#description)
- [Key Features](#key-features)
- [Use Cases](#use-cases)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Contributors](#contributors)
- [Contributing](#contributing)
- [License](#license)

## 📝 Description

@myko.pk/types is the canonical source of shared TypeScript type definitions for the entire MYKO ecosystem. Every MYKO package — atlas, config, errors, logger, and the services that depend on them — imports its types from here. Instead of scattering type definitions across packages or duplicating interfaces, this package provides a single source of truth for database service types, event system types, query builder types, multi-tenancy models, migration configs, and all ecosystem-one (EO) domain types like auth, audit, OTP, avatar, and R2.

## ✨ Key Features

- **🔄 Single Source of Truth** — Every MYKO package imports shared types from one place. No duplication, no drift.
- **🗂️ Logical Sub-path Exports** — Import exactly what you need: `@myko.pk/types` (all), `@myko.pk/types/db` (database types), or `@myko.pk/types/eo` (domain types).
- **📘 Fully Typed** — Every interface, type alias, and enum is explicitly defined with JSDoc annotations.
- **🔌 Framework Agnostic** — Pure TypeScript types with zero runtime dependencies. Use in any Node.js or browser project.

## 🎯 Use Cases

- Importing `DatabaseService`, `QueryFilter`, or `AdapterConfig` types across multiple MYKO backend services without redefining them.
- Sharing domain-specific types between services (audit logs, auth events, OTP payloads) via the `./eo` sub-path.
- Ensuring type consistency between Drizzle ORM table schemas and application-layer DTOs.
- Providing type-safe integration between MYKO packages and third-party APIs.

## 🛠️ Tech Stack

- 📘 **TypeScript**

**Notable libraries:** None — pure types, zero runtime deps.

## ⚡ Quick Start

```bash
npm install @myko.pk/types
```

```ts
import type { DatabaseService, QueryFilter } from '@myko.pk/types';
import type { AuditLogEntry } from '@myko.pk/types/eo';
import { AuditEventType } from '@myko.pk/types/eo';
```

## 🚀 Available Scripts

- **build** — `npm run build`
- **typecheck** — `npm run typecheck`

## 📁 Project Structure

```
.
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
├── SECURITY.md
├── package.json
├── src
│   ├── db
│   │   ├── adapter.types.ts
│   │   ├── cache.types.ts
│   │   ├── cli.types.ts
│   │   ├── health.types.ts
│   │   ├── index.ts
│   │   ├── migration.types.ts
│   │   ├── pagination.types.ts
│   │   ├── query.types.ts
│   │   ├── redis.types.ts
│   │   ├── service.types.ts
│   │   ├── shard.types.ts
│   │   └── tenant.types.ts
│   ├── eo
│   │   ├── audit.types.ts
│   │   ├── auth.types.ts
│   │   ├── avatar.types.ts
│   │   ├── index.ts
│   │   ├── otp.types.ts
│   │   └── r2.types.ts
│   └── index.ts
├── tsconfig.json
└── tsup.config.mjs
```

## 🛠️ Development Setup

1. Install Node.js (v18+ recommended)
2. Install dependencies: `npm install`
3. Build: `npm run build`

## 🧪 Testing

This project currently exports pure types — no runtime tests required.

## 👥 Contributors

<p align="left">
<a href="https://github.com/arsalanwahab" title="arsalanwahab"><img src="https://avatars.githubusercontent.com/u/178069156?v=4&s=64" width="64" height="64" alt="arsalanwahab" style="border-radius:50%" /></a>
</p>

[See the full list of contributors →](https://github.com/mykopk/types/graphs/contributors)

## 👥 Contributing

Contributions are welcome! Here's the standard flow:

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/mykopk/types.git`
3. **Branch**: `git checkout -b feature/your-feature`
4. **Commit**: `git commit -m 'feat: add some feature'`
5. **Push**: `git push origin feature/your-feature`
6. **Open** a pull request

Please follow the existing code style and include types for new behavior where applicable.

## 📜 License

This project is licensed under the **MIT** License.

---
Company

MYKO Pakistan

Detail	Information
Website	myko.pk
Email	support@myko.pk
About	Building digital infrastructure and super-app experiences for millions of users across Pakistan.
Built with ❤️ in Pakistan 🇵🇰
