import { MigrationInterface, QueryRunner } from 'typeorm';

export class RegulationTypeAlter1717367309827 implements MigrationInterface {
  name = 'RegulationTypeAlter1717367309827';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "regulations"`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "regulations" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "regulations"`);
    await queryRunner.query(`ALTER TABLE "client" ADD "regulations" text`);
  }
}
