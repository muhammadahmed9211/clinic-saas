import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserCreditCardDetails1715953829135 implements MigrationInterface {
  name = 'UserCreditCardDetails1715953829135';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_credit_card" ("id" int NOT NULL IDENTITY(1,1), "type" varchar(255) NOT NULL, "expiration" varchar(255) NOT NULL, "number" varchar(255), "holderName" varchar(255) NOT NULL, "totalDeposit" float NOT NULL CONSTRAINT "DF_4cee6a783cd20289373bc9725e4" DEFAULT 0, "totalWithdrawal" float NOT NULL CONSTRAINT "DF_6141c62e3c7cffe46d35acff3e5" DEFAULT 0, "createdAt" datetime NOT NULL CONSTRAINT "DF_2b2d6ba342dfafc448f72a3c356" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_f1186a6f56d8d0131b0dbe032cf" DEFAULT getdate(), "deletedAt" datetime2, "userId" int NOT NULL, CONSTRAINT "PK_fbc627fe77cc28f7c7476ed9291" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_credit_card" ADD CONSTRAINT "FK_9f09f210c37c31080db601a69aa" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_credit_card" DROP CONSTRAINT "FK_9f09f210c37c31080db601a69aa"`,
    );
    await queryRunner.query(`DROP TABLE "user_credit_card"`);
  }
}
