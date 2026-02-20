import { MigrationInterface, QueryRunner } from 'typeorm';

export class StaticEntity1748344315909 implements MigrationInterface {
  name = 'StaticEntity1748344315909';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "FK_2d633d732624e35432d662c8ee8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP CONSTRAINT "FK_d3d217b2aba366f27d0ebc39017"`,
    );
    await queryRunner.query(
      `ALTER TABLE "psp_regulations" DROP CONSTRAINT "FK_psp_regulations_pspId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "psp_regulations" DROP CONSTRAINT "FK_psp_regulations_regulationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "psp" DROP CONSTRAINT "FK_400a43234e76d3191d3bad41a82"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_ef357911e4f9540518d4ac9022a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "FK_f80032c315b0bfe15e51a7ad950"`,
    );
    await queryRunner.query(`DROP INDEX "IX_client_isActive" ON "client"`);
    await queryRunner.query(
      `DROP INDEX "IDX_mt5_users_replicated_Timestamp" ON "mt5_users_replicated"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_ef357911e4f9540518d4ac9022" ON "transaction"`,
    );
    await queryRunner.query(
      `DROP INDEX "IX_transaction_userid_type_status" ON "transaction"`,
    );
    await queryRunner.query(
      `ALTER TABLE "layout" DROP CONSTRAINT "UQ_37ecd4d0113b028a4c59ffd9f43"`,
    );
    await queryRunner.query(
      `ALTER TABLE "regulations" DROP CONSTRAINT "DF_43fce467be11635418825e3a4ee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "regulations" DROP COLUMN "idwise_required"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" DROP CONSTRAINT "DF_62a1df31d06ee61301f9646ef5f"`,
    );
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "version"`);
    await queryRunner.query(
      `ALTER TABLE "mt5_account" DROP CONSTRAINT "DF_bac8986f29fee95c82d00ba51a1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_account" DROP COLUMN "isDefault"`,
    );
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "partnerLevel"`);
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "masterIbId"`);
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "ibPath"`);
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "commissionProfileId"`,
    );
    await queryRunner.query(`ALTER TABLE "psp" DROP COLUMN "exchangeId"`);
    await queryRunner.query(`ALTER TABLE "psp" DROP COLUMN "bankAccountId"`);
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "salesMangerId"`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "feeType"`);
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "accountType"`,
    );
    await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "ticketId"`);
    await queryRunner.query(
      `ALTER TABLE "operator" DROP CONSTRAINT "DF_d2ea986050388314a8f07c11ca8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" DROP COLUMN "leadReassignWeeklyCount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" DROP CONSTRAINT "DF_cb9edbb8ec1154104e615fb17b9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" DROP COLUMN "autoLeadReassign"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "fullName"`);
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_84fd8fc29aa2c99a88bba11158a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "isLongTokenEnabled"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_ae53f4233e16627d0fd93ea76e9"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isTicketUser"`);
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "subStep"`);
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "shortTitle"`);
    await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "fcmToken"`);
    await queryRunner.query(
      `ALTER TABLE "supported_crypto" DROP CONSTRAINT "DF_ddb310428f2c6279adff68d2055"`,
    );
    await queryRunner.query(
      `ALTER TABLE "supported_crypto" DROP COLUMN "channel"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crypto_network" DROP CONSTRAINT "DF_7f83432762ae239070c6d15b2c5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crypto_network" DROP COLUMN "channel"`,
    );
    await queryRunner.query(
      `ALTER TABLE "regulation_translations" DROP COLUMN "translationText"`,
    );
    await queryRunner.query(
      `ALTER TABLE "regulation_translations" ADD "translationText" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "regulations_countries" ALTER COLUMN "telephonePrefix" int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_event" DROP CONSTRAINT "UQ_c781b0846adac9d0f0c13850f0e"`,
    );
    await queryRunner.query(`ALTER TABLE "email_event" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "email_event" ADD "name" nvarchar(MAX) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_event" DROP COLUMN "description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_event" ADD "description" nvarchar(MAX)`,
    );
    await queryRunner.query(`ALTER TABLE "label" DROP COLUMN "key"`);
    await queryRunner.query(
      `ALTER TABLE "label" ADD "key" nvarchar(MAX) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "utmSource"`);
    await queryRunner.query(`ALTER TABLE "client" ADD "utmSource" text`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "utmMedium"`);
    await queryRunner.query(`ALTER TABLE "client" ADD "utmMedium" text`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "utmCampaign"`);
    await queryRunner.query(`ALTER TABLE "client" ADD "utmCampaign" text`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "utmContent"`);
    await queryRunner.query(`ALTER TABLE "client" ADD "utmContent" text`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "utmTerm"`);
    await queryRunner.query(`ALTER TABLE "client" ADD "utmTerm" text`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "DF_6796cc2df7a5503680c2c941909" DEFAULT 'New' FOR "systemStatus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_trading_groups" ALTER COLUMN "copyTradingGroupSw" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" DROP CONSTRAINT "DF_66563863432d20991aaf240cd9f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ADD CONSTRAINT "DF_66563863432d20991aaf240cd9f" DEFAULT (0) FOR "CurrencyDigits"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ALTER COLUMN "Balance" float(53) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" DROP CONSTRAINT "DF_9be6a6f41a7507c72e5d565d305"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ADD CONSTRAINT "DF_9be6a6f41a7507c72e5d565d305" DEFAULT (0.0) FOR "Balance"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ALTER COLUMN "Credit" float(53) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" DROP CONSTRAINT "DF_3c03fca5d3c5efea207e2701f18"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ADD CONSTRAINT "DF_3c03fca5d3c5efea207e2701f18" DEFAULT (0.0) FOR "Credit"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ALTER COLUMN "Margin" float(53) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" DROP CONSTRAINT "DF_c2b08011f2125f873486f5f73d2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ADD CONSTRAINT "DF_c2b08011f2125f873486f5f73d2" DEFAULT (0.0) FOR "Margin"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ALTER COLUMN "MarginFree" float(53) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" DROP CONSTRAINT "DF_8e66ca1906a7cb50baf776f4334"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ADD CONSTRAINT "DF_8e66ca1906a7cb50baf776f4334" DEFAULT (0.0) FOR "MarginFree"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ALTER COLUMN "MarginLevel" float(53) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" DROP CONSTRAINT "DF_f1ede20ae06ca2fb5a83dd6e1ab"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ADD CONSTRAINT "DF_f1ede20ae06ca2fb5a83dd6e1ab" DEFAULT (0.0) FOR "MarginLevel"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" DROP CONSTRAINT "DF_3b3c251c6c1814a8742d9b7194d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ADD CONSTRAINT "DF_3b3c251c6c1814a8742d9b7194d" DEFAULT (0) FOR "MarginLeverage"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ALTER COLUMN "MarginInitial" float(53) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" DROP CONSTRAINT "DF_1a97b1d1d64166ecf21664d33b3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ADD CONSTRAINT "DF_1a97b1d1d64166ecf21664d33b3" DEFAULT (0.0) FOR "MarginInitial"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ALTER COLUMN "MarginMaintenance" float(53) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" DROP CONSTRAINT "DF_cc56e1ec2f6df87fe28195dee4f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ADD CONSTRAINT "DF_cc56e1ec2f6df87fe28195dee4f" DEFAULT (0.0) FOR "MarginMaintenance"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ALTER COLUMN "Profit" float(53) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" DROP CONSTRAINT "DF_cffcd5ef3784e0e618f08ba3856"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ADD CONSTRAINT "DF_cffcd5ef3784e0e618f08ba3856" DEFAULT (0.0) FOR "Profit"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ALTER COLUMN "Storage" float(53) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" DROP CONSTRAINT "DF_dac687af0ddda181771601806dd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ADD CONSTRAINT "DF_dac687af0ddda181771601806dd" DEFAULT (0.0) FOR "Storage"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ALTER COLUMN "Floating" float(53) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" DROP CONSTRAINT "DF_fd37367904cc853c0109de6c82f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ADD CONSTRAINT "DF_fd37367904cc853c0109de6c82f" DEFAULT (0.0) FOR "Floating"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ALTER COLUMN "Equity" float(53) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" DROP CONSTRAINT "DF_d75ff72e058ffe573b1d6a50ea3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ADD CONSTRAINT "DF_d75ff72e058ffe573b1d6a50ea3" DEFAULT (0.0) FOR "Equity"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ALTER COLUMN "Assets" float(53) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" DROP CONSTRAINT "DF_0875d7dfc073e4152f54fcf8dcf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ADD CONSTRAINT "DF_0875d7dfc073e4152f54fcf8dcf" DEFAULT (0.0) FOR "Assets"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ALTER COLUMN "Liabilities" float(53) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" DROP CONSTRAINT "DF_35c7385f9385790cd25e794e9bc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ADD CONSTRAINT "DF_35c7385f9385790cd25e794e9bc" DEFAULT (0.0) FOR "Liabilities"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ALTER COLUMN "BlockedCommission" float(53) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" DROP CONSTRAINT "DF_0a89f36c95ce65f2b1401fc6ed0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ADD CONSTRAINT "DF_0a89f36c95ce65f2b1401fc6ed0" DEFAULT (0.0) FOR "BlockedCommission"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ALTER COLUMN "BlockedProfit" float(53) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" DROP CONSTRAINT "DF_b1bd2f79db3fe50e4235eedfd3f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ADD CONSTRAINT "DF_b1bd2f79db3fe50e4235eedfd3f" DEFAULT (0.0) FOR "BlockedProfit"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "DF_f0ac8d6063af6ca546abe77eaa4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "DF_f0ac8d6063af6ca546abe77eaa4" DEFAULT (0) FOR "Timestamp"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "DF_bbb620d883194bfd7e4ec1d23b9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "DF_bbb620d883194bfd7e4ec1d23b9" DEFAULT (0) FOR "CertSerialNumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "DF_9b2755c4d410ddea36296dfcb74"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "DF_9b2755c4d410ddea36296dfcb74" DEFAULT (0) FOR "Rights"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "DF_3f6518a6f2327a375c7b4fea615"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "DF_3f6518a6f2327a375c7b4fea615" DEFAULT (0) FOR "Language"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "DF_c162f172b74bb2cbd67db78fd35"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "DF_c162f172b74bb2cbd67db78fd35" DEFAULT (0) FOR "ClientID"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "DF_10f8ec05cb9f65c42d866fd113e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "DF_10f8ec05cb9f65c42d866fd113e" DEFAULT (0) FOR "Color"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "DF_4a477a022cf48610c176ec1d682"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "DF_4a477a022cf48610c176ec1d682" DEFAULT (0) FOR "Leverage"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "DF_56aeee7d665282692286257fcaa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "DF_56aeee7d665282692286257fcaa" DEFAULT (0) FOR "Agent"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ALTER COLUMN "LimitPositions" float(53) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "DF_656fa313d43aef70eeca6f31101"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "DF_656fa313d43aef70eeca6f31101" DEFAULT (0.0) FOR "LimitPositions"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "DF_fe48b25921f386371d4061bab40"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "DF_fe48b25921f386371d4061bab40" DEFAULT (0) FOR "LimitOrders"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "DF_f2dd974d0877f6891736f1bbbcc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "DF_f2dd974d0877f6891736f1bbbcc" DEFAULT (0) FOR "TimestampTrade"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ALTER COLUMN "Balance" float(53) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "DF_04bd4062fe5b330d445677ed169"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "DF_04bd4062fe5b330d445677ed169" DEFAULT (0.0) FOR "Balance"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ALTER COLUMN "Credit" float(53) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "DF_c751f97fb206cd3eba229e1c3cf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "DF_c751f97fb206cd3eba229e1c3cf" DEFAULT (0.0) FOR "Credit"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ALTER COLUMN "InterestRate" float(53) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "DF_6d1b38b4ccd7dfefbe8a3dd7941"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "DF_6d1b38b4ccd7dfefbe8a3dd7941" DEFAULT (0.0) FOR "InterestRate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ALTER COLUMN "CommissionDaily" float(53) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "DF_dd6d9fc4bf73141ccfdf36bc780"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "DF_dd6d9fc4bf73141ccfdf36bc780" DEFAULT (0.0) FOR "CommissionDaily"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ALTER COLUMN "CommissionMonthly" float(53) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "DF_5d84ac84b2c43e30a9fa37f99dc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "DF_5d84ac84b2c43e30a9fa37f99dc" DEFAULT (0.0) FOR "CommissionMonthly"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ALTER COLUMN "BalancePrevDay" float(53) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "DF_b904cb52346d2fe1a78b98ad3f3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "DF_b904cb52346d2fe1a78b98ad3f3" DEFAULT (0.0) FOR "BalancePrevDay"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ALTER COLUMN "BalancePrevMonth" float(53) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "DF_5d4be0c1f3715a986c4d494cc69"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "DF_5d4be0c1f3715a986c4d494cc69" DEFAULT (0.0) FOR "BalancePrevMonth"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ALTER COLUMN "EquityPrevDay" float(53) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "DF_06d9a2fdda00dba17d0cdb11b25"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "DF_06d9a2fdda00dba17d0cdb11b25" DEFAULT (0.0) FOR "EquityPrevDay"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ALTER COLUMN "EquityPrevMonth" float(53) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "DF_7462f11c9f4261b4b24c50b0621"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "DF_7462f11c9f4261b4b24c50b0621" DEFAULT (0.0) FOR "EquityPrevMonth"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "externalNote"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "externalNote" nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "indexName" varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "subIndexName" varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "clientID"`);
    await queryRunner.query(`ALTER TABLE "lead" ADD "clientID" int`);
    await queryRunner.query(
      `ALTER TABLE "lead" ADD CONSTRAINT "DF_e15c575e88ca360a93d292f75dc" DEFAULT 0 FOR "hasAttendedEvent"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ADD CONSTRAINT "DF_0fd2c9f2504fe5e1a7d64bc81c7" DEFAULT getdate() FOR "lastAttendedDate"`,
    );
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "latestNote"`);
    await queryRunner.query(
      `ALTER TABLE "lead" ADD "latestNote" nvarchar(MAX)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ADD CONSTRAINT "DF_017bc7b4f9b545d73503ff38f04" DEFAULT 'New' FOR "systemStatus"`,
    );
    await queryRunner.query(`ALTER TABLE "user_log" DROP COLUMN "parent_id"`);
    await queryRunner.query(
      `ALTER TABLE "user_log" ADD "parent_id" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_log" ALTER COLUMN "parent_type" int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "fresh_desk_logs" DROP COLUMN "payload_res"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fresh_desk_logs" ADD "payload_res" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_view_column" DROP CONSTRAINT "FK_2ea42332c68a28c1d8bbe632c32"`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_view_column" ALTER COLUMN "listColumnsMetaId" int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_views_filter" DROP CONSTRAINT "FK_450977fcfbe3dd2b0463d64ce81"`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_views_filter" ALTER COLUMN "userId" int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_columns_meta" DROP CONSTRAINT "FK_211d34eb69685efbb52b581f388"`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_columns_meta" ALTER COLUMN "listId" int NOT NULL`,
    );
      await queryRunner.query(
      `CREATE TABLE "static_data" ("id" int NOT NULL IDENTITY(1,1), "key" varchar(100) NOT NULL, "data" text, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_07bc04f08719d35ade80a6ec87e" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_0e0823ca3a8ab438e85930d2563" DEFAULT getdate(), "deletedAt" datetime2, CONSTRAINT "UQ_05ed4111f0a56bc1a541557ffe9" UNIQUE ("key"), CONSTRAINT "PK_839e38ec8f67372ed988c004fe9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "static_data" DROP CONSTRAINT "UQ_05ed4111f0a56bc1a541557ffe9"`,
    );
    await queryRunner.query(`ALTER TABLE "static_data" DROP COLUMN "key"`);
    await queryRunner.query(
      `ALTER TABLE "static_data" ADD "key" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "static_data" ADD CONSTRAINT "UQ_05ed4111f0a56bc1a541557ffe9" UNIQUE ("key")`,
    );
    await queryRunner.query(
      `ALTER TABLE "static_data" ALTER COLUMN "data" text NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_mt5_users_replicated_replicated_Timestamp" ON "mt5_users_replicated" ("Timestamp") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9e992e170123100485d44ecc33" ON "transaction" ("salesManagerId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "email_event" ADD CONSTRAINT "UQ_c781b0846adac9d0f0c13850f0e" UNIQUE ("name", "deletedAt")`,
    );
    await queryRunner.query(
      `ALTER TABLE "label_translation" ADD CONSTRAINT "UQ_51154f54eee95db38c99d168564" UNIQUE ("langCode", "regulationId", "labelId", "deletedAt")`,
    );
    await queryRunner.query(
      `ALTER TABLE "label" ADD CONSTRAINT "UQ_fe39b4d76ec70250921fba835e3" UNIQUE ("key", "deletedAt")`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" ADD CONSTRAINT "leadId" FOREIGN KEY ("leadId") REFERENCES "lead"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" ADD CONSTRAINT "FK_b630c0b6d0d25ffb74e9870a853" FOREIGN KEY ("contactId") REFERENCES "lead"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication" ADD CONSTRAINT "FK_045a80cba824af9448fe63c41ce" FOREIGN KEY ("leadId") REFERENCES "lead"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "FK_9e66495ec6d5f519145c18ea202" FOREIGN KEY ("serverId") REFERENCES "server"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_account" ADD CONSTRAINT "FK_d81c82afe892f63f31893a0a2bf" FOREIGN KEY ("login") REFERENCES "mt5_accounts_replicated"("login") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_account" ADD CONSTRAINT "FK_d81c82afe892f63f31893a0a2bf" FOREIGN KEY ("login") REFERENCES "mt5_users_replicated"("login") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "psp_regulations" ADD CONSTRAINT "FK_91420b1967d3749908c13a88fac" FOREIGN KEY ("pspId") REFERENCES "psp"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "psp_regulations" ADD CONSTRAINT "FK_83e79c5036c79479c23c8db3058" FOREIGN KEY ("regulationId") REFERENCES "regulations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_9e992e170123100485d44ecc33b" FOREIGN KEY ("salesManagerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ADD CONSTRAINT "FK_e812991b7a2e18ef24ee0a5ed9a" FOREIGN KEY ("clientID") REFERENCES "client"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_view_column" ADD CONSTRAINT "FK_2ea42332c68a28c1d8bbe632c32" FOREIGN KEY ("listColumnsMetaId") REFERENCES "list_columns_meta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_views_filter" ADD CONSTRAINT "FK_450977fcfbe3dd2b0463d64ce81" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_columns_meta" ADD CONSTRAINT "FK_211d34eb69685efbb52b581f388" FOREIGN KEY ("listId") REFERENCES "list_name"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "list_columns_meta" DROP CONSTRAINT "FK_211d34eb69685efbb52b581f388"`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_views_filter" DROP CONSTRAINT "FK_450977fcfbe3dd2b0463d64ce81"`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_view_column" DROP CONSTRAINT "FK_2ea42332c68a28c1d8bbe632c32"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" DROP CONSTRAINT "FK_e812991b7a2e18ef24ee0a5ed9a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_9e992e170123100485d44ecc33b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "psp_regulations" DROP CONSTRAINT "FK_83e79c5036c79479c23c8db3058"`,
    );
    await queryRunner.query(
      `ALTER TABLE "psp_regulations" DROP CONSTRAINT "FK_91420b1967d3749908c13a88fac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_account" DROP CONSTRAINT "FK_d81c82afe892f63f31893a0a2bf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_account" DROP CONSTRAINT "FK_d81c82afe892f63f31893a0a2bf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "FK_9e66495ec6d5f519145c18ea202"`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication" DROP CONSTRAINT "FK_045a80cba824af9448fe63c41ce"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" DROP CONSTRAINT "FK_b630c0b6d0d25ffb74e9870a853"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" DROP CONSTRAINT "leadId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "label" DROP CONSTRAINT "UQ_fe39b4d76ec70250921fba835e3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "label_translation" DROP CONSTRAINT "UQ_51154f54eee95db38c99d168564"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_event" DROP CONSTRAINT "UQ_c781b0846adac9d0f0c13850f0e"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_9e992e170123100485d44ecc33" ON "transaction"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_mt5_users_replicated_replicated_Timestamp" ON "mt5_users_replicated"`,
    );
    await queryRunner.query(
      `ALTER TABLE "static_data" ALTER COLUMN "data" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "static_data" DROP CONSTRAINT "UQ_05ed4111f0a56bc1a541557ffe9"`,
    );
    await queryRunner.query(`ALTER TABLE "static_data" DROP COLUMN "key"`);
    await queryRunner.query(
      `ALTER TABLE "static_data" ADD "key" varchar(100) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "static_data" ADD CONSTRAINT "UQ_05ed4111f0a56bc1a541557ffe9" UNIQUE ("key")`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_columns_meta" ALTER COLUMN "listId" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_columns_meta" ADD CONSTRAINT "FK_211d34eb69685efbb52b581f388" FOREIGN KEY ("listId") REFERENCES "list_name"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_views_filter" ALTER COLUMN "userId" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_views_filter" ADD CONSTRAINT "FK_450977fcfbe3dd2b0463d64ce81" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_view_column" ALTER COLUMN "listColumnsMetaId" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_view_column" ADD CONSTRAINT "FK_2ea42332c68a28c1d8bbe632c32" FOREIGN KEY ("listColumnsMetaId") REFERENCES "list_columns_meta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fresh_desk_logs" DROP COLUMN "payload_res"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fresh_desk_logs" ADD "payload_res" nvarchar(MAX)`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_log" ALTER COLUMN "parent_type" int`,
    );
    await queryRunner.query(`ALTER TABLE "user_log" DROP COLUMN "parent_id"`);
    await queryRunner.query(`ALTER TABLE "user_log" ADD "parent_id" int`);
    await queryRunner.query(
      `ALTER TABLE "lead" DROP CONSTRAINT "DF_017bc7b4f9b545d73503ff38f04"`,
    );
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "latestNote"`);
    await queryRunner.query(
      `ALTER TABLE "lead" ADD "latestNote" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" DROP CONSTRAINT "DF_0fd2c9f2504fe5e1a7d64bc81c7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" DROP CONSTRAINT "DF_e15c575e88ca360a93d292f75dc"`,
    );
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "clientID"`);
    await queryRunner.query(`ALTER TABLE "lead" ADD "clientID" nvarchar(255)`);
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "subIndexName" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "indexName" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "externalNote"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "externalNote" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "DF_7462f11c9f4261b4b24c50b0621"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "DF_7462f11c9f4261b4b24c50b0621" DEFAULT 0.0 FOR "EquityPrevMonth"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ALTER COLUMN "EquityPrevMonth" float NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "DF_06d9a2fdda00dba17d0cdb11b25"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "DF_06d9a2fdda00dba17d0cdb11b25" DEFAULT 0.0 FOR "EquityPrevDay"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ALTER COLUMN "EquityPrevDay" float NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "DF_5d4be0c1f3715a986c4d494cc69"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "DF_5d4be0c1f3715a986c4d494cc69" DEFAULT 0.0 FOR "BalancePrevMonth"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ALTER COLUMN "BalancePrevMonth" float NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "DF_b904cb52346d2fe1a78b98ad3f3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "DF_b904cb52346d2fe1a78b98ad3f3" DEFAULT 0.0 FOR "BalancePrevDay"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ALTER COLUMN "BalancePrevDay" float NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "DF_5d84ac84b2c43e30a9fa37f99dc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "DF_5d84ac84b2c43e30a9fa37f99dc" DEFAULT 0.0 FOR "CommissionMonthly"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ALTER COLUMN "CommissionMonthly" float NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "DF_dd6d9fc4bf73141ccfdf36bc780"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "DF_dd6d9fc4bf73141ccfdf36bc780" DEFAULT 0.0 FOR "CommissionDaily"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ALTER COLUMN "CommissionDaily" float NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "DF_6d1b38b4ccd7dfefbe8a3dd7941"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "DF_6d1b38b4ccd7dfefbe8a3dd7941" DEFAULT 0.0 FOR "InterestRate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ALTER COLUMN "InterestRate" float NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "DF_c751f97fb206cd3eba229e1c3cf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "DF_c751f97fb206cd3eba229e1c3cf" DEFAULT 0.0 FOR "Credit"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ALTER COLUMN "Credit" float NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "DF_04bd4062fe5b330d445677ed169"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "DF_04bd4062fe5b330d445677ed169" DEFAULT 0.0 FOR "Balance"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ALTER COLUMN "Balance" float NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "DF_f2dd974d0877f6891736f1bbbcc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "DF_f2dd974d0877f6891736f1bbbcc" DEFAULT 0 FOR "TimestampTrade"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "DF_fe48b25921f386371d4061bab40"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "DF_fe48b25921f386371d4061bab40" DEFAULT 0 FOR "LimitOrders"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "DF_656fa313d43aef70eeca6f31101"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "DF_656fa313d43aef70eeca6f31101" DEFAULT 0.0 FOR "LimitPositions"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ALTER COLUMN "LimitPositions" float NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "DF_56aeee7d665282692286257fcaa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "DF_56aeee7d665282692286257fcaa" DEFAULT 0 FOR "Agent"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "DF_4a477a022cf48610c176ec1d682"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "DF_4a477a022cf48610c176ec1d682" DEFAULT 0 FOR "Leverage"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "DF_10f8ec05cb9f65c42d866fd113e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "DF_10f8ec05cb9f65c42d866fd113e" DEFAULT 0 FOR "Color"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "DF_c162f172b74bb2cbd67db78fd35"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "DF_c162f172b74bb2cbd67db78fd35" DEFAULT 0 FOR "ClientID"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "DF_3f6518a6f2327a375c7b4fea615"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "DF_3f6518a6f2327a375c7b4fea615" DEFAULT 0 FOR "Language"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "DF_9b2755c4d410ddea36296dfcb74"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "DF_9b2755c4d410ddea36296dfcb74" DEFAULT 0 FOR "Rights"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "DF_bbb620d883194bfd7e4ec1d23b9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "DF_bbb620d883194bfd7e4ec1d23b9" DEFAULT 0 FOR "CertSerialNumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "DF_f0ac8d6063af6ca546abe77eaa4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "DF_f0ac8d6063af6ca546abe77eaa4" DEFAULT 0 FOR "Timestamp"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" DROP CONSTRAINT "DF_b1bd2f79db3fe50e4235eedfd3f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ADD CONSTRAINT "DF_b1bd2f79db3fe50e4235eedfd3f" DEFAULT 0.0 FOR "BlockedProfit"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ALTER COLUMN "BlockedProfit" float NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" DROP CONSTRAINT "DF_0a89f36c95ce65f2b1401fc6ed0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ADD CONSTRAINT "DF_0a89f36c95ce65f2b1401fc6ed0" DEFAULT 0.0 FOR "BlockedCommission"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ALTER COLUMN "BlockedCommission" float NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" DROP CONSTRAINT "DF_35c7385f9385790cd25e794e9bc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ADD CONSTRAINT "DF_35c7385f9385790cd25e794e9bc" DEFAULT 0.0 FOR "Liabilities"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ALTER COLUMN "Liabilities" float NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" DROP CONSTRAINT "DF_0875d7dfc073e4152f54fcf8dcf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ADD CONSTRAINT "DF_0875d7dfc073e4152f54fcf8dcf" DEFAULT 0.0 FOR "Assets"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ALTER COLUMN "Assets" float NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" DROP CONSTRAINT "DF_d75ff72e058ffe573b1d6a50ea3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ADD CONSTRAINT "DF_d75ff72e058ffe573b1d6a50ea3" DEFAULT 0.0 FOR "Equity"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ALTER COLUMN "Equity" float NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" DROP CONSTRAINT "DF_fd37367904cc853c0109de6c82f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ADD CONSTRAINT "DF_fd37367904cc853c0109de6c82f" DEFAULT 0.0 FOR "Floating"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ALTER COLUMN "Floating" float NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" DROP CONSTRAINT "DF_dac687af0ddda181771601806dd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ADD CONSTRAINT "DF_dac687af0ddda181771601806dd" DEFAULT 0.0 FOR "Storage"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ALTER COLUMN "Storage" float NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" DROP CONSTRAINT "DF_cffcd5ef3784e0e618f08ba3856"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ADD CONSTRAINT "DF_cffcd5ef3784e0e618f08ba3856" DEFAULT 0.0 FOR "Profit"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ALTER COLUMN "Profit" float NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" DROP CONSTRAINT "DF_cc56e1ec2f6df87fe28195dee4f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ADD CONSTRAINT "DF_cc56e1ec2f6df87fe28195dee4f" DEFAULT 0.0 FOR "MarginMaintenance"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ALTER COLUMN "MarginMaintenance" float NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" DROP CONSTRAINT "DF_1a97b1d1d64166ecf21664d33b3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ADD CONSTRAINT "DF_1a97b1d1d64166ecf21664d33b3" DEFAULT 0.0 FOR "MarginInitial"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ALTER COLUMN "MarginInitial" float NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" DROP CONSTRAINT "DF_3b3c251c6c1814a8742d9b7194d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ADD CONSTRAINT "DF_3b3c251c6c1814a8742d9b7194d" DEFAULT 0 FOR "MarginLeverage"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" DROP CONSTRAINT "DF_f1ede20ae06ca2fb5a83dd6e1ab"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ADD CONSTRAINT "DF_f1ede20ae06ca2fb5a83dd6e1ab" DEFAULT 0.0 FOR "MarginLevel"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ALTER COLUMN "MarginLevel" float NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" DROP CONSTRAINT "DF_8e66ca1906a7cb50baf776f4334"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ADD CONSTRAINT "DF_8e66ca1906a7cb50baf776f4334" DEFAULT 0.0 FOR "MarginFree"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ALTER COLUMN "MarginFree" float NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" DROP CONSTRAINT "DF_c2b08011f2125f873486f5f73d2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ADD CONSTRAINT "DF_c2b08011f2125f873486f5f73d2" DEFAULT 0.0 FOR "Margin"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ALTER COLUMN "Margin" float NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" DROP CONSTRAINT "DF_3c03fca5d3c5efea207e2701f18"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ADD CONSTRAINT "DF_3c03fca5d3c5efea207e2701f18" DEFAULT 0.0 FOR "Credit"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ALTER COLUMN "Credit" float NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" DROP CONSTRAINT "DF_9be6a6f41a7507c72e5d565d305"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ADD CONSTRAINT "DF_9be6a6f41a7507c72e5d565d305" DEFAULT 0.0 FOR "Balance"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ALTER COLUMN "Balance" float NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" DROP CONSTRAINT "DF_66563863432d20991aaf240cd9f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ADD CONSTRAINT "DF_66563863432d20991aaf240cd9f" DEFAULT 0 FOR "CurrencyDigits"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_trading_groups" ALTER COLUMN "copyTradingGroupSw" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_6796cc2df7a5503680c2c941909"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "utmTerm"`);
    await queryRunner.query(`ALTER TABLE "client" ADD "utmTerm" nvarchar(MAX)`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "utmContent"`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "utmContent" nvarchar(MAX)`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "utmCampaign"`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "utmCampaign" nvarchar(MAX)`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "utmMedium"`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "utmMedium" nvarchar(MAX)`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "utmSource"`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "utmSource" nvarchar(MAX)`,
    );
    await queryRunner.query(`ALTER TABLE "label" DROP COLUMN "key"`);
    await queryRunner.query(
      `ALTER TABLE "label" ADD "key" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_event" DROP COLUMN "description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_event" ADD "description" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "email_event" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "email_event" ADD "name" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_event" ADD CONSTRAINT "UQ_c781b0846adac9d0f0c13850f0e" UNIQUE ("deletedAt", "name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "regulations_countries" ALTER COLUMN "telephonePrefix" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "regulation_translations" DROP COLUMN "translationText"`,
    );
    await queryRunner.query(
      `ALTER TABLE "regulation_translations" ADD "translationText" nvarchar(MAX)`,
    );
    await queryRunner.query(
      `ALTER TABLE "crypto_network" ADD "channel" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "crypto_network" ADD CONSTRAINT "DF_7f83432762ae239070c6d15b2c5" DEFAULT 'BOTH' FOR "channel"`,
    );
    await queryRunner.query(
      `ALTER TABLE "supported_crypto" ADD "channel" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "supported_crypto" ADD CONSTRAINT "DF_ddb310428f2c6279adff68d2055" DEFAULT 'BOTH' FOR "channel"`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ADD "fcmToken" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ADD "shortTitle" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "question" ADD "subStep" int`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isTicketUser" bit NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "DF_ae53f4233e16627d0fd93ea76e9" DEFAULT 0 FOR "isTicketUser"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isLongTokenEnabled" bit NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "DF_84fd8fc29aa2c99a88bba11158a" DEFAULT 0 FOR "isLongTokenEnabled"`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "fullName" nvarchar(255)`);
    await queryRunner.query(
      `ALTER TABLE "operator" ADD "autoLeadReassign" bit NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ADD CONSTRAINT "DF_cb9edbb8ec1154104e615fb17b9" DEFAULT 0 FOR "autoLeadReassign"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ADD "leadReassignWeeklyCount" int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ADD CONSTRAINT "DF_d2ea986050388314a8f07c11ca8" DEFAULT 0 FOR "leadReassignWeeklyCount"`,
    );
    await queryRunner.query(`ALTER TABLE "notes" ADD "ticketId" int`);
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "accountType" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "feeType" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "salesMangerId" int`,
    );
    await queryRunner.query(`ALTER TABLE "psp" ADD "bankAccountId" int`);
    await queryRunner.query(`ALTER TABLE "psp" ADD "exchangeId" int`);
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "commissionProfileId" int`,
    );
    await queryRunner.query(`ALTER TABLE "partner" ADD "ibPath" nvarchar(255)`);
    await queryRunner.query(`ALTER TABLE "partner" ADD "masterIbId" int`);
    await queryRunner.query(`ALTER TABLE "partner" ADD "partnerLevel" int`);
    await queryRunner.query(
      `ALTER TABLE "mt5_account" ADD "isDefault" bit NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_account" ADD CONSTRAINT "DF_bac8986f29fee95c82d00ba51a1" DEFAULT 0 FOR "isDefault"`,
    );
    await queryRunner.query(`ALTER TABLE "wallet" ADD "version" int NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD CONSTRAINT "DF_62a1df31d06ee61301f9646ef5f" DEFAULT 1 FOR "version"`,
    );
    await queryRunner.query(
      `ALTER TABLE "regulations" ADD "idwise_required" bit`,
    );
    await queryRunner.query(
      `ALTER TABLE "regulations" ADD CONSTRAINT "DF_43fce467be11635418825e3a4ee" DEFAULT 0 FOR "idwise_required"`,
    );
    await queryRunner.query(
      `ALTER TABLE "layout" ADD CONSTRAINT "UQ_37ecd4d0113b028a4c59ffd9f43" UNIQUE ("companyName", "deletedAt", "language", "regulationIdId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IX_transaction_userid_type_status" ON "transaction" ("userId", "type", "status", "paidAmount") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ef357911e4f9540518d4ac9022" ON "transaction" ("salesManagerId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_mt5_users_replicated_Timestamp" ON "mt5_users_replicated" ("Timestamp") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IX_client_isActive" ON "client" ("isActive", "userId", "firstName", "lastName", "salesRep", "retentionRep", "tradingActiveMonthly", "adjustedFtdAmount") `,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_f80032c315b0bfe15e51a7ad950" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_ef357911e4f9540518d4ac9022a" FOREIGN KEY ("salesManagerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "psp" ADD CONSTRAINT "FK_400a43234e76d3191d3bad41a82" FOREIGN KEY ("bankAccountId") REFERENCES "bank_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "psp_regulations" ADD CONSTRAINT "FK_psp_regulations_regulationId" FOREIGN KEY ("regulationId") REFERENCES "regulations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "psp_regulations" ADD CONSTRAINT "FK_psp_regulations_pspId" FOREIGN KEY ("pspId") REFERENCES "psp"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD CONSTRAINT "FK_d3d217b2aba366f27d0ebc39017" FOREIGN KEY ("commissionProfileId") REFERENCES "ib_commission_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "FK_2d633d732624e35432d662c8ee8" FOREIGN KEY ("serverId") REFERENCES "server"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
