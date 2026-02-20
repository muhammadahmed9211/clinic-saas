import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransctionTypeAltered1716904761396 implements MigrationInterface {
  name = 'TransctionTypeAltered1716904761396';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "CHK_36557d5dabdace2795aef5b245_ENUM"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "CHK_53f25d8655be7b5509de87f6b8_ENUM" CHECK (type IN ('DEPOSIT','WITHDRAW','TRANSFER_IN','TRANSFER_OUT','CREDIT_IN','CREDIT_OUT','FEE'))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "CHK_36557d5dabdace2795aef5b245_ENUM" CHECK (type IN ('DEPOSIT','WITHDRAW','TRANSFER_IN','TRANSFER_OUT','CREDIT','FEE'))`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "CHK_53f25d8655be7b5509de87f6b8_ENUM"`,
    );
  }
}
