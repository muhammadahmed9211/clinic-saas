import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyClientTable1744130457323 implements MigrationInterface {
  name = 'ModifyClientTable1744130457323';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" ADD "retentionActionDate" datetime`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "retentionActionDate"`,
    );
  }
}
