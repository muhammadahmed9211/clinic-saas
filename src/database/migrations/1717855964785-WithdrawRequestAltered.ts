import { MigrationInterface, QueryRunner } from 'typeorm';

export class WithdrawRequestAltered1717855964785 implements MigrationInterface {
  name = 'WithdrawRequestAltered1717855964785';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "withdraw_request" DROP CONSTRAINT "CHK_4f0737a117bd5573ec59d261cf_ENUM"`,
    );
    await queryRunner.query(
      `ALTER TABLE "withdraw_request" ADD CONSTRAINT "CHK_eeb66c8a20895dbf8f2dda801a_ENUM" CHECK (type IN ('BANK_WIRE_TRANSFER','CRYPTO','CREDIT/DEBIT_CARD','NONE','E_WALLET'))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "withdraw_request" ADD CONSTRAINT "CHK_4f0737a117bd5573ec59d261cf_ENUM" CHECK (type IN ('BANK_WIRE_TRANSFER','CRYPTO','CREDIT/DEBIT_CARD','NONE'))`,
    );
    await queryRunner.query(
      `ALTER TABLE "withdraw_request" DROP CONSTRAINT "CHK_eeb66c8a20895dbf8f2dda801a_ENUM"`,
    );
  }
}
