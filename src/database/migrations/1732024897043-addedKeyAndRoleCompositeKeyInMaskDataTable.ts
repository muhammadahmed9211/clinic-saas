import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedKeyAndRoleCompositeKeyInMaskDataTable1732024897043
  implements MigrationInterface
{
  name = 'AddedKeyAndRoleCompositeKeyInMaskDataTable1732024897043';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mask_data" ADD CONSTRAINT "mask_data_unique" UNIQUE ("roleId", "key")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mask_data" DROP CONSTRAINT "mask_data_unique"`,
    );
  }
}
