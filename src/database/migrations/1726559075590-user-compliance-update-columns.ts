import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserComplianceUpdateColumns1726559075590
  implements MigrationInterface
{
  name = 'UserComplianceUpdateColumns1726559075590';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `EXEC sp_rename "user_compliance.userComplianceData", "userComplianceRecord"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_compliance" DROP COLUMN "userComplianceRecord"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_compliance" ADD "userComplianceRecord" nvarchar(MAX) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_compliance" DROP COLUMN "userComplianceRecord"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_compliance" ADD "userComplianceRecord" nvarchar(255)`,
    );
    await queryRunner.query(
      `EXEC sp_rename "user_compliance.userComplianceRecord", "userComplianceData"`,
    );
  }
}
