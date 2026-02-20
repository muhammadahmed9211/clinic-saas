import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemovedKeyPartner1708414491346 implements MigrationInterface {
  name = 'RemovedKeyPartner1708414491346';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "partner_list" DROP COLUMN "key"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner_list" ADD "key" int NOT NULL`,
    );
  }
}
