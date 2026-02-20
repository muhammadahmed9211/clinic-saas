import { MigrationInterface, QueryRunner } from 'typeorm';

export class IBProfileChanges1756901046871 implements MigrationInterface {
  name = 'IBProfileChanges1756901046871';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ib_commission_profile" ADD "description" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ib_commission_profile" DROP COLUMN "description"`,
    );
  }
}
