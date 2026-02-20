import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterCustomStatusAndClient1709734922539
  implements MigrationInterface
{
  name = 'AlterCustomStatusAndClient1709734922539';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "custom_status" DROP CONSTRAINT "CHK_809dbdb342d7f734342f3bf64f_ENUM"`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_status" ADD CONSTRAINT "CHK_0d4411d90c4fdd3ca8984903ac_ENUM" CHECK (type IN ('sales','retention','client_potential','audit_status'))`,
    );
    await queryRunner.query(
      `DROP INDEX "REL_ee77d0dd324463bf84b951ff4a" ON "client"`,
    );
    await queryRunner.query(
      `DROP INDEX "REL_8d34c5f89d637582108be9a3a0" ON "client"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "FK_3d93741106b0d1deb3f11496aeb" FOREIGN KEY ("clientPotential") REFERENCES "custom_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "FK_29ac06bb857e62d762950546999" FOREIGN KEY ("auditStatus") REFERENCES "custom_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "custom_status" ADD CONSTRAINT "CHK_809dbdb342d7f734342f3bf64f_ENUM" CHECK (type IN ('sales','retention'))`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_status" DROP CONSTRAINT "CHK_0d4411d90c4fdd3ca8984903ac_ENUM"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "FK_29ac06bb857e62d762950546999"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "FK_3d93741106b0d1deb3f11496aeb"`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "REL_8d34c5f89d637582108be9a3a0" ON "client" ("internalRetentionStatus") WHERE ([internalRetentionStatus] IS NOT NULL)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "REL_ee77d0dd324463bf84b951ff4a" ON "client" ("internalSalesStatus") WHERE ([internalSalesStatus] IS NOT NULL)`,
    );
  }
}
