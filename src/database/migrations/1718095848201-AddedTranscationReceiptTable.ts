import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedTranscationReceiptTable1718095848201
  implements MigrationInterface
{
  name = 'AddedTranscationReceiptTable1718095848201';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "transaction_receipt" ("id" int NOT NULL IDENTITY(1,1), "createdAt" datetime NOT NULL CONSTRAINT "DF_424f530d568012e5829ac2e80af" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_fd60d60bc31ddebf442b5879e82" DEFAULT getdate(), "deletedAt" datetime2, "fileId" uniqueidentifier, "transactionId" uniqueidentifier NOT NULL, CONSTRAINT "PK_481076abe0c62b50172a89f7a50" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_receipt" ADD CONSTRAINT "FK_cbd0d4522347fdbd42f2ddfa566" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_receipt" ADD CONSTRAINT "FK_d850256692d7908c217c35e88fa" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction_receipt" DROP CONSTRAINT "FK_d850256692d7908c217c35e88fa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_receipt" DROP CONSTRAINT "FK_cbd0d4522347fdbd42f2ddfa566"`,
    );
    await queryRunner.query(`DROP TABLE "transaction_receipt"`);
  }
}
