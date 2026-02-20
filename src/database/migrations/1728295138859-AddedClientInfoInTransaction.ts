import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedClientInfoInTransaction1728295138859
  implements MigrationInterface
{
  name = 'AddedClientInfoInTransaction1728295138859';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "leadSource" varchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" ADD "officeId" bigint`);
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "officeName" varchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" ADD "partnerId" int`);
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "partnerName" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "salesRepName" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "retentionRepName" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "salesDeskName" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "retentionDeskName" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "salesManagerId" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "salesManagerName" varchar(255)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4e789eec5124f8e27e717f91f8" ON "transaction" ("officeId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b18db65aa9ba539028dce4da7d" ON "transaction" ("partnerId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ef357911e4f9540518d4ac9022" ON "transaction" ("salesManagerId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_4e789eec5124f8e27e717f91f83" FOREIGN KEY ("officeId") REFERENCES "office"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_b18db65aa9ba539028dce4da7d1" FOREIGN KEY ("partnerId") REFERENCES "partner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_ef357911e4f9540518d4ac9022a" FOREIGN KEY ("salesManagerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_ef357911e4f9540518d4ac9022a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_b18db65aa9ba539028dce4da7d1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_4e789eec5124f8e27e717f91f83"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_ef357911e4f9540518d4ac9022" ON "transaction"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_b18db65aa9ba539028dce4da7d" ON "transaction"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_4e789eec5124f8e27e717f91f8" ON "transaction"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "salesMangerName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "salesManagerId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "retentionRepName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "salesRepName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "partnerName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "partnerId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "officeName"`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "officeId"`);
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "leadSource"`,
    );
  }
}
