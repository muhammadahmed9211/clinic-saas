import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRetentionManagerInTransaction1747380987077
  implements MigrationInterface
{
  name = 'AddRetentionManagerInTransaction1747380987077';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "retentionManagerId" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "retentionManagerName" varchar(255)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f02207e039353a630abdb0bf78" ON "transaction" ("retentionManagerId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_f02207e039353a630abdb0bf782" FOREIGN KEY ("retentionManagerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "IDX_f02207e039353a630abdb0bf78" ON "transaction"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_f02207e039353a630abdb0bf782"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "retentionManagerName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "retentionManagerId"`,
    );
  }
}
