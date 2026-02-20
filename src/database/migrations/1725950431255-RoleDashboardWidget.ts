import { MigrationInterface, QueryRunner } from 'typeorm';

export class RoleDashboardWidget1725950431255 implements MigrationInterface {
  name = 'RoleDashboardWidget1725950431255';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "role_dashboard_widget" ("id" int NOT NULL IDENTITY(1,1), "widgetJson" nvarchar(MAX) NOT NULL, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_c6fe5b675ed6556eceb27e204b2" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_38bad6e3024960075dd4c09a45b" DEFAULT getdate(), "deletedAt" datetime2, "roleId" int, CONSTRAINT "PK_260b9e6cc2fd0a8e45f6e2d57aa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_dashboard_widget" ADD CONSTRAINT "FK_4216ff09f620925c4e928e9be94" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role_dashboard_widget" DROP CONSTRAINT "FK_4216ff09f620925c4e928e9be94"`,
    );
    await queryRunner.query(`DROP TABLE "role_dashboard_widget"`);
  }
}
