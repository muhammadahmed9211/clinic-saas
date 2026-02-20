import { MigrationInterface, QueryRunner } from 'typeorm';

export class DobTypeAlter1717482849117 implements MigrationInterface {
  name = 'DobTypeAlter1717482849117';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "dateOfBirth"`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "dateOfBirth" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "dateOfBirth"`);
    await queryRunner.query(`ALTER TABLE "client" ADD "dateOfBirth" datetime`);
  }
}
