import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedMt5AccountsReplicationTable1730449843882
  implements MigrationInterface
{
  name = 'AddedMt5AccountsReplicationTable1730449843882';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "mt5_accounts_replicated" ("id" int NOT NULL IDENTITY(1,1), "login" nvarchar(255) NOT NULL, "CurrencyDigits" numeric(11,0) NOT NULL CONSTRAINT "DF_66563863432d20991aaf240cd9f" DEFAULT (0), "Balance" float(53) NOT NULL CONSTRAINT "DF_9be6a6f41a7507c72e5d565d305" DEFAULT (0.0), "Credit" float(53) NOT NULL CONSTRAINT "DF_3c03fca5d3c5efea207e2701f18" DEFAULT (0.0), "Margin" float(53) NOT NULL CONSTRAINT "DF_c2b08011f2125f873486f5f73d2" DEFAULT (0.0), "MarginFree" float(53) NOT NULL CONSTRAINT "DF_8e66ca1906a7cb50baf776f4334" DEFAULT (0.0), "MarginLevel" float(53) NOT NULL CONSTRAINT "DF_f1ede20ae06ca2fb5a83dd6e1ab" DEFAULT (0.0), "MarginLeverage" numeric(11,0) NOT NULL CONSTRAINT "DF_3b3c251c6c1814a8742d9b7194d" DEFAULT (0), "MarginInitial" float(53) NOT NULL CONSTRAINT "DF_1a97b1d1d64166ecf21664d33b3" DEFAULT (0.0), "MarginMaintenance" float(53) NOT NULL CONSTRAINT "DF_cc56e1ec2f6df87fe28195dee4f" DEFAULT (0.0), "Profit" float(53) NOT NULL CONSTRAINT "DF_cffcd5ef3784e0e618f08ba3856" DEFAULT (0.0), "Storage" float(53) NOT NULL CONSTRAINT "DF_dac687af0ddda181771601806dd" DEFAULT (0.0), "Floating" float(53) NOT NULL CONSTRAINT "DF_fd37367904cc853c0109de6c82f" DEFAULT (0.0), "Equity" float(53) NOT NULL CONSTRAINT "DF_d75ff72e058ffe573b1d6a50ea3" DEFAULT (0.0), "Assets" float(53) NOT NULL CONSTRAINT "DF_0875d7dfc073e4152f54fcf8dcf" DEFAULT (0.0), "Liabilities" float(53) NOT NULL CONSTRAINT "DF_35c7385f9385790cd25e794e9bc" DEFAULT (0.0), "BlockedCommission" float(53) NOT NULL CONSTRAINT "DF_0a89f36c95ce65f2b1401fc6ed0" DEFAULT (0.0), "BlockedProfit" float(53) NOT NULL CONSTRAINT "DF_b1bd2f79db3fe50e4235eedfd3f" DEFAULT (0.0), "CreatedAt" datetime NOT NULL CONSTRAINT "DF_59d210abc1e88315f7280655c5d" DEFAULT getdate(), "UpdatedAt" datetime NOT NULL CONSTRAINT "DF_fdc160c8d820cc8ee6d015b65b3" DEFAULT getdate(), "DeletedAt" datetime2, "serverId" uniqueidentifier, CONSTRAINT "UQ_f9c9e1e920d696919dfddc342d9" UNIQUE ("login"), CONSTRAINT "PK_472b74899a4ff287ddb061e756d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "PK_mt5_accounts" ON "mt5_accounts_replicated" ("login") `,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" ADD CONSTRAINT "FK_0e8df4f776c0cd77f67b705dd4e" FOREIGN KEY ("serverId") REFERENCES "server"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mt5_accounts_replicated" DROP CONSTRAINT "FK_0e8df4f776c0cd77f67b705dd4e"`,
    );
    await queryRunner.query(
      `DROP INDEX "PK_mt5_accounts" ON "mt5_accounts_replicated"`,
    );
    await queryRunner.query(`DROP TABLE "mt5_accounts_replicated"`);
  }
}
