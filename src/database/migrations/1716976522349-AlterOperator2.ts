import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterOperator21716976522349 implements MigrationInterface {
  name = 'AlterOperator21716976522349';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "operator" ADD "hash" nvarchar(255)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "operator" DROP COLUMN "hash"`);
  }
}
