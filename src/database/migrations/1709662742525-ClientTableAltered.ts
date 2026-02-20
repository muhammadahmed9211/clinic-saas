import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClientTableAltered1709662742525 implements MigrationInterface {
  name = 'ClientTableAltered1709662742525';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "client" ADD "completedSteps" int`);
    await queryRunner.query(`ALTER TABLE "client" ADD "kycStatus" int`);
    await queryRunner.query(`ALTER TABLE "client" ADD "notes" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "notes"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "kycStatus"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "completedSteps"`,
    );
  }
}
