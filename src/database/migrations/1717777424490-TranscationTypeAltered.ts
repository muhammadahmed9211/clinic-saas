import { MigrationInterface, QueryRunner } from 'typeorm';

export class TranscationTypeAltered1717777424490 implements MigrationInterface {
  name = 'TranscationTypeAltered1717777424490';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "CHK_53f25d8655be7b5509de87f6b8_ENUM"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "CHK_c47884d8d32ade91b34e31e7bc_ENUM" CHECK (type IN ('DEPOSIT','WITHDRAW','TRANSFER_IN','TRANSFER_OUT','CREDIT_IN','CREDIT_OUT','BONUS_IN','BONUS_OUT','FEE'))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "CHK_53f25d8655be7b5509de87f6b8_ENUM" CHECK (type IN ('DEPOSIT','WITHDRAW','TRANSFER_IN','TRANSFER_OUT','CREDIT_IN','CREDIT_OUT','FEE'))`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "CHK_c47884d8d32ade91b34e31e7bc_ENUM"`,
    );
  }
}
