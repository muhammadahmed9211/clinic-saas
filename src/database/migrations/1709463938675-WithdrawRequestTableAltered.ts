import { MigrationInterface, QueryRunner } from 'typeorm';

export class WithdrawRequestTableAltered1709463938675
  implements MigrationInterface
{
  name = 'WithdrawRequestTableAltered1709463938675';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "withdraw_request" DROP CONSTRAINT "CHK_a9630141a47a61ec5946bfae20_ENUM"`,
    );
    await queryRunner.query(
      `ALTER TABLE "withdraw_request" ADD CONSTRAINT "CHK_4f0737a117bd5573ec59d261cf_ENUM" CHECK (type IN ('BANK_WIRE_TRANSFER','CRYPTO','CREDIT/DEBIT_CARD','NONE'))`,
    );
    await queryRunner.query(
      `ALTER TABLE "withdraw_request" ADD "subType" nvarchar(255) NOT NULL CONSTRAINT "DF_0a2a560b9933c50dfc5726c96c0" DEFAULT 'CLIENT_REQUEST'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "withdraw_request" ADD CONSTRAINT "CHK_a9630141a47a61ec5946bfae20_ENUM" CHECK (type IN ('BANK_WIRE_TRANSFER','CRYPTO','CREDIT/DEBIT_CARD'))`,
    );
    await queryRunner.query(
      `ALTER TABLE "withdraw_request" DROP CONSTRAINT "CHK_4f0737a117bd5573ec59d261cf_ENUM"`,
    );
    await queryRunner.query(
      `ALTER TABLE "withdraw_request" DROP CONSTRAINT "DF_0a2a560b9933c50dfc5726c96c0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "withdraw_request" DROP COLUMN "subType"`,
    );
  }
}
