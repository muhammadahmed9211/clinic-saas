import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserCompliance1726481827352 implements MigrationInterface {
  name = 'UserCompliance1726481827352';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_compliance" ("id" int NOT NULL IDENTITY(1,1), "userComplianceData" nvarchar(255), CONSTRAINT "PK_67b364420404209cd1fdccc3efe" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_compliance"`);
  }
}
