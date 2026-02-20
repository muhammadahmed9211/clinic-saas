import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserComplianceTable1726483111623 implements MigrationInterface {
  name = 'UserComplianceTable1726483111623';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_compliance" ADD "clientId" int`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "REL_fb9fdd21d2fbdf7b60d00202f2" ON "user_compliance" ("clientId") WHERE "clientId" IS NOT NULL`,
    );
    // await queryRunner.query(
    //   `ALTER TABLE "communication" ADD CONSTRAINT "FK_045a80cba824af9448fe63c41ce" FOREIGN KEY ("leadId") REFERENCES "lead"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    // );
    await queryRunner.query(
      `ALTER TABLE "user_compliance" ADD CONSTRAINT "FK_fb9fdd21d2fbdf7b60d00202f2a" FOREIGN KEY ("clientId") REFERENCES "client"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_compliance" DROP CONSTRAINT "FK_fb9fdd21d2fbdf7b60d00202f2a"`,
    );

    await queryRunner.query(
      `DROP INDEX "REL_fb9fdd21d2fbdf7b60d00202f2" ON "user_compliance"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_compliance" DROP COLUMN "clientId"`,
    );
  }
}
