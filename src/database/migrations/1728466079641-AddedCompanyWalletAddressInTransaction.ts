import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedCompanyWalletAddressInTransaction1728466079641
  implements MigrationInterface
{
  name = 'AddedCompanyWalletAddressInTransaction1728466079641';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "companyWalletAddress" varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "companyWalletAddress"`,
    );
  }
}
