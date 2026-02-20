import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedCryptoMethodInTranscationMethods1710501084303
  implements MigrationInterface
{
  name = 'AddedCryptoMethodInTranscationMethods1710501084303';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "CHK_7f79e4b8a1f6f8a213dd93d0c2_ENUM"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "CHK_fb681d0e65b6a891b2158a218c_ENUM" CHECK (method IN ('CREDIT_CARD','WIRE','MIGRATION','INTERNAL_TRANSFER','EXTERNAL_EXCHANGE','NONE','CRYPTO'))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "CHK_7f79e4b8a1f6f8a213dd93d0c2_ENUM" CHECK (method IN ('CREDIT_CARD','WIRE','MIGRATION','INTERNAL_TRANSFER','EXTERNAL_EXCHANGE','NONE'))`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "CHK_fb681d0e65b6a891b2158a218c_ENUM"`,
    );
  }
}
