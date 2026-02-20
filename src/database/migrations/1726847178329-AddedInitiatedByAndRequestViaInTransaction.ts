import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedInitiatedByAndRequestViaInTransaction1726847178329
  implements MigrationInterface
{
  name = 'AddedInitiatedByAndRequestViaInTransaction1726847178329';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "requestVia" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "initiatedById" int`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9cdad3c88a668bfc7532d4c6b6" ON "transaction" ("initiatedById") `,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_9cdad3c88a668bfc7532d4c6b68" FOREIGN KEY ("initiatedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_9cdad3c88a668bfc7532d4c6b68"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_9cdad3c88a668bfc7532d4c6b6" ON "transaction"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "initiatedById"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "requestVia"`,
    );
  }
}
