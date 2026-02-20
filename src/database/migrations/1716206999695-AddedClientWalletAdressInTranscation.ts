import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedClientWalletAdressInTranscation1716206999695
  implements MigrationInterface
{
  name = 'AddedClientWalletAdressInTranscation1716206999695';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "cryptoClientWalletAddress" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "cryptoCoinName" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "paidCryptoCoin" float`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "paidCryptoCoin"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "cryptoCoinName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "cryptoClientWalletAddress"`,
    );
  }
}
