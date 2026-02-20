import { MigrationInterface, QueryRunner } from 'typeorm';

export class BankDetailsEntityAltered1718886190989
  implements MigrationInterface
{
  name = 'BankDetailsEntityAltered1718886190989';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bank_detail" ADD "branchName" varchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bank_detail" DROP COLUMN "branchName"`,
    );
  }
}
