import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBankAcccount1708343419601 implements MigrationInterface {
  name = 'AddBankAcccount1708343419601';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bank_account" ("id" int NOT NULL IDENTITY(1,1), "currency" varchar(100) NOT NULL, "accountName" varchar(100) NOT NULL, "iban" varchar(100), "swift" varchar(100), "bankName" varchar(100) NOT NULL, "bankAddress" varchar(100), "additionalInformation" varchar(100) NOT NULL, "reference" varchar(100) NOT NULL, "accountNumber" varchar(100), "companyAddress" varchar(100), "intermediateBankName" varchar(100), "sortCode" varchar(100), "branchCode" varchar(100), "branchName" varchar(100), "createdAt" datetime NOT NULL CONSTRAINT "DF_858933c6dee814d948df70e352b" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_f4beaf343e9ab24f5b253df19a8" DEFAULT getdate(), "logoId" uniqueidentifier, CONSTRAINT "PK_f3246deb6b79123482c6adb9745" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "bank_account" ADD CONSTRAINT "FK_56d4e6f416e972912bf84cffca8" FOREIGN KEY ("logoId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bank_account" DROP CONSTRAINT "FK_56d4e6f416e972912bf84cffca8"`,
    );
    await queryRunner.query(`DROP TABLE "bank_account"`);
  }
}
