import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWithdrawRequestTableAndJoinInTranscation1709319605057
  implements MigrationInterface
{
  name = 'AddWithdrawRequestTableAndJoinInTranscation1709319605057';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "withdraw_request" ("id" int NOT NULL IDENTITY(1,1), "type" nvarchar(255) CONSTRAINT CHK_a9630141a47a61ec5946bfae20_ENUM CHECK(type IN ('BANK_WIRE_TRANSFER','CRYPTO','CREDIT/DEBIT_CARD')) NOT NULL, "login" varchar(255), "cardNumber" varchar(255), "cardHolderName" varchar(255), "cryptoCurrency" varchar(255), "cryptoAddress" varchar(255), "createdAt" datetime NOT NULL CONSTRAINT "DF_d6280f8ff64d20c310ba9a6f537" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_74172591349f9fcaab805f979a0" DEFAULT getdate(), "walletId" int, "bankDetailId" int, "userId" int, CONSTRAINT "PK_02e70a169eff16575401fe2239a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "withdrawRequestId" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "withdraw_request" ADD CONSTRAINT "FK_cedbdeb1f7c249a43c5b89519cb" FOREIGN KEY ("walletId") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "withdraw_request" ADD CONSTRAINT "FK_ca16f68323eb7cd2e32059d86bd" FOREIGN KEY ("bankDetailId") REFERENCES "bank_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "withdraw_request" ADD CONSTRAINT "FK_2fd16b7dd44d808343916ee7181" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_629f82cf6e801ebc31b0f8cf43b" FOREIGN KEY ("withdrawRequestId") REFERENCES "withdraw_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_629f82cf6e801ebc31b0f8cf43b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "withdraw_request" DROP CONSTRAINT "FK_2fd16b7dd44d808343916ee7181"`,
    );
    await queryRunner.query(
      `ALTER TABLE "withdraw_request" DROP CONSTRAINT "FK_ca16f68323eb7cd2e32059d86bd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "withdraw_request" DROP CONSTRAINT "FK_cedbdeb1f7c249a43c5b89519cb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "withdrawRequestId"`,
    );
    await queryRunner.query(`DROP TABLE "withdraw_request"`);
  }
}
