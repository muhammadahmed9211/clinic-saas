import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionAddedUserEWallet1716797487032
  implements MigrationInterface
{
  name = 'TransactionAddedUserEWallet1716797487032';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction" ADD "eWalletId" int`);
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_cd2aeadbce17f8b8af61dda98da" FOREIGN KEY ("eWalletId") REFERENCES "user-e-wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_cd2aeadbce17f8b8af61dda98da"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "eWalletId"`,
    );
  }
}
