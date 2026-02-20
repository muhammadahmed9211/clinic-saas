import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateRoleDashboardWidget1725961111372
  implements MigrationInterface
{
  name = 'UpdateRoleDashboardWidget1725961111372';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role_dashboard_widget" DROP CONSTRAINT "FK_4216ff09f620925c4e928e9be94"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_dashboard_widget" DROP CONSTRAINT "FK_fdf9e07bc33f671d007e7c5c346"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_dashboard_widget" DROP COLUMN "eligibleColumn"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_dashboard_widget" DROP COLUMN "eligibleRow"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_dashboard_widget" DROP COLUMN "dashboardWidgetId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_dashboard_widget" ADD "widgetJson" nvarchar(MAX) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_dashboard_widget" ADD CONSTRAINT "FK_4216ff09f620925c4e928e9be94" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role_dashboard_widget" DROP CONSTRAINT "FK_4216ff09f620925c4e928e9be94"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_dashboard_widget" DROP COLUMN "widgetJson"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_dashboard_widget" ADD "dashboardWidgetId" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_dashboard_widget" ADD "eligibleRow" int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_dashboard_widget" ADD "eligibleColumn" int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_dashboard_widget" ADD CONSTRAINT "FK_fdf9e07bc33f671d007e7c5c346" FOREIGN KEY ("dashboardWidgetId") REFERENCES "dashboard_widget"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_dashboard_widget" ADD CONSTRAINT "FK_4216ff09f620925c4e928e9be94" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
