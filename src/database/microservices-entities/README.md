# Microservices entities (schema-only)

This folder contains **TypeORM entity definitions for tables that exist in the shared CRM database and are used by other services** (crm-cron-microservice, crm-notification-orchestrator-microservice, etc.) but are not used by crm-rest-api.

**Purpose:**  
So that `schema:log` and `migration:generate` treat the full DB schema as known. Without these entities, TypeORM would suggest `DROP TABLE` / `DROP COLUMN` for these tables when comparing code to the database.

**Usage:**
- These entities are **included in the global entity glob** (`src/**/*.entity{.ts,.js}`), so they are loaded by the DataSource and by TypeORM CLI.
- Do **not** use them in rest-api business logic or modules; they are for schema awareness only.
- When a microservice adds or changes a table in the shared DB, add or update the corresponding entity here (or add a migration in crm-rest-api and keep this entity in sync).

**Source:**  
Entities are mirrored from:
- **crm-cron-microservice:** chat_room, chat_message, chat_room_participents
- **crm-notification-orchestrator-microservice:** user_channel_preferences, notification_templates, notification_logs, mobile_devices, event_channel_mappings

**Note:** admin_task, ticket_replies, user, lead, etc. already exist in rest-api; they are not duplicated here.
