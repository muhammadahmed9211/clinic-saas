import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateLeadTable1725185920714 implements MigrationInterface {
  name = 'UpdateLeadTable1725185920714';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lead" ADD "salesManager" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "salesManager"`);
  }
}
