import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterPartnerStatus1716971589167 implements MigrationInterface {
  name = 'AlterPartnerStatus1716971589167';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner" DROP CONSTRAINT "DF_1289e75484c1db0d5c141c26105"`,
    );
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "approved"`);
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "approved" nvarchar(255) CONSTRAINT CHK_10ce29429475297c2eee375aca_ENUM CHECK(approved IN ('APPROVE','REJECT','PENDING'))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "approved"`);
    await queryRunner.query(`ALTER TABLE "partner" ADD "approved" bit`);
    await queryRunner.query(
      `ALTER TABLE "partner" ADD CONSTRAINT "DF_1289e75484c1db0d5c141c26105" DEFAULT 1 FOR "approved"`,
    );
  }
}
