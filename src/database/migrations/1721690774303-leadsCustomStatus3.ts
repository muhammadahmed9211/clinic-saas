import { MigrationInterface, QueryRunner } from 'typeorm';

export class LeadsCustomStatus31721690774303 implements MigrationInterface {
  name = 'LeadsCustomStatus31721690774303';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "preferredTime"`);
    await queryRunner.query(
      `ALTER TABLE "lead" ADD "preferredTime" varchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "preferredTime"`);
    await queryRunner.query(`ALTER TABLE "lead" ADD "preferredTime" datetime`);
  }
}
