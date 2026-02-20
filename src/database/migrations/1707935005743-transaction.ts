import { MigrationInterface, QueryRunner } from 'typeorm';

export class Transaction1707935005743 implements MigrationInterface {
  name = 'Transaction1707935005743';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "lastStatus" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "referenceKey" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "referenceKeyName" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9"`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "id" uniqueidentifier NOT NULL CONSTRAINT "DF_89eadb93a89810556e1cbcd6ab9" DEFAULT NEWSEQUENTIALID()`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "CHK_5c3225cc2e04bee8727544c3d6_ENUM"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "CHK_0e7992050e828610ca5caf2da4_ENUM" CHECK (status IN ('0','1','2','3','4','5','6','7'))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "CHK_5c3225cc2e04bee8727544c3d6_ENUM" CHECK (status IN ('0','1','2','3','4'))`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "CHK_0e7992050e828610ca5caf2da4_ENUM"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9"`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "id" int NOT NULL IDENTITY(1,1)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "referenceKeyName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "referenceKey"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "lastStatus"`,
    );
  }
}
