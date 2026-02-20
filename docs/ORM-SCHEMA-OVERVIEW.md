# CRM REST API – ORM schema overview

Entities are loaded from `src/**/*.entity{.ts,.js}`. TypeORM uses the **class name** as the table name when `@Entity()` has no argument (e.g. `User` → `user`). Some entities set the name explicitly, e.g. `@Entity('file')`.

---

## 1. Core entities and table names

### Users and clients

| Entity class   | Typical table  | Notes |
|----------------|----------------|--------|
| `User`         | `user`         | Main user (id, email, roleId, statusId, operatorId, etc.) |
| `Client`       | `client`       | Client profile; `userId` → user.id, `leadId` → lead.id |
| `user_verification` | (same)   | User verification |
| `user_kyc_answers`  | (same)   | KYC answers |
| `reset_password`    | `reset_password` | Password reset |
| `Otp`          | `otp`          | OTPs |
| `data_upload`  | (same)         | Data uploads |

### Leads and related (child tables first for deletes)

| Entity class   | Typical table  | FK / relationship |
|----------------|----------------|--------------------|
| `LeadAnswer`   | `lead_answer`  | leadId → Lead |
| `LeadsCallLog` | `leads_call_log` | leadId → Lead |
| `attachments`  | `attachments` | leadId → Lead; opportunityId, meetingId, attachedBy, fileId |
| `AdminTask`    | `admin_task`  | leadId → Lead; client; assignTo/createdBy/contact → User |
| `notes` (kycNotes) | (kyc notes table) | lead_id → Lead |
| `Lead`         | `lead`        | clientID → Client; createdByOperator → Operator |
| `Meetings`     | `meetings`    | Lead/participants |
| `Participants`  | `participants` | meeting |
| `Opportunity`  | `opportunity` | Lead-related |
| `Funnel`       | `funnel`      | Opportunity |
| `FunnelHistory`| `funnel_history` | Funnel |
| `LeadQuestion` (Question) | `question` | createdBy → User |

### Clients and related (child tables)

- `Client` has `userId` → User, `leadId` → Lead, `walletId` → Wallet.
- Child-like or linked: wallets, mt5_account, bank_detail, user_kyc_documents, leverage_request, admin_task, notes, ib_commission_deals, etc.

### Transactions and related (child tables first)

| Entity class       | Typical table   | FK / relationship |
|--------------------|-----------------|--------------------|
| `TransactionReceipt` | `transaction_receipt` | transaction |
| `TransactionEvents`  | `transaction_events` | transaction |
| `WithdrawRequest`    | `withdraw_request` | user → User; wallet; bankDetail |
| `Transaction`       | `transaction`   | user → User; wallet; mt5Account; withdrawRequest; method; psp; etc. |

Other transaction-related: `TransactionMethod`, `Exchange`, `UserEWallet`, `UserCreditCard`, `BankDetail`, `BankAccount`, `PSP`, `FileEntity` (evidence).

### Wallets and ledger (depend on User)

| Entity class | Typical table | FK |
|--------------|---------------|-----|
| `Wallet`     | `wallet`      | user → User |
| `Ledger`     | `ledger`      | wallet |
| `Server`     | `server`      | (wallet server) |

### Operators and related

| Entity class     | Typical table   | Notes |
|------------------|-----------------|--------|
| `Operator`       | `operator`      | id, email, user (OneToOne with User) |
| `OperatorDeskRel`| `operator_desk`  | operatorId → Operator |
| `operator_targets` | `operator_targets` | operator → Operator |
| `operators_links`  | (same)          | operator links |
| `User`           | `user`          | operatorId → Operator (User.operator) |

### User‑scoped (depend on User; delete before User)

- `Wallet`, `Ledger`
- `Mt5Account`, `Mt5Deals`, `FavouriteSymbol`
- `user_kyc_documents`, `LeverageRequest`, `FileEntity`, `notifications`
- `AdminTask` (createdBy, assignTo, contact)
- `notes` (user_id, partner_id, created_by, lead_id)
- `Layout`, `Template`
- `DeviceInfo`
- `Transaction` (user, actionBy, initiatedBy, salesRep, retentionRep, etc.)
- `WithdrawRequest` (user)
- `Session`, `OperatorSession`
- `IbCommissionDeals`, `IbLink`
- And other entities that reference `User`.

---

## 2. Suggested delete order (to avoid FK errors)

Delete in this order (children before parents):

1. **Transaction children**  
   `transaction_receipt`, `transaction_events`, then `transaction`. Then `withdraw_request` if not referenced elsewhere.

2. **Lead children**  
   `lead_answer`, `leads_call_log`, `attachments`, `participants`, `meetings`, opportunity/funnel/funnel_history, client (refs lead admin_task), `admin_task` (where `leadId` or `contactId` reference lead), `inbox_email` (leadId), `communication` (leadId), lead-related `notes`, then `lead`.

3. **Client‑related (before Client)**  
   Client-linked tasks, notes, wallets, mt5_account, bank_detail, user_kyc_documents, leverage_request, ib_commission_deals, etc., then `client`.

4. **User‑related (before User)**  
   All tables that reference `user.id` (wallets, sessions, notifications, tasks, transactions, files, kyc, etc.), then `user`.

5. **Operators**  
   After users: `operator_targets`, `operators_links`, `operator_desk`, then `operator`. Optionally keep selected operators by id/email.

---

## 3. Entity file locations (for reference)

- **Users/Clients:** `src/users/entities/` (user.entity.ts, client.entity.ts, …)
- **Leads:** `src/admin/leads/entities/` (lead.entity.ts, lead-answer.entity.ts), `opportunity/`, `meetings/`
- **Lead call logs:** `src/admin/leads-call-logs/entities/`
- **Transactions:** `src/transaction/entities/` (transaction.entity.ts, withdraw-request.entity.ts, …)
- **Wallets:** `src/wallet/entities/`
- **Operators:** `src/admin/custom-dropdown/custom-dropdown/entities/operator.entity.ts`, `src/admin/operator/entities/`
- **Tasks:** `src/admin/task/entities/task.entity.ts` (AdminTask)
- **KYC/notes:** `src/admin/kyc/entities/` (kycNotes.entity.ts, …)

---

## 4. Database type

Config uses `process.env.DATABASE_TYPE` / `configService.get('database.type')` (e.g. `mssql`, `postgres`). Table names may be lowercased or follow the DB convention; confirm with existing DB or `synchronize: true` / migrations.

---

## 5. Quick reference: key FKs

- **Lead** → Client (clientID), Operator (createdByOperator), Partner, Office, CustomStatus, Regulations.
- **Client** → User (userId), Lead (leadId), Wallet (walletId), Partner, CustomStatus, etc.
- **User** → Role, Status, FileEntity (photo), Operator, Partner.
- **Transaction** → User, Wallet, Mt5Account, WithdrawRequest, TransactionMethod, PSP, BankDetail, BankAccount, etc.
- **Operator** → User (OneToOne), Role, FileEntity (photo), Office, AdminTask, Lead, operator_targets.

Use this order and these relationships when writing cleanup scripts so child rows are removed before parents and you avoid constraint errors.

---

## 6. Database cleanup script

A script that deletes data from **transactional tables only** (master/reference data is never touched) lives at **`scripts/cleanup-database.ts`**.

### Tables whose data is deleted (transactional only)

| # | Table / scope |
|---|----------------|
| 1 | transaction_receipt |
| 2 | transaction_events |
| 3 | bonus_reward |
| 4 | ledger |
| 5 | notes (transactionId) |
| 6 | referral_reward_ledger (transactionId) |
| 7 | transaction |
| 8 | withdraw_request |
| 9 | lead_answer |
| 10 | notes (call_id) |
| 11 | leads_call_log |
| 12 | attachments |
| 13 | notes (lead_id) |
| 14 | participants |
| 15 | meetings |
| 16 | funnel_history |
| 17 | opportunity |
| 18 | client (refs admin_task; then UPDATE retained clients’ recentTaskId to null) |
| 19 | admin_task (all: WHERE 1=1) |
| 20 | client (refs lead; null leadId for retained, then delete rest) |
| 21 | inbox_email (leadId; batched) |
| 22 | communication (leadId; batched) |
| 23 | chat_room: UPDATE messagesId=null (break circular ref), then chat_message, chat_room_participents, chat_room |
| 24 | lead |
| 25 | wallet |
| 26 | session |
| 27 | notification |
| 28 | user_kyc_documents |
| 29 | mt5_account |
| 30 | leverage_request |
| 31 | reset_password |
| 32 | favourite_symbol |
| 33 | device_info |
| 34 | notes (user_id) |
| 35 | client |
| 36 | user |
| 37 | operator_targets |
| 38 | operators_links |
| 39 | operator_desk |
| 40 | operator |

**Master data (never deleted):** role, status, partner, regulations, question (lead questions), transaction_method, psp, exchange, server, office, custom_status, desk, funnel, and other reference/configuration tables.

**Retained users/operators:** Only those in env (`RETAIN_USER_IDS`, `RETAIN_USER_EMAILS`, `RETAIN_OPERATOR_IDS`, `RETAIN_OPERATOR_EMAILS`). No separate client or lead retention; only these users (and their child records) and operators are kept. If no user ids/emails are set, user id `1` is kept as a safety default.

**Phase 0 (first priority):** The script truncates all tables that are not referenced by any other table: `transaction_receipt`, `transaction_events`, `ledger`, `meeting_participants`, `funnel_history`. Then it uses `DELETE` (and batched `DELETE` for large tables) for the rest. SQL Server does not allow `TRUNCATE` on a table that is referenced by a foreign key.

**Progress:** Each step commits immediately. If the script fails, re-run it: already-empty steps are skipped; only remaining work runs.

**Run (from `crm-rest-api` root):**

```bash
npm run cleanup:db
```

**Options (env vars):**

| Env | Description |
|-----|-------------|
| `DRY_RUN=true` | Log what would be deleted; do not commit |
| `RETAIN_USER_IDS` | Comma-separated user ids to keep |
| `RETAIN_USER_EMAILS` | Comma-separated user emails to keep |
| `RETAIN_OPERATOR_IDS` | Comma-separated operator ids to keep |
| `RETAIN_OPERATOR_EMAILS` | Comma-separated operator emails to keep |
| `SKIP_OPERATOR_CLEANUP=true` | Do not delete any operator data (treat operators as master) |

**Examples:**

```bash
# Preview only
DRY_RUN=true npm run cleanup:db

# Keep one user and one operator by email
RETAIN_USER_EMAILS=admin@example.com RETAIN_OPERATOR_EMAILS=op@example.com npm run cleanup:db

# Do not delete operator data (master data)
SKIP_OPERATOR_CLEANUP=true npm run cleanup:db
```

The script uses the same DB config as the app (e.g. `.env` or `env-cmd`).
