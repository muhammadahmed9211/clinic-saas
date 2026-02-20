# Database migrations: baseline and workflow

This document describes how to treat the **current actual database as the baseline** and move to a **migration-only** schema workflow. Migrations are managed **only in crm-rest-api**; microservices and cron/batch services use the same DB and do not run migrations.

---

## Table of contents

- [Current state and goal](#current-state-and-goal)
- [One-time baseline (current DB as source of truth)](#one-time-baseline-current-db-as-source-of-truth)
- [After baseline: ongoing workflow](#after-baseline-ongoing-workflow)
- [Deployment](#deployment)
- [Microservices and shared DB](#microservices-and-shared-db)
- [Checklist](#checklist)

---

## Current state and goal

- **Current:** ORM migration feature exists but is not in sync; manual SQL scripts are applied for releases.
- **Goal:** Use TypeORM migrations as the single way to change schema. Current DB = baseline; all future changes go through migrations in crm-rest-api only.

---

## One-time baseline (current DB as source of truth)

Use this **once per environment** (e.g. production, staging) where the database already has the real schema (from manual scripts or past partial migrations). You want TypeORM to **mark all existing migration files as already executed** without running their SQL.

### Prerequisites

1. **Back up the database** for that environment.
2. **Confirm `DATABASE_SYNCHRONIZE` is `false`** in `.env` (and in all envs). Schema must not be changed by `synchronize`, only by migrations.
3. **Point env at the target DB** (the one that represents “current actual” schema).

### Steps

1. **Ensure the migrations table exists**  
   TypeORM creates the `migrations` table on the first `migration:run`. If this DB has never had migrations run, the first command below will create the table; the second will mark all migrations as run without executing them.

2. **Mark all current migrations as already run (fake run)**  
   From `crm-rest-api` root:

   ```bash
   npm run migration:run:fake
   ```

   This:

   - Creates the `migrations` table if it does not exist.
   - Inserts one row per **pending** migration file (by timestamp order) **without** executing their `up()` SQL.

   So the current DB is unchanged; TypeORM now considers all those migrations “already applied.”

3. **Verify**  
   - Check the DB: table `migrations` (or your configured name) should have one row per migration file.
   - On the next deploy, `npm run migration:run` should report that there are no pending migrations (until you add new ones).

### If the migrations table already has some rows

- `migration:run:fake` only inserts rows for migrations that are **not** already in the table. So you can run it on a DB that already ran some migrations: it will “fake” only the remaining ones.  
- If the DB was built entirely from manual scripts and **no** TypeORM migrations were ever run, the table may be missing; the fake run will create it and insert all migration names.

### Important

- Run **baseline (fake)** only on DBs that already have the correct schema. Do not use it to “fix” a DB that is missing tables or columns; fix the schema first (manual or one-off script), then baseline.
- After baselining, **do not** run manual schema scripts for new changes; use [migrations only](#after-baseline-ongoing-workflow).

---

## After baseline: ongoing workflow

All schema changes go through TypeORM migrations in **crm-rest-api** only.

### Option A: Generate from entity changes

1. Change or add entities in `crm-rest-api` (e.g. new column, new table).
2. Generate a migration:

   ```bash
   npm run migration:generate -- src/database/migrations/DescriptiveName
   ```

3. Review the generated file under `src/database/migrations/`. Adjust SQL if needed (e.g. data backfill, renames).
4. Run locally (against local DB):

   ```bash
   npm run migration:run
   ```

5. Commit the new migration file and deploy. On deploy, [run migrations](#deployment) so the same migration runs in staging/production.

### Option B: Custom SQL migration

1. Create an empty migration:

   ```bash
   npm run migration:create -- src/database/migrations/DescriptiveName
   ```

2. Edit the new file: implement `up()` and `down()` with raw SQL (e.g. `queryRunner.query(...)`).
3. Run and commit as in steps 4–5 above.

### Revert (use with care)

To undo the last executed migration (only if safe for your data):

```bash
npm run migration:revert
```

To **record** a revert without running the migration’s `down()` (e.g. you reverted manually):

```bash
npm run typeorm -- --dataSource=src/database/data-source.ts migration:revert --fake
```

---

## Deployment

- **Who runs migrations:** Only **crm-rest-api**. No other app (microservices, cron, batch) should run `migration:run`.
- **When:** Run migrations **before** starting or restarting the crm-rest-api process (e.g. in your deploy script or PM2 startup).
- **How:** From the crm-rest-api root, with env pointing at the target DB:

  ```bash
  npm run migration:run
  ```

- **Order:** Run migrations first, then start the API. This way new code that expects new columns/tables only runs after the schema is updated.

Example (conceptual) in a deploy script:

```bash
cd crm-rest-api
npm run migration:run
npm run start:prod
```

---

## Microservices and shared DB

- **crm-rest-api** is the **single owner** of schema: it holds migration files and runs `migration:run` / `migration:run:fake`.
- **Microservices** (e.g. crm-mail-microservice, crm-mt5-manager-microservice, crm-cron-microservice, etc.) and **batch/cron** jobs use the **same** database; they do **not** run migrations and do **not** need a copy of the migration folder.
- All services must use the same DB URL and expect the schema produced by crm-rest-api migrations. When you add a new table or column, deploy crm-rest-api (including `migration:run`) first, then deploy any service that depends on the new schema.
- **Schema awareness:** Tables that exist only in the DB and are used by other services (e.g. chat, notification-orchestrator tables) are mirrored as **schema-only entities** in `src/database/microservices-entities/`. That way `schema:log` and `migration:generate` do not suggest dropping those tables. See that folder’s README for the list and how to add new ones.
- **Schema awareness:** Tables that exist only in the DB and are used by other services (e.g. chat, notification-orchestrator tables) are mirrored as **schema-only entities** in `src/database/microservices-entities/`. That way `schema:log` and `migration:generate` do not suggest dropping those tables. See that folder’s README for the list and how to add new ones.

---

## Checklist

**One-time (per environment):**

- [ ] DB backed up.
- [ ] `DATABASE_SYNCHRONIZE=false` in that environment.
- [ ] `npm run migration:run:fake` run against the target DB.
- [ ] Verified `migrations` table has rows for all existing migration files.
- [ ] `npm run migration:run` reports no pending migrations.

**Ongoing:**

- [ ] No manual SQL scripts for schema changes; all changes via migrations in crm-rest-api.
- [ ] Deploy runs `npm run migration:run` before starting crm-rest-api.
- [ ] Microservices and cron/batch only use the DB; they do not run migrations.

**Scripts reference:**

| Script | Purpose |
|--------|--------|
| `npm run migration:run` | Apply pending migrations (use on every deploy). |
| `npm run migration:run:fake` | One-time baseline: mark all current migrations as run without executing SQL. |
| `npm run migration:generate -- src/database/migrations/Name` | Generate migration from entity diff. |
| `npm run migration:create -- src/database/migrations/Name` | Create empty migration for custom SQL. |
| `npm run migration:revert` | Revert last executed migration. |

Previous: [Database (overview)](database.md)
