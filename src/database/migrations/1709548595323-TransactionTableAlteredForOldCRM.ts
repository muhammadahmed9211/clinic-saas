import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionTableAlteredForOldCRMAgain1709548595323
  implements MigrationInterface
{
  name = 'TransactionTableAlteredForOldCRMAgain1709548595323';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "customParam1" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "customParam2" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "customParam3" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "customParam4" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "customParam5" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "customParam6" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "customParam7" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "customParam8" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "customParam9" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "customParam10" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "customParam11" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "customParam12" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "customParam13" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "customParam14" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "customParam15" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "customParam16" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "customParam17" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "customParam18" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "customParam19" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "customParam20" varchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" ADD "pspId" bigint`);
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "request" nvarchar(max)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "response" nvarchar(max)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "responseTime" datetime`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "cardExpirationMonth" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "cardExpirationYear" varchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" ADD "isFtd" tinyint`);
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "decisionTime" datetime`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "parentRequestId" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "ownerExternalId" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "cardHolderName" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "externalAmount" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "externalCurrency" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "requestIdType" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "subPspPaymentMethod" varchar(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "binType" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "cardIssuer" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "cardType" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "subPspName" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "subPspTransactionId" varchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" ADD "ip" varchar(255)`);
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "requestId" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "is3dSecure" bit NOT NULL CONSTRAINT "DF_0fd30f07e2f2722a5216e4195a0" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "isTest" bit NOT NULL CONSTRAINT "DF_354959fee4d6455682553eeffea" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "isResumable" bit NOT NULL CONSTRAINT "DF_58df364ce21cc997da26e809f7e" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "isManual" bit NOT NULL CONSTRAINT "DF_8d995b3a0bb84ba3db4de1df606" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "normalizedAmount" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "normalizedFee" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "indexName" varchar(255) NOT NULL CONSTRAINT "DF_eac24e72253181b647eebe11c64" DEFAULT 'malfex'`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "subIndexName" varchar(255) NOT NULL CONSTRAINT "DF_c1ee49fcd382373671620fea545" DEFAULT 'SUBIDX_0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "DF_c1ee49fcd382373671620fea545"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "subIndexName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "DF_eac24e72253181b647eebe11c64"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "indexName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "normalizedFee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "normalizedAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "DF_8d995b3a0bb84ba3db4de1df606"`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "isManual"`);
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "DF_58df364ce21cc997da26e809f7e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "isResumable"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "DF_354959fee4d6455682553eeffea"`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "isTest"`);
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "DF_0fd30f07e2f2722a5216e4195a0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "is3dSecure"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "requestId"`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "ip"`);
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "subPspTransactionId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "subPspName"`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "cardType"`);
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "cardIssuer"`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "binType"`);
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "subPspPaymentMethod"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "requestIdType"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "externalCurrency"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "externalAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "cardHolderName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "ownerExternalId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "parentRequestId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "decisionTime"`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "isFtd"`);
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "cardExpirationYear"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "cardExpirationMonth"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "responseTime"`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "response"`);
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "request"`);
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "pspId"`);
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "customParam20"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "customParam19"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "customParam18"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "customParam17"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "customParam16"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "customParam15"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "customParam14"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "customParam13"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "customParam12"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "customParam11"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "customParam10"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "customParam9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "customParam8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "customParam7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "customParam6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "customParam5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "customParam4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "customParam3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "customParam2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "customParam1"`,
    );
  }
}
