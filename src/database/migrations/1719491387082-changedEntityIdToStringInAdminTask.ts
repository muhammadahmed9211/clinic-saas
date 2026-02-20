import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangedEntityIdToStringInAdminTask1719491387082
  implements MigrationInterface
{
  name = 'ChangedEntityIdToStringInAdminTask1719491387082';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admin_task" DROP CONSTRAINT "CHK_bbba937a1801d0e1a22fe044fa"`,
    );
    await queryRunner.query(`ALTER TABLE "admin_task" DROP COLUMN "entityId"`);
    await queryRunner.query(
      `ALTER TABLE "admin_task" ADD "entityId" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" ADD CONSTRAINT "CHK_1ae7d9b51f9910856be5091235" CHECK ("entity" IN ('general','client','operator','partner', 'transaction'))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admin_task" DROP CONSTRAINT "CHK_1ae7d9b51f9910856be5091235"`,
    );
    await queryRunner.query(`ALTER TABLE "admin_task" DROP COLUMN "entityId"`);
    await queryRunner.query(
      `ALTER TABLE "admin_task" ADD "entityId" int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" ADD CONSTRAINT "CHK_bbba937a1801d0e1a22fe044fa" CHECK (([entity]='partner' OR [entity]='operator' OR [entity]='client' OR [entity]='general'))`,
    );
  }
}
