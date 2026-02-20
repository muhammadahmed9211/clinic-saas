import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNameAndBeneficiaryNameInUserBankDetail1709299147657
  implements MigrationInterface
{
  name = 'AddNameAndBeneficiaryNameInUserBankDetail1709299147657';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bank_detail" ADD "name" varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bank_detail" ADD "beneficiaryName" varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bank_detail" DROP COLUMN "beneficiaryName"`,
    );
    await queryRunner.query(`ALTER TABLE "bank_detail" DROP COLUMN "name"`);
  }
}
