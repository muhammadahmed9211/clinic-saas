import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedPartnerTradingGroupsTable1717251207044
  implements MigrationInterface
{
  name = 'AddedPartnerTradingGroupsTable1717251207044';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "partner_trading_groups" ("id" int NOT NULL IDENTITY(1,1), "tradingGroup" nvarchar(255) NOT NULL, "tradingGroupSw" nvarchar(255) NOT NULL, "office" int NOT NULL, "salesDesk" int NOT NULL, "retentionDesk" int NOT NULL, "supportDesk" int NOT NULL, "financeDesk" int NOT NULL, "salesRep" int, "retentionRep" int, "createdAt" datetime NOT NULL CONSTRAINT "DF_9d729c09ebbef3ff1ccd9bfdd05" DEFAULT getdate(), "deletedAt" datetime2, "updatedAt" datetime NOT NULL CONSTRAINT "DF_647ed9126166574c803dcab4af0" DEFAULT getdate(), "partnerId" int, CONSTRAINT "PK_600327434fa951101da3c4c2c11" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "REL_d2a8e21b46504062efe7e0ed97" ON "partner_trading_groups" ("partnerId") WHERE "partnerId" IS NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_trading_groups" ADD CONSTRAINT "FK_d2a8e21b46504062efe7e0ed976" FOREIGN KEY ("partnerId") REFERENCES "partner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner_trading_groups" DROP CONSTRAINT "FK_d2a8e21b46504062efe7e0ed976"`,
    );
    await queryRunner.query(
      `DROP INDEX "REL_d2a8e21b46504062efe7e0ed97" ON "partner_trading_groups"`,
    );
    await queryRunner.query(`DROP TABLE "partner_trading_groups"`);
  }
}
