import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyMaskData1732622858534 implements MigrationInterface {
  name = 'ModifyMaskData1732622858534';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mask_data" ADD "deletedAt" datetime2`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "mask_data" DROP COLUMN "deletedAt"`);
  }
}
