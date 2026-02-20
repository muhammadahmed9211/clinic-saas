import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOpportunities1721035034830 implements MigrationInterface {
  name = 'CreateOpportunities1721035034830';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "funnel" ("id" int NOT NULL IDENTITY(1,1), "sequence" int NOT NULL, "name" nvarchar(255) NOT NULL, "probability" int NOT NULL, "type" nvarchar(255) NOT NULL CONSTRAINT "DF_84ce60d98c6e3924ea175d62e73" DEFAULT 'lead', "createdAt" datetime2 NOT NULL CONSTRAINT "DF_5420c95877bcc0c4d2b5392d8f1" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_29f4beddb05aca06e0c806207bd" DEFAULT getdate(), CONSTRAINT "PK_3c4816db3aa8f29707bda0612c7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "opportunity" ("id" int NOT NULL IDENTITY(1,1), "dealName" nvarchar(255) NOT NULL, "companyName" nvarchar(255) NOT NULL, "type" nvarchar(255) NOT NULL, "nextStep" nvarchar(255) NOT NULL, "leadSource" nvarchar(255) NOT NULL, "amount" int NOT NULL, "closingDate" datetime NOT NULL, "stage" nvarchar(255) NOT NULL, "probability" nvarchar(255) NOT NULL, "expectedInvestment" float NOT NULL, "typeOfBusiness" nvarchar(255) NOT NULL, "description" nvarchar(255), "createdAt" datetime2 NOT NULL CONSTRAINT "DF_37a6f174153a3446ce727d50038" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_95ae2c2fb45240e220e62638aad" DEFAULT getdate(), "dealOwnerId" int, "contactNameId" int, "leadId" int, "createdById" int, "modifiedById" int, CONSTRAINT "PK_085fd6d6f4765325e6c16163568" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "opportunity" ADD CONSTRAINT "FK_cdc7717fe06ec3e4800fd53ec86" FOREIGN KEY ("dealOwnerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "opportunity" ADD CONSTRAINT "FK_796d19f4a9ab8484131bb64ebde" FOREIGN KEY ("contactNameId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "opportunity" ADD CONSTRAINT "FK_c5a25a745e25f5cc18a5ab8c41f" FOREIGN KEY ("leadId") REFERENCES "lead"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "opportunity" ADD CONSTRAINT "FK_b56456374eb973cd7a4b424d035" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "opportunity" ADD CONSTRAINT "FK_bdf1765787cd360f0ed3395d582" FOREIGN KEY ("modifiedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "opportunity" DROP CONSTRAINT "FK_bdf1765787cd360f0ed3395d582"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opportunity" DROP CONSTRAINT "FK_b56456374eb973cd7a4b424d035"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opportunity" DROP CONSTRAINT "FK_c5a25a745e25f5cc18a5ab8c41f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opportunity" DROP CONSTRAINT "FK_796d19f4a9ab8484131bb64ebde"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opportunity" DROP CONSTRAINT "FK_cdc7717fe06ec3e4800fd53ec86"`,
    );
    await queryRunner.query(`DROP TABLE "opportunity"`);
    await queryRunner.query(`DROP TABLE "funnel"`);
  }
}
