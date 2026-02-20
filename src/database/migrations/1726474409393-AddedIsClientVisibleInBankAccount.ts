import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedIsClientVisibleInBankAccount1726474409393
  implements MigrationInterface
{
  name = 'AddedIsClientVisibleInBankAccount1726474409393';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bank_account" ADD "country" varchar(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "bank_account" ADD "isClientVisible" bit NOT NULL CONSTRAINT "DF_ebb39d29569835ce80ce09d5ac2" DEFAULT 1`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bank_account" DROP CONSTRAINT "DF_ebb39d29569835ce80ce09d5ac2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bank_account" DROP COLUMN "isClientVisible"`,
    );
    await queryRunner.query(`ALTER TABLE "bank_account" DROP COLUMN "country"`);
  }
}
