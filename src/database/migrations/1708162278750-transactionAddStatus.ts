import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionAddStatus1708162278750 implements MigrationInterface {
  name = 'TransactionAddStatus1708162278750';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "CHK_0e7992050e828610ca5caf2da4_ENUM"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "CHK_2a2d367e5e2a35bfbf438ac9d9_ENUM" CHECK (status IN ('IDLE','INITIALIZED','PROCESSED','APPROVED_ON_HOLD','APPROVED','CANCELLED','COMPLETED','FAILED'))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "CHK_0e7992050e828610ca5caf2da4_ENUM" CHECK (status IN ('0','1','2','3','4','5','6','7'))`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "CHK_2a2d367e5e2a35bfbf438ac9d9_ENUM"`,
    );
  }
}
