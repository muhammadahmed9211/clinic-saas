import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedDashboardJoinWithRole1749637050969
  implements MigrationInterface
{
  name = 'AddedDashboardJoinWithRole1749637050969';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "role" ADD "dashboardId" int`);
    await queryRunner.query(
      `ALTER TABLE "role" ADD CONSTRAINT "FK_a5a24c8272be6edfb5a4f6876f2" FOREIGN KEY ("dashboardId") REFERENCES "custom_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role" DROP CONSTRAINT "FK_a5a24c8272be6edfb5a4f6876f2"`,
    );
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "dashboardId"`);
  }
}
