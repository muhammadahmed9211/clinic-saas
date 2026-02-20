import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterrejectedReason1711974900599 implements MigrationInterface {
  name = 'AlterrejectedReason1711974900599';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rejected_reason" ALTER COLUMN "labelId" int`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "REL_43701a14bf7cccdeceb8a72396" ON "rejected_reason" ("labelId") WHERE "labelId" IS NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rejected_reason" ADD CONSTRAINT "FK_43701a14bf7cccdeceb8a723965" FOREIGN KEY ("labelId") REFERENCES "label"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rejected_reason" DROP CONSTRAINT "FK_43701a14bf7cccdeceb8a723965"`,
    );
    await queryRunner.query(
      `DROP INDEX "REL_43701a14bf7cccdeceb8a72396" ON "rejected_reason"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rejected_reason" ALTER COLUMN "labelId" int NOT NULL`,
    );
  }
}
