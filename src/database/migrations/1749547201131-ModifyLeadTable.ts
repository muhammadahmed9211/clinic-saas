import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyLeadTable1749547201131 implements MigrationInterface {
  name = 'ModifyLeadTable1749547201131';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lead" ADD "nextActionTime" datetime`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "nextActionTime"`);
  }
}
