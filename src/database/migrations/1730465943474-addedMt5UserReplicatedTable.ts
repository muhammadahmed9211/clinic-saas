import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedMt5UserReplicatedTable1730465943474
  implements MigrationInterface
{
  name = 'AddedMt5UserReplicatedTable1730465943474';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "mt5_users_replicated" ("recordId" int NOT NULL IDENTITY(1,1), "login" nvarchar(255) NOT NULL, "Timestamp" bigint NOT NULL CONSTRAINT "DF_9935dd915df6d481c24b3f7bcac" DEFAULT (0), "Group" nvarchar(64) NOT NULL CONSTRAINT "DF_9bfffa215ce59622f36930b999c" DEFAULT '', "CertSerialNumber" numeric(20,0) NOT NULL CONSTRAINT "DF_c8f7c7e5d79f4f9ad0c53827487" DEFAULT (0), "Rights" numeric(20,0) NOT NULL CONSTRAINT "DF_c9feaa7dd2405d77ef2fcb9fdb3" DEFAULT (0), "Registration" datetime NOT NULL CONSTRAINT "DF_bd810ed06bf32bafa62f6003660" DEFAULT GETDATE(), "LastAccess" datetime NOT NULL CONSTRAINT "DF_bf15dc52ea77bcedde67c5e9327" DEFAULT GETDATE(), "LastPassChange" datetime NOT NULL CONSTRAINT "DF_5ed9cc68e67a9de0fd836525124" DEFAULT GETDATE(), "FirstName" nvarchar(128) NOT NULL CONSTRAINT "DF_a98d3f673b7bad2194e3cebbe11" DEFAULT '', "LastName" nvarchar(64) NOT NULL CONSTRAINT "DF_52718fd33939d25a476ad5d8f86" DEFAULT '', "MiddleName" nvarchar(64) NOT NULL CONSTRAINT "DF_9cd13fe7d83eb9a3b335580023b" DEFAULT '', "Company" nvarchar(64) NOT NULL CONSTRAINT "DF_2545a346e3c1e5e6188ed8bb179" DEFAULT '', "Account" nvarchar(32) NOT NULL CONSTRAINT "DF_728d6f2f254007e706164414ea5" DEFAULT '', "Country" nvarchar(32) NOT NULL CONSTRAINT "DF_3c3763b9e79b7667a3e184f1d42" DEFAULT '', "Language" numeric(11,0) NOT NULL CONSTRAINT "DF_12fa9a6133aa56e7246bdabd0a9" DEFAULT (0), "ClientID" numeric(20,0) NOT NULL CONSTRAINT "DF_ad99704fecb3595f63c196faa69" DEFAULT (0), "City" nvarchar(32) NOT NULL CONSTRAINT "DF_74c7af4e6131747f26e5fdddacc" DEFAULT '', "State" nvarchar(32) NOT NULL CONSTRAINT "DF_be8f169b10f1ca49d2b3630d0bd" DEFAULT '', "ZipCode" nvarchar(16) NOT NULL CONSTRAINT "DF_af34ec5f4a0f190d67461edc2cf" DEFAULT '', "Address" nvarchar(128) NOT NULL CONSTRAINT "DF_de1037984b34351c493b8d34647" DEFAULT '', "Phone" nvarchar(32) NOT NULL CONSTRAINT "DF_a62c74fc9997332170a610f079e" DEFAULT '', "Email" nvarchar(64) NOT NULL CONSTRAINT "DF_3ca00a2210e5404cb77210e926a" DEFAULT '', "ID" nvarchar(32) NOT NULL CONSTRAINT "DF_62421955408a0ed30c7d9b0c59a" DEFAULT '', "Status" nvarchar(16) NOT NULL CONSTRAINT "DF_5b941e581b23bf49c005d4a3809" DEFAULT '', "Comment" nvarchar(64) NOT NULL CONSTRAINT "DF_5b1eea1422ca3a671aa9325661e" DEFAULT '', "Color" numeric(11,0) NOT NULL CONSTRAINT "DF_d83757c0311a6160a92b010b426" DEFAULT (0), "PhonePassword" nvarchar(32) NOT NULL CONSTRAINT "DF_757dca0136a5fec629be52f1940" DEFAULT '', "Leverage" numeric(11,0) NOT NULL CONSTRAINT "DF_f8bcfeab71a4e7adc67730709d1" DEFAULT (0), "Agent" numeric(20,0) NOT NULL CONSTRAINT "DF_7935a131df40b32458abab11a61" DEFAULT (0), "TradeAccounts" nvarchar(128) NOT NULL CONSTRAINT "DF_bd5588b099bef7a71eca6ca8ad1" DEFAULT '', "LimitPositions" float(53) NOT NULL CONSTRAINT "DF_4dae0f024e2ed9a4b2b32d1f7d9" DEFAULT (0.0), "LimitOrders" numeric(11,0) NOT NULL CONSTRAINT "DF_51b1fcd58dc499036615c30d06d" DEFAULT (0), "LeadCampaign" nvarchar(32) NOT NULL CONSTRAINT "DF_dd279b26049cfa7ae751d2cd3bc" DEFAULT '', "LeadSource" nvarchar(32) NOT NULL CONSTRAINT "DF_2b32f8406abd3688f73caa66fd9" DEFAULT '', "TimestampTrade" bigint NOT NULL CONSTRAINT "DF_859847ce5aa47d506598b27b0cd" DEFAULT (0), "Balance" float(53) NOT NULL CONSTRAINT "DF_0a90d1b66c8af022bf5070dba77" DEFAULT (0.0), "Credit" float(53) NOT NULL CONSTRAINT "DF_fac3b45ae830b702716b7cd04d1" DEFAULT (0.0), "InterestRate" float(53) NOT NULL CONSTRAINT "DF_698a7bd41e45dbef68dea1da289" DEFAULT (0.0), "CommissionDaily" float(53) NOT NULL CONSTRAINT "DF_9c8160cf14915c797b1b3e72d1c" DEFAULT (0.0), "CommissionMonthly" float(53) NOT NULL CONSTRAINT "DF_631bfbb7cc082193ca264fae839" DEFAULT (0.0), "BalancePrevDay" float(53) NOT NULL CONSTRAINT "DF_c32bfd29692e3d5b0f84cf03edb" DEFAULT (0.0), "BalancePrevMonth" float(53) NOT NULL CONSTRAINT "DF_a40c8da46dd7a5099b51ca9d6c2" DEFAULT (0.0), "EquityPrevDay" float(53) NOT NULL CONSTRAINT "DF_c28093aa2e505815454d2302472" DEFAULT (0.0), "EquityPrevMonth" float(53) NOT NULL CONSTRAINT "DF_e12d40a10c5f1e6d9b9f29a43b1" DEFAULT (0.0), "Name" nvarchar(256) NOT NULL CONSTRAINT "DF_10da207b542f37e6b7b0fe81c70" DEFAULT '', "MQID" nvarchar(16) NOT NULL CONSTRAINT "DF_10d7cdf2b726afb78b738962fe5" DEFAULT '', "LastIP" nvarchar(32) NOT NULL CONSTRAINT "DF_f2c4df6d186ab765321dfd819be" DEFAULT '', "ApiData" nvarchar(4000) NOT NULL CONSTRAINT "DF_136654c961a8da0b10c4954ceaa" DEFAULT '', "CreatedAt" datetime NOT NULL CONSTRAINT "DF_35344398d50f6b2033cccb7427a" DEFAULT getdate(), "UpdatedAt" datetime NOT NULL CONSTRAINT "DF_806db2991049cf9d3440bd3fa0e" DEFAULT getdate(), "DeletedAt" datetime2, "serverId" uniqueidentifier, CONSTRAINT "UQ_80c6aa10203c458c382788f1ff5" UNIQUE ("login"), CONSTRAINT "PK_c4555bc8527f00c4fba0f604321" PRIMARY KEY ("recordId"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "PK_mt5_users_replicated" ON "mt5_users_replicated" ("login") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_mt5_users_replicated_Timestamp" ON "mt5_users_replicated" ("Timestamp") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "REL_d81c82afe892f63f31893a0a2b" ON "mt5_account" ("login") WHERE "login" IS NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" ADD CONSTRAINT "FK_2d633d732624e35432d662c8ee8" FOREIGN KEY ("serverId") REFERENCES "server"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_account" ADD CONSTRAINT "FK_d81c82afe892f63f31893a0a2bf" FOREIGN KEY ("login") REFERENCES "mt5_accounts_replicated"("login") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_account" ADD CONSTRAINT "FK_d81c82afe892f63f31893a0a2bf" FOREIGN KEY ("login") REFERENCES "mt5_users_replicated"("login") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mt5_account" DROP CONSTRAINT "FK_d81c82afe892f63f31893a0a2bf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_account" DROP CONSTRAINT "FK_d81c82afe892f63f31893a0a2bf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_users_replicated" DROP CONSTRAINT "FK_2d633d732624e35432d662c8ee8"`,
    );
    await queryRunner.query(
      `DROP INDEX "REL_d81c82afe892f63f31893a0a2b" ON "mt5_account"`,
    );
    await queryRunner.query(
      `DROP INDEX "REL_d81c82afe892f63f31893a0a2b" ON "mt5_account"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_mt5_users_replicated_Timestamp" ON "mt5_users_replicated"`,
    );
    await queryRunner.query(
      `DROP INDEX "PK_mt5_users_replicated" ON "mt5_users_replicated"`,
    );
    await queryRunner.query(`DROP TABLE "mt5_users_replicated"`);
  }
}
