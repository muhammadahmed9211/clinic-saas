import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOperator1726642844232 implements MigrationInterface {
  name = 'UpdateOperator1726642844232';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "operator" ADD "first_name" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ADD "last_name" varchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "operator" DROP COLUMN "last_name"`);
    await queryRunner.query(`ALTER TABLE "operator" DROP COLUMN "first_name"`);
  }
}
