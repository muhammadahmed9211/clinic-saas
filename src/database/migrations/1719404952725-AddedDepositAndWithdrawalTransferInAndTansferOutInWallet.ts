import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedDepositAndWithdrawalTransferInAndTansferOutInWallet1719404952725
  implements MigrationInterface
{
  name =
    'AddedDepositAndWithdrawalTransferInAndTansferOutInWallet1719404952725';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "totalDeposit" float NOT NULL CONSTRAINT "DF_7cb94bd3ab4e96f8422acdad703" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "totalWithdraw" float NOT NULL CONSTRAINT "DF_29a31546a197a0860dd90b55e89" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "totalTransferIn" float NOT NULL CONSTRAINT "DF_637550d44c32b60b2bfd59d28d0" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "totalTransferOut" float NOT NULL CONSTRAINT "DF_1c5a59df854a4e0e99a41fbc69a" DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wallet" DROP CONSTRAINT "DF_1c5a59df854a4e0e99a41fbc69a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" DROP COLUMN "totalTransferOut"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" DROP CONSTRAINT "DF_637550d44c32b60b2bfd59d28d0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" DROP COLUMN "totalTransferIn"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" DROP CONSTRAINT "DF_29a31546a197a0860dd90b55e89"`,
    );
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "totalWithdraw"`);
    await queryRunner.query(
      `ALTER TABLE "wallet" DROP CONSTRAINT "DF_7cb94bd3ab4e96f8422acdad703"`,
    );
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "totalDeposit"`);
  }
}
