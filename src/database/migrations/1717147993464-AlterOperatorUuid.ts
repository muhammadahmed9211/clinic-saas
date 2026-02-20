import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterOperatorUuid1717147993464 implements MigrationInterface {
  name = 'AlterOperatorUuid1717147993464';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "operator" DROP COLUMN "hash"`);
    await queryRunner.query(
      `ALTER TABLE "operator" ADD "uuid" uniqueidentifier`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "operator" DROP COLUMN "uuid"`);
    await queryRunner.query(`ALTER TABLE "operator" ADD "hash" nvarchar(255)`);
  }
}
