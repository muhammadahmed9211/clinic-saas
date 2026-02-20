import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedKeyAndRoleCompositeKeyInMaskDataTable1732025060160
  implements MigrationInterface
{
  name = 'AddedKeyAndRoleCompositeKeyInMaskDataTable1732025060160';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mask_data" DROP CONSTRAINT "UQ_ba4092244b1e61cd519e54ff3a3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mask_data" ADD CONSTRAINT "mask_data_unique" UNIQUE ("roleId", "key")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mask_data" DROP CONSTRAINT "mask_data_unique"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mask_data" DROP CONSTRAINT "mask_data_unique"`,
    );
  }
}
