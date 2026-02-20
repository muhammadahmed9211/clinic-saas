/**
 * Database cleanup script: deletes data from TRANSACTIONAL tables only.
 * Master/reference data (roles, statuses, partners, regulations, transaction_method,
 * psp, question, server, office, etc.) is never touched.
 * Uses two UPDATEs: client.recentTaskId = NULL and client.leadId = NULL for retained users so we can delete all admin_task and then lead.
 *
 * Why DELETE (and batched DELETE) instead of TRUNCATE?
 * - SQL Server does not allow TRUNCATE on a table that is referenced by a foreign key (even if
 *   the referencing table is empty). Most of our tables are in a FK graph (referenced by others),
 *   so we must use DELETE. We use batched DELETE for large tables to avoid request timeouts.
 * - First priority: TRUNCATE all tables that are not referenced by any other table (see
 *   TRUNCATE_FIRST below). Then DELETE (and batched DELETE) for the rest.
 *
 * Usage (from crm-rest-api root):
 *   npm run cleanup:db
 *   DRY_RUN=true npm run cleanup:db
 *
 * Retained: only users/operators listed in env (RETAIN_USER_IDS, RETAIN_USER_EMAILS,
 * RETAIN_OPERATOR_IDS, RETAIN_OPERATOR_EMAILS). No client or lead retention; only these
 * users and their child records are kept. If no user ids/emails given, user id 1 is kept as safety.
 *
 * Progress: Each successful step is committed immediately (no single big transaction).
 * If the script fails, re-run it: steps that are already empty are skipped; only remaining work is run.
 *
 * Auto-fix: On REFERENCE constraint error, the script nulls the conflicting table.column and retries the step.
 * Optional steps (e.g. chat_room_participents): if the table/column does not exist, the step is skipped.
 *
 * Env:
 *   DRY_RUN=true              - log what would be deleted, do not commit
 *   RETAIN_USER_IDS=1,2,3      - extra user ids to keep (comma-separated)
 *   RETAIN_USER_EMAILS=a@b.com - extra user emails to keep (comma-separated)
 *   RETAIN_OPERATOR_IDS=1,2    - operator ids to keep
 *   RETAIN_OPERATOR_EMAILS=op@b.com - operator emails to keep (comma-separated)
 *   SKIP_OPERATOR_CLEANUP=true - do not delete any operator data (treat as master)
 *   CLEANUP_BATCH_SIZE=5000 - rows per batch for large tables (default 5000, avoids timeout)
 *   DATABASE_REQUEST_TIMEOUT=120000 - for mssql, request timeout in ms (avoids operator delete timeout; set in .env)
 */

import 'reflect-metadata';
import { AppDataSource } from '../src/database/data-source';

const DRY_RUN = process.env.DRY_RUN === 'true' || process.env.DRY_RUN === '1';
const SKIP_OPERATOR_CLEANUP =
  process.env.SKIP_OPERATOR_CLEANUP === 'true' ||
  process.env.SKIP_OPERATOR_CLEANUP === '1';
const CLEANUP_BATCH_SIZE = parseInt(
  process.env.CLEANUP_BATCH_SIZE || '5000',
  10,
);

/**
 * Tables that are not referenced by any other table (no incoming FK). Truncated first for speed.
 * Entity name -> label for logging.
 */
const TRUNCATE_FIRST: { entity: string; label: string }[] = [
  { entity: 'TransactionReceipt', label: 'transaction_receipt' },
  { entity: 'TransactionEvents', label: 'transaction_events' },
  { entity: 'Ledger', label: 'ledger' },
  { entity: 'MeetingParticipants', label: 'meeting_participants' },
  { entity: 'FunnelHistory', label: 'funnel_history' },
];

/**
 * List of transactional tables from which data is deleted (in dependency order).
 * Master data tables (role, status, partner, regulations, question, transaction_method,
 * psp, exchange, server, office, custom_status, etc.) are never deleted.
 */
const TRANSACTIONAL_TABLES_DELETED = [
  'transaction_receipt',
  'transaction_events',
  'bonus_reward',
  'ledger',
  'notes (transactionId)',
  'referral_reward_ledger (transactionId)',
  'transaction',
  'withdraw_request',
  'lead_answer',
  'notes (call_id)',
  'leads_call_log',
  'attachments',
  'notes (lead_id)',
  'participants',
  'meetings',
  'funnel_history',
  'opportunity',
  'client (refs admin_task)',
  'admin_task',
  'client (refs lead)',
  'inbox_email (leadId)',
  'communication (leadId)',
  'chat_message (roomId → chat_room)',
  'chat_room_participents (roomId → chat_room)',
  'chat_room (chatUserId → lead)',
  'lead',
  'wallet',
  'session',
  'notification',
  'user_kyc_documents',
  'mt5_account',
  'leverage_request',
  'reset_password',
  'device_info',
  'notes (user_id)',
  'client',
  'user',
  'operator_targets',
  'operator_desk',
  'operator',
] as const;

function parseList(envKey: string): string[] {
  const raw = process.env[envKey];
  if (!raw || typeof raw !== 'string') return [];
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function quoteTable(name: string, driver: string): string {
  if (driver === 'mssql') return `[${name}]`;
  return `"${name}"`;
}

/** True if error means table/column is missing (step can be skipped in this DB). */
function isSkipOptionalError(err: unknown): boolean {
  const e = err as Error & { number?: number; driverError?: { number?: number }; originalError?: { number?: number } };
  const msg = String(e?.message ?? '');
  const code = e?.number ?? e?.driverError?.number ?? e?.originalError?.number;
  return (
    code === 208 ||
    msg.includes('Invalid object name') ||
    msg.includes('Invalid column name') ||
    msg.includes('Invalid column')
  );
}

/** Parse REFERENCE constraint error for table and column to null. Returns null if not parseable. */
function parseRefConstraint(err: unknown): { table: string; column: string } | null {
  const msg = String((err as Error)?.message ?? '');
  if (!msg.includes('REFERENCE constraint')) return null;
  // e.g. table "dbo.client", column 'leadId' or table "dbo.user-e-wallet", column 'userId'
  const m = msg.match(/table\s+"dbo\.([^"]+)".*?column\s+'([^']+)'/i);
  if (!m) return null;
  return { table: m[1], column: m[2] };
}

async function runCleanup() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const driver = AppDataSource.driver.options.type as string;
  const q = AppDataSource.createQueryRunner();
  const quote = (t: string) => quoteTable(t, driver);

  const retainUserIds = parseList('RETAIN_USER_IDS')
    .map((s) => parseInt(s, 10))
    .filter((n) => !Number.isNaN(n));
  const retainUserEmails = parseList('RETAIN_USER_EMAILS');
  const retainOperatorIds = parseList('RETAIN_OPERATOR_IDS')
    .map((s) => parseInt(s, 10))
    .filter((n) => !Number.isNaN(n));
  const retainOperatorEmails = parseList('RETAIN_OPERATOR_EMAILS');

  const runDelete = async (sql: string, label: string): Promise<void> => {
    const countSql = sql.replace(
      /^\s*DELETE\s+FROM\s+/i,
      'SELECT COUNT(*) AS cnt FROM ',
    );
    try {
      const countResult = await q.query(countSql);
      const row = Array.isArray(countResult) ? countResult[0] : countResult;
      const cnt = row?.cnt ?? (row as { cnt?: number })?.cnt ?? 0;
      if (DRY_RUN) {
        console.log(`[DRY RUN] Would delete ${cnt} rows: ${label}`);
        return;
      }
      if (cnt === 0) {
        console.log(`Skip (already empty): ${label}`);
        return;
      }
    } catch (err) {
      if (DRY_RUN)
        console.log(
          `[DRY RUN] Would run: ${label} (count failed: ${
            (err as Error).message
          })`,
        );
      else throw err;
      return;
    }
    const maxRefFix = 50;
    for (let attempt = 0; attempt <= maxRefFix; attempt++) {
      try {
        await q.query(sql);
        console.log(`Done: ${label}`);
        return;
      } catch (err) {
        const parsed = parseRefConstraint(err);
        if (parsed && !DRY_RUN && attempt < maxRefFix) {
          const quotedTable = quote(parsed.table);
          const quotedCol = driver === 'mssql' ? `[${parsed.column}]` : `"${parsed.column}"`;
          console.log(
            `  Auto-fix (${attempt + 1}): clear ${parsed.table}.${parsed.column} (REFERENCE constraint), retrying...`,
          );
          try {
            await q.query(
              `UPDATE ${quotedTable} SET ${quotedCol} = NULL WHERE ${quotedCol} IS NOT NULL`,
            );
          } catch (updateErr: unknown) {
            const code = (updateErr as { number?: number })?.number ?? (updateErr as { driverError?: { number?: number } })?.driverError?.number;
            const msg = String((updateErr as Error)?.message ?? '');
            if (code === 2627 || code === 515 || msg.includes('does not allow null')) {
              console.log(
                `  Auto-fix: cannot null ${parsed.table}.${parsed.column}, DELETE referencing rows instead`,
              );
              await q.query(
                `DELETE FROM ${quotedTable} WHERE ${quotedCol} IS NOT NULL`,
              );
            } else {
              throw updateErr;
            }
          }
        } else {
          throw err;
        }
      }
    }
  };

  /** Run UPDATE; skip step if table/column does not exist (207/208). */
  const runUpdateOptional = async (sql: string, label: string): Promise<void> => {
    try {
      await q.query(sql);
      console.log(`Done: ${label}`);
    } catch (err) {
      if (isSkipOptionalError(err)) {
        console.log(`Skip (table/column not present): ${label}`);
        return;
      }
      throw err;
    }
  };

  /** Like runDelete but skips step if table/column does not exist (e.g. optional microservice table). */
  const runDeleteOptional = async (sql: string, label: string): Promise<void> => {
    const countSql = sql.replace(
      /^\s*DELETE\s+FROM\s+/i,
      'SELECT COUNT(*) AS cnt FROM ',
    );
    try {
      const countResult = await q.query(countSql);
      const row = Array.isArray(countResult) ? countResult[0] : countResult;
      const cnt = row?.cnt ?? (row as { cnt?: number })?.cnt ?? 0;
      if (DRY_RUN) {
        console.log(`[DRY RUN] Would delete ${cnt} rows: ${label}`);
        return;
      }
      if (cnt === 0) {
        console.log(`Skip (already empty): ${label}`);
        return;
      }
    } catch (err) {
      if (isSkipOptionalError(err)) {
        console.log(`Skip (table/column not present): ${label}`);
        return;
      }
      if (DRY_RUN)
        console.log(
          `[DRY RUN] Would run: ${label} (count failed: ${(err as Error).message})`,
        );
      else throw err;
      return;
    }
    const maxRefFix = 50;
    for (let attempt = 0; attempt <= maxRefFix; attempt++) {
      try {
        await q.query(sql);
        console.log(`Done: ${label}`);
        return;
      } catch (err) {
        if (isSkipOptionalError(err)) {
          console.log(`Skip (table/column not present): ${label}`);
          return;
        }
        const parsed = parseRefConstraint(err);
        if (parsed && !DRY_RUN && attempt < maxRefFix) {
          const quotedTable = quote(parsed.table);
          const quotedCol = driver === 'mssql' ? `[${parsed.column}]` : `"${parsed.column}"`;
          console.log(
            `  Auto-fix (${attempt + 1}): clear ${parsed.table}.${parsed.column}, retrying...`,
          );
          try {
            await q.query(
              `UPDATE ${quotedTable} SET ${quotedCol} = NULL WHERE ${quotedCol} IS NOT NULL`,
            );
          } catch (updateErr: unknown) {
            const code = (updateErr as { number?: number })?.number ?? (updateErr as { driverError?: { number?: number } })?.driverError?.number;
            const msg = String((updateErr as Error)?.message ?? '');
            if (code === 2627 || code === 515 || msg.includes('does not allow null')) {
              console.log(
                `  Auto-fix: cannot null ${parsed.table}.${parsed.column}, DELETE referencing rows instead`,
              );
              await q.query(
                `DELETE FROM ${quotedTable} WHERE ${quotedCol} IS NOT NULL`,
              );
            } else {
              throw updateErr;
            }
          }
        } else {
          throw err;
        }
      }
    }
  };

  try {
    console.log(
      'Transactional tables from which data will be deleted (master data is never touched):',
    );
    TRANSACTIONAL_TABLES_DELETED.forEach((name, i) =>
      console.log(`  ${i + 1}. ${name}`),
    );
    if (SKIP_OPERATOR_CLEANUP)
      console.log(
        '  (operator_* tables will be SKIPPED; set SKIP_OPERATOR_CLEANUP=false to include)',
      );
    console.log('');

    if (DRY_RUN)
      console.log('--- DRY RUN (no changes will be committed) ---\n');

    await q.connect();
    // No single transaction: each query commits immediately so progress is saved. Re-run skips already-empty steps.

    // Table names from TypeORM metadata (needed early for retain-ID lookups and truncate)
    const getTable = (entityName: string): string => {
      const meta = AppDataSource.entityMetadatas.find(
        (m) => (m.target as { name?: string })?.name === entityName,
      );
      return meta?.tableName ?? entityName;
    };
    const t = (name: string) => quote(getTable(name));

    // TRUNCATE for tables that are not referenced by any FK (fast, no batching). Fails if table is referenced.
    const runTruncate = async (entityName: string, label: string): Promise<void> => {
      const tableName = getTable(entityName);
      const quoted = quote(tableName);
      try {
        const countResult = await q.query(
          `SELECT COUNT(*) AS cnt FROM ${quoted}`,
        );
        const row = Array.isArray(countResult) ? countResult[0] : countResult;
        const cnt = row?.cnt ?? (row as { cnt?: number })?.cnt ?? 0;
        if (DRY_RUN) {
          console.log(`[DRY RUN] Would truncate ${cnt} rows: ${label}`);
          return;
        }
        if (cnt === 0) {
          console.log(`Skip (already empty): ${label}`);
          return;
        }
      } catch (err) {
        if (DRY_RUN) {
          console.log(`[DRY RUN] Would truncate: ${label}`);
          return;
        }
        throw err;
      }
      const truncateSql =
        driver === 'mssql'
          ? `TRUNCATE TABLE ${quoted}`
          : `TRUNCATE TABLE ${quoted}`;
      await q.query(truncateSql);
      console.log(`Done: ${label}`);
    };

    // Batched delete for large tables to avoid request timeout (e.g. 15s default). Optional whereClause for partial deletes. Optional batchSizeOverride for slow tables (e.g. operator).
    const runDeleteBatched = async (
      tableEntityName: string,
      label: string,
      whereClause?: string,
      batchSizeOverride?: number,
    ): Promise<void> => {
      const tableName = getTable(tableEntityName);
      const quoted = quote(tableName);
      const where = whereClause ? ` WHERE ${whereClause}` : '';
      const batchSize = batchSizeOverride ?? CLEANUP_BATCH_SIZE;
      try {
        const countResult = await q.query(
          `SELECT COUNT(*) AS cnt FROM ${quoted}${where}`,
        );
        const row = Array.isArray(countResult) ? countResult[0] : countResult;
        const cnt = row?.cnt ?? (row as { cnt?: number })?.cnt ?? 0;
        if (DRY_RUN) {
          console.log(
            `[DRY RUN] Would delete ${cnt} rows (batched): ${label}`,
          );
          return;
        }
        if (cnt === 0) {
          console.log(`Skip (already empty): ${label}`);
          return;
        }
      } catch (err) {
        if (DRY_RUN) {
          console.log(`[DRY RUN] Would run (batched): ${label}`);
          return;
        }
        throw err;
      }
      const isMssql = driver === 'mssql';
      for (;;) {
        const batchSql = isMssql
          ? `DELETE TOP (${batchSize}) FROM ${quoted}${where}`
          : `DELETE FROM ${quoted} WHERE id IN (SELECT id FROM ${quoted}${where} LIMIT ${batchSize})`;
        await q.query(batchSql);
        const countResult = await q.query(
          `SELECT COUNT(*) AS cnt FROM ${quoted}${where}`,
        );
        const row = Array.isArray(countResult) ? countResult[0] : countResult;
        const remaining = row?.cnt ?? (row as { cnt?: number })?.cnt ?? 0;
        if (remaining === 0) break;
        console.log(`  ${label}: ${remaining} rows left`);
      }
      console.log(`Done: ${label}`);
    };

    // Resolve retained user IDs: only from env (RETAIN_USER_IDS, RETAIN_USER_EMAILS). No client/lead retention; only these users and their rows are kept.
    let retainedUserIds: number[] = [...retainUserIds];
    if (retainUserEmails.length > 0) {
      const inList = retainUserEmails
        .map((e) => `'${String(e).replace(/'/g, "''")}'`)
        .join(',');
      const rows = await q.query(
        `SELECT id FROM ${t('User')} WHERE email IN (${inList})`,
      );
      const ids = (Array.isArray(rows) ? rows : [])
        .map((r: { id: number }) => r.id)
        .filter(Boolean);
      retainedUserIds = [...new Set([...retainedUserIds, ...ids])];
    }
    if (retainedUserIds.length === 0) {
      retainedUserIds = [1]; // safety: avoid deleting every user if env is empty
    }
    retainedUserIds = [...new Set(retainedUserIds)].filter(
      (n) => typeof n === 'number' && !Number.isNaN(n),
    );
    console.log(
      'Retaining users (and their child records): id in [' +
        retainedUserIds.join(', ') +
        ']',
    );

    let retainedOperatorIds: number[] = [...retainOperatorIds];
    if (retainOperatorEmails.length > 0) {
      const inList = retainOperatorEmails
        .map((e) => `'${String(e).replace(/'/g, "''")}'`)
        .join(',');
      const rows = await q.query(
        `SELECT id FROM ${t('Operator')} WHERE email IN (${inList})`,
      );
      const ids = (Array.isArray(rows) ? rows : [])
        .map((r: { id: number }) => r.id)
        .filter(Boolean);
      retainedOperatorIds = [...new Set([...retainedOperatorIds, ...ids])];
    }

    const userNotIn =
      retainedUserIds.length > 0
        ? `NOT IN (${retainedUserIds.join(',')})`
        : 'IS NOT NULL';
    const operatorNotIn =
      retainedOperatorIds.length > 0
        ? `NOT IN (${retainedOperatorIds.join(',')})`
        : 'IS NOT NULL';

    // ----- 0. Truncate first (tables not referenced by any other) -----
    console.log('Phase 0: Truncate unreferenced tables (first priority)\n');
    for (const { entity, label } of TRUNCATE_FIRST) {
      await runTruncate(entity, label);
    }

    // ----- 1. Transaction-related (all) -----
    await runDelete(
      `DELETE FROM ${t('BonusReward')}`,
      'bonus_reward',
    );
    // Child tables that reference Transaction - delete before transaction (ledger already truncated)
    await runDelete(
      `DELETE FROM ${t('notes')} WHERE transactionId IS NOT NULL`,
      'notes (transactionId)',
    );
    await runDelete(
      `DELETE FROM ${t('ReferralRewardLedger')} WHERE transactionId IS NOT NULL`,
      'referral_reward_ledger (transactionId)',
    );
    await runDeleteBatched('Transaction', 'transaction');
    await runDeleteBatched('WithdrawRequest', 'withdraw_request');

    // ----- 2. Lead-related (all) -----
    // Lead children first (except admin_task; it is referenced by client.recentTaskId)
    await runDelete(`DELETE FROM ${t('LeadAnswer')}`, 'lead_answer');
    // Notes.call_id references LeadsCallLog; delete those notes before leads_call_log
    await runDelete(
      `DELETE FROM ${t('notes')} WHERE call_id IS NOT NULL`,
      'notes (call_id)',
    );
    await runDelete(`DELETE FROM ${t('LeadsCallLog')}`, 'leads_call_log');
    await runDelete(`DELETE FROM ${t('attachments')}`, 'attachments');
    await runDelete(
      `DELETE FROM ${t('notes')} WHERE lead_id IS NOT NULL`,
      'notes (lead_id)',
    );
    // participants + funnel_history already truncated in phase 0
    await runDelete(`DELETE FROM ${t('Meetings')}`, 'meetings');
    await runDelete(`DELETE FROM ${t('Opportunity')}`, 'opportunity');
    // Client.recentTaskId → AdminTask. To delete ALL admin_task (WHERE 1=1): clear retained clients' recentTaskId, then delete non-retained clients that reference any task, then delete all admin_task.
    if (!DRY_RUN && retainedUserIds.length > 0) {
      await q.query(
        `UPDATE ${t('Client')} SET recentTaskId = NULL WHERE recentTaskId IS NOT NULL AND userId IN (${retainedUserIds.join(',')})`,
      );
    }
    await runDelete(
      `DELETE FROM ${t('Client')} WHERE recentTaskId IS NOT NULL`,
      'client (refs admin_task)',
    );
    await runDelete(
      `DELETE FROM ${t('AdminTask')} WHERE 1=1`,
      'admin_task',
    );
    // Client.leadId → Lead. Must clear before we can DELETE FROM lead (same pattern as recentTaskId).
    if (!DRY_RUN && retainedUserIds.length > 0) {
      await q.query(
        `UPDATE ${t('Client')} SET leadId = NULL WHERE leadId IS NOT NULL AND userId IN (${retainedUserIds.join(',')})`,
      );
    }
    await runDelete(
      `DELETE FROM ${t('Client')} WHERE leadId IS NOT NULL`,
      'client (refs lead)',
    );
    // Other tables that reference Lead (must delete before lead)
    await runDeleteBatched(
      'InboxEmail',
      'inbox_email (leadId)',
      'leadId IS NOT NULL',
    );
    await runDeleteBatched(
      'Communication',
      'communication (leadId)',
      'leadId IS NOT NULL',
    );
    // Circular ref: chat_message.roomId → chat_room; chat_room may have messagesId → chat_message. Break ref then delete children then parent.
    const leadChatRoomSubquery = `SELECT id FROM ${t('ChatRoomMicroserviceEntity')} WHERE chatUserId IN (SELECT id FROM ${t('Lead')})`;
    if (!DRY_RUN) {
      try {
        await q.query(
          `UPDATE ${t('ChatRoomMicroserviceEntity')} SET messagesId = NULL WHERE chatUserId IN (SELECT id FROM ${t('Lead')})`,
        );
      } catch (err: unknown) {
        const msg = (err as Error)?.message ?? '';
        if (!msg.includes('messagesId') && !msg.includes('Invalid column')) throw err;
        // Column messagesId may not exist in all schemas; continue
      }
    }
    await runDelete(
      `DELETE FROM ${t('ChatMessageMicroserviceEntity')} WHERE roomId IN (${leadChatRoomSubquery})`,
      'chat_message (roomId → chat_room)',
    );
    await runDeleteOptional(
      `DELETE FROM ${t('ChatRoomParticipantsMicroserviceEntity')} WHERE roomId IN (${leadChatRoomSubquery})`,
      'chat_room_participents (roomId → chat_room)',
    );
    await runDelete(
      `DELETE FROM ${t('ChatRoomMicroserviceEntity')} WHERE chatUserId IN (SELECT id FROM ${t('Lead')})`,
      'chat_room (chatUserId → lead)',
    );
    await runDeleteBatched('Lead', 'lead');

    // ----- 3. User-scoped (only users we are deleting) -----
    const userWhere = `userId ${userNotIn}`;
    await runDelete(`DELETE FROM ${t('Wallet')} WHERE ${userWhere}`, 'wallet');
    await runDelete(
      `DELETE FROM ${t('Session')} WHERE ${userWhere}`,
      'session',
    );
    await runDelete(
      `DELETE FROM ${t('notifications')} WHERE user_id ${userNotIn}`,
      'notification',
    );
    await runDelete(
      `DELETE FROM ${t('user_kyc_documents')} WHERE userId ${userNotIn}`,
      'user_kyc_documents',
    );
    await runDelete(
      `DELETE FROM ${t('Mt5Account')} WHERE userId ${userNotIn}`,
      'mt5_account',
    );
    await runDelete(
      `DELETE FROM ${t('LeverageRequest')} WHERE userId ${userNotIn}`,
      'leverage_request',
    );
    await runDelete(
      `DELETE FROM ${t('ResetPassword')} WHERE userId ${userNotIn}`,
      'reset_password',
    );
    await runDelete(
      `DELETE FROM ${t('FavouriteSymbol')} WHERE userId ${userNotIn}`,
      'favourite_symbol',
    );
    await runDelete(
      `DELETE FROM ${t('DeviceInfo')} WHERE userId ${userNotIn}`,
      'device_info',
    );
    // admin_task and client (refs admin_task) already deleted in lead section
    await runDelete(
      `DELETE FROM ${t('notes')} WHERE user_id ${userNotIn}`,
      'notes (user_id)',
    );
    await runDelete(
      `DELETE FROM ${t('Client')} WHERE userId ${userNotIn}`,
      'client',
    );
    await runDelete(`DELETE FROM ${t('User')} WHERE id ${userNotIn}`, 'user');

    // ----- 4. Operator-related: clear dependents first (only rows referencing non-retained operators), then delete operator -----
    if (!SKIP_OPERATOR_CLEANUP) {
      // Delete/null rows that reference operators we are deleting, so operator DELETE does not block on FK checks.
      await runDeleteOptional(
        `DELETE FROM ${t('OperatorSession')} WHERE operatorId ${operatorNotIn}`,
        'operator_session',
      );
      await runUpdateOptional(
        `UPDATE ${t('User')} SET operatorId = NULL WHERE operatorId IS NOT NULL AND operatorId ${operatorNotIn}`,
        'user.operatorId',
      );
      await runUpdateOptional(
        `UPDATE ${t('Communication')} SET operatorId = NULL, updatedById = NULL WHERE (operatorId IS NOT NULL AND operatorId ${operatorNotIn}) OR (updatedById IS NOT NULL AND updatedById ${operatorNotIn})`,
        'communication.operatorId/updatedById',
      );
      await runUpdateOptional(
        `UPDATE ${t('Meetings')} SET hostId = NULL, createdById = NULL WHERE (hostId IS NOT NULL AND hostId ${operatorNotIn}) OR (createdById IS NOT NULL AND createdById ${operatorNotIn})`,
        'meetings.hostId/createdById',
      );
      await runUpdateOptional(
        `UPDATE ${t('Opportunity')} SET dealOwnerId = NULL WHERE dealOwnerId IS NOT NULL AND dealOwnerId ${operatorNotIn}`,
        'opportunity.dealOwnerId',
      );
      await runUpdateOptional(
        `UPDATE ${t('MasterTask')} SET createdById = NULL WHERE createdById IS NOT NULL AND createdById ${operatorNotIn}`,
        'master_task.createdById',
      );
      await runUpdateOptional(
        `UPDATE ${t('notifications')} SET creator_id = NULL WHERE creator_id IS NOT NULL AND creator_id ${operatorNotIn}`,
        'notifications.creator_id',
      );
      await runUpdateOptional(
        `UPDATE ${t('Desk')} SET managerId = NULL, coordinatorId = NULL WHERE (managerId IS NOT NULL AND managerId ${operatorNotIn}) OR (coordinatorId IS NOT NULL AND coordinatorId ${operatorNotIn})`,
        'desk.managerId/coordinatorId',
      );
      await runUpdateOptional(
        `UPDATE ${t('Office')} SET manager = NULL WHERE manager IS NOT NULL AND manager ${operatorNotIn}`,
        'office.manager',
      );
      await runUpdateOptional(
        `UPDATE ${t('Partner')} SET referrerId = NULL, operatorId = NULL, managerOperatorId = NULL WHERE (referrerId IS NOT NULL AND referrerId ${operatorNotIn}) OR (operatorId IS NOT NULL AND operatorId ${operatorNotIn}) OR (managerOperatorId IS NOT NULL AND managerOperatorId ${operatorNotIn})`,
        'partner.referrerId/operatorId/managerOperatorId',
      );
      await runUpdateOptional(
        `UPDATE ${t('Mt5Deal')} SET SalesRepId = NULL, SalesManagerId = NULL, RetentionRepId = NULL, RetentionManagerId = NULL WHERE (SalesRepId IS NOT NULL AND SalesRepId ${operatorNotIn}) OR (SalesManagerId IS NOT NULL AND SalesManagerId ${operatorNotIn}) OR (RetentionRepId IS NOT NULL AND RetentionRepId ${operatorNotIn}) OR (RetentionManagerId IS NOT NULL AND RetentionManagerId ${operatorNotIn})`,
        'mt5_deals.operator refs',
      );
      await runDeleteOptional(
        `DELETE FROM ${t('operator_targets')} WHERE operatorId ${operatorNotIn}`,
        'operator_targets',
      );
      await runDeleteOptional(
        `DELETE FROM ${t('OperatorDeskRel')} WHERE operator_id ${operatorNotIn}`,
        'operator_desk',
      );
      try {
        await runDeleteBatched('Operator', 'operator', `id ${operatorNotIn}`, 10);
      } catch (err: unknown) {
        const msg = (err as Error)?.message ?? '';
        const code = (err as { code?: string })?.code;
        if (code === 'ETIMEOUT' || msg.includes('Timeout') || msg.includes('ms')) {
          console.warn(
            'Operator delete timed out. Increase DATABASE_REQUEST_TIMEOUT (e.g. 300000) in .env or set SKIP_OPERATOR_CLEANUP=true to skip. Continuing.',
          );
        } else {
          throw err;
        }
      }
    }

    console.log('\nCleanup finished.');
  } catch (e) {
    console.error('Cleanup failed:', e);
    throw e;
  } finally {
    await q.release();
    if (AppDataSource.isInitialized) await AppDataSource.destroy();
  }
}

void runCleanup();
